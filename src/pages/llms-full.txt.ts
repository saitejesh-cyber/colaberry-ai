import type { GetServerSideProps } from "next";
import {
  fetchAgents,
  fetchMCPServers,
  fetchSkills,
  fetchUseCases,
  fetchPodcastEpisodes,
  fetchArticles,
  fetchBooks,
  fetchCaseStudies,
} from "../lib/cms";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai";

type IndexEntity = {
  slug?: string | null;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  summary?: string | null;
  status?: string | null;
  industry?: string | null;
  category?: string | null;
  publishedDate?: string | null;
  publishDate?: string | null;
  publishedAt?: string | null;
  author?: string | null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1200");

  const [agentsR, mcpR, skillsR, useCasesR, podcastsR, articlesR, booksR, caseStudiesR] =
    await Promise.allSettled([
      fetchAgents("public"),
      fetchMCPServers("public"),
      fetchSkills("public"),
      fetchUseCases("public"),
      fetchPodcastEpisodes(),
      fetchArticles(),
      fetchBooks(),
      fetchCaseStudies(),
    ]);

  const agents = agentsR.status === "fulfilled" ? agentsR.value : [];
  const mcpServers = mcpR.status === "fulfilled" ? mcpR.value : [];
  const skills = skillsR.status === "fulfilled" ? skillsR.value : [];
  const useCases = useCasesR.status === "fulfilled" ? useCasesR.value : [];
  const podcasts = podcastsR.status === "fulfilled" ? podcastsR.value : [];
  const articles = articlesR.status === "fulfilled" ? articlesR.value : [];
  const books = booksR.status === "fulfilled" ? booksR.value : [];
  const caseStudies = caseStudiesR.status === "fulfilled" ? caseStudiesR.value : [];

  const lines: string[] = [
    "# Colaberry AI — Full Content Index",
    `# Generated: ${new Date().toISOString()}`,
    `# Site: ${SITE}`,
    "",
    `## Agents (${agents.length})`,
    "",
  ];

  for (const a of agents as IndexEntity[]) {
    if (!a.slug) continue;
    const name = a.name || a.title || "Untitled";
    const desc = (a.description || a.summary || "").replace(/\n/g, " ").slice(0, 200);
    const status = a.status || "unknown";
    const industry = a.industry || "";
    const meta = [status, industry].filter(Boolean).join(" | ");
    lines.push(`- ${name} | ${SITE}/aixcelerator/agents/${a.slug} | ${meta} | ${desc}`);
  }

  lines.push("", `## MCP Servers (${mcpServers.length})`, "");
  for (const m of mcpServers as IndexEntity[]) {
    if (!m.slug) continue;
    const name = m.name || m.title || "Untitled";
    const desc = (m.description || m.summary || "").replace(/\n/g, " ").slice(0, 200);
    const status = m.status || "unknown";
    const category = m.category || "";
    const meta = [status, category].filter(Boolean).join(" | ");
    lines.push(`- ${name} | ${SITE}/aixcelerator/mcp/${m.slug} | ${meta} | ${desc}`);
  }

  lines.push("", `## Skills (${skills.length})`, "");
  for (const s of skills as IndexEntity[]) {
    if (!s.slug) continue;
    const name = s.name || s.title || "Untitled";
    const desc = (s.description || s.summary || "").replace(/\n/g, " ").slice(0, 200);
    const status = s.status || "unknown";
    const category = s.category || "";
    const meta = [status, category].filter(Boolean).join(" | ");
    lines.push(`- ${name} | ${SITE}/aixcelerator/skills/${s.slug} | ${meta} | ${desc}`);
  }

  lines.push("", `## Use Cases (${useCases.length})`, "");
  for (const u of useCases as IndexEntity[]) {
    if (!u.slug) continue;
    const name = u.name || u.title || "Untitled";
    const desc = (u.description || u.summary || "").replace(/\n/g, " ").slice(0, 200);
    const industry = u.industry || "";
    const category = u.category || "";
    const meta = [industry, category].filter(Boolean).join(" | ");
    lines.push(`- ${name} | ${SITE}/use-cases/${u.slug} | ${meta} | ${desc}`);
  }

  lines.push("", `## Podcast Episodes (${podcasts.length})`, "");
  for (const p of podcasts as IndexEntity[]) {
    if (!p.slug) continue;
    const title = p.title || "Untitled";
    const desc = (p.description || p.summary || "").replace(/\n/g, " ").slice(0, 200);
    const date = p.publishedDate || p.publishDate || "";
    lines.push(`- ${title} | ${SITE}/resources/podcasts/${p.slug} | ${date} | ${desc}`);
  }

  lines.push("", `## Articles (${articles.length})`, "");
  for (const a of articles as IndexEntity[]) {
    if (!a.slug) continue;
    const title = a.title || "Untitled";
    const desc = (a.description || a.summary || "").replace(/\n/g, " ").slice(0, 200);
    const date = a.publishedAt || a.publishDate || "";
    const author = a.author || "";
    const meta = [date, author].filter(Boolean).join(" | ");
    lines.push(`- ${title} | ${SITE}/resources/articles/${a.slug} | ${meta} | ${desc}`);
  }

  lines.push("", `## Books (${books.length})`, "");
  for (const b of books as IndexEntity[]) {
    const title = b.title || "Untitled";
    const desc = (b.description || b.summary || "").replace(/\n/g, " ").slice(0, 200);
    lines.push(`- ${title} | ${SITE}/resources/books | ${desc}`);
  }

  lines.push("", `## Case Studies (${caseStudies.length})`, "");
  for (const c of caseStudies as IndexEntity[]) {
    const title = c.title || "Untitled";
    const desc = (c.description || c.summary || "").replace(/\n/g, " ").slice(0, 200);
    lines.push(`- ${title} | ${SITE}/resources/case-studies | ${desc}`);
  }

  lines.push("", "---", `# End of index. Total items: ${agents.length + mcpServers.length + skills.length + useCases.length + podcasts.length + articles.length + books.length + caseStudies.length}`);

  res.write(lines.join("\n"));
  res.end();

  return { props: {} };
};

export default function LlmsFullTxt() {
  return null;
}
