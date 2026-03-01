import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import EnterpriseCtaBand from "../components/EnterpriseCtaBand";
import SectionHeader from "../components/SectionHeader";
import StatePanel from "../components/StatePanel";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../lib/seo";
import caseStudies from "../data/caseStudies.json";
import {
  Agent,
  Article,
  MCPServer,
  PodcastEpisode,
  Skill,
  UseCase,
  fetchAgents,
  fetchArticles,
  fetchMCPServers,
  fetchPodcastEpisodes,
  fetchSkills,
  fetchUseCases,
} from "../lib/cms";
import { getIndustryDisplayName } from "../data/caseStudies";

type SearchResultType =
  | "Agents"
  | "Skills"
  | "MCP Servers"
  | "Use Cases"
  | "Podcasts"
  | "Articles"
  | "Case Studies"
  | "Pages";

type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  href: string;
  meta?: string;
};

type SearchPageProps = {
  query: string;
  results: SearchResult[];
  fetchError: boolean;
};

const TYPE_ORDER: SearchResultType[] = [
  "Agents",
  "Skills",
  "MCP Servers",
  "Use Cases",
  "Podcasts",
  "Articles",
  "Case Studies",
  "Pages",
];
const TYPE_LIMITS: Record<SearchResultType, number> = {
  Agents: 12,
  Skills: 12,
  "MCP Servers": 12,
  "Use Cases": 10,
  Podcasts: 8,
  Articles: 8,
  "Case Studies": 10,
  Pages: 6,
};

const STATIC_PAGES: Array<Omit<SearchResult, "id">> = [
  {
    type: "Pages",
    title: "AIXcelerator platform",
    description: "The AI platform powering governed agents and integrations.",
    href: "/aixcelerator",
    meta: "Platform",
  },
  {
    type: "Pages",
    title: "Agents catalog",
    description: "Browse and compare enterprise-ready AI agents.",
    href: "/aixcelerator/agents",
    meta: "Agents",
  },
  {
    type: "Pages",
    title: "Skills catalog",
    description: "Reusable AI capabilities for workflows, domains, and orchestration.",
    href: "/aixcelerator/skills",
    meta: "Skills",
  },
  {
    type: "Pages",
    title: "MCP servers library",
    description: "Connect AI agents to external tools via MCP servers.",
    href: "/aixcelerator/mcp",
    meta: "MCP",
  },
  {
    type: "Pages",
    title: "Use cases",
    description: "See how AI solves real problems, with linked agents and outcomes.",
    href: "/use-cases",
    meta: "Solutions",
  },
  {
    type: "Pages",
    title: "Industries",
    description: "AI solutions tailored to your industry with case studies.",
    href: "/industries",
    meta: "Industries",
  },
  {
    type: "Pages",
    title: "Solutions",
    description: "Ready-to-deploy AI solutions with governance built in.",
    href: "/solutions",
    meta: "Solutions",
  },
  {
    type: "Pages",
    title: "Resources hub",
    description: "Podcasts, white papers, and research to inform your AI strategy.",
    href: "/resources",
    meta: "Resources",
  },
  {
    type: "Pages",
    title: "Articles",
    description: "In-depth analysis and practical implementation guidance.",
    href: "/resources/articles",
    meta: "Resources",
  },
  {
    type: "Pages",
    title: "News and product updates",
    description: "Product releases, AI news, and daily briefings.",
    href: "/updates",
    meta: "Updates",
  },
];

type RawCaseStudy = {
  title?: string;
  challenge?: string[];
  solution?: string[];
  outcomes?: string[];
};

type RawIndustryCaseStudies = {
  industry?: string;
  cases?: RawCaseStudy[];
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function matchesQuery(query: string, fields: Array<string | undefined | null>) {
  const haystack = normalizeText(fields.filter(Boolean).join(" "));
  return haystack.includes(query);
}

function buildAgentResults(query: string, agents: Agent[]): SearchResult[] {
  return agents
    .filter((agent) =>
      matchesQuery(query, [
        agent.name,
        agent.description,
        agent.industry,
        agent.status,
        agent.source,
        ...(agent.tags || []).map((tag) => tag.name || tag.slug || ""),
        ...(agent.companies || []).map((company) => company.name || company.slug || ""),
      ])
    )
    .map((agent) => ({
      id: `agent-${agent.id}`,
      type: "Agents",
      title: agent.name,
      description: agent.description || "Agent catalog entry",
      href: `/aixcelerator/agents/${agent.slug}`,
      meta: [agent.industry, agent.status].filter(Boolean).join(" · ") || "Agent",
    }));
}

function buildSkillResults(query: string, skills: Skill[]): SearchResult[] {
  return skills
    .filter((skill) =>
      matchesQuery(query, [
        skill.name,
        skill.summary,
        skill.longDescription,
        skill.category,
        skill.skillType,
        skill.provider,
        skill.industry,
        skill.status,
        skill.inputs,
        skill.outputs,
        skill.toolsRequired,
        ...(skill.tags || []).map((tag) => tag.name || tag.slug || ""),
        ...(skill.companies || []).map((company) => company.name || company.slug || ""),
        ...(skill.agents || []).map((agent) => agent.name || agent.slug || ""),
        ...(skill.mcpServers || []).map((mcp) => mcp.name || mcp.slug || ""),
        ...(skill.useCases || []).map((useCase) => useCase.name || useCase.slug || ""),
      ])
    )
    .map((skill) => ({
      id: `skill-${skill.id}`,
      type: "Skills",
      title: skill.name,
      description: skill.summary || "Reusable skill profile",
      href: `/aixcelerator/skills/${skill.slug}`,
      meta:
        [skill.category || skill.skillType, skill.provider || skill.sourceName, skill.industry]
          .filter(Boolean)
          .join(" · ") || "Skill",
    }));
}

function buildMcpResults(query: string, servers: MCPServer[]): SearchResult[] {
  return servers
    .filter((server) =>
      matchesQuery(query, [
        server.name,
        server.description,
        server.industry,
        server.category,
        server.status,
        server.source,
        ...(server.tags || []).map((tag) => tag.name || tag.slug || ""),
        ...(server.companies || []).map((company) => company.name || company.slug || ""),
      ])
    )
    .map((server) => ({
      id: `mcp-${server.id}`,
      type: "MCP Servers",
      title: server.name,
      description: server.description || "MCP server catalog entry",
      href: `/aixcelerator/mcp/${server.slug}`,
      meta: [server.industry, server.category].filter(Boolean).join(" · ") || "MCP server",
    }));
}

function buildUseCaseResults(query: string, useCases: UseCase[]): SearchResult[] {
  return useCases
    .filter((item) =>
      matchesQuery(query, [
        item.title,
        item.summary,
        item.longDescription,
        item.problem,
        item.approach,
        item.outcomes,
        item.industry,
        item.category,
        item.status,
        ...(item.tags || []).map((tag) => tag.name || tag.slug || ""),
        ...(item.companies || []).map((company) => company.name || company.slug || ""),
        ...(item.agents || []).map((agent) => agent.name || agent.slug || ""),
        ...(item.mcpServers || []).map((server) => server.name || server.slug || ""),
      ])
    )
    .map((item) => ({
      id: `use-case-${item.id}`,
      type: "Use Cases",
      title: item.title,
      description: item.summary || "Use case profile",
      href: `/use-cases/${item.slug}`,
      meta: [item.industry, item.category].filter(Boolean).join(" · ") || "Use case",
    }));
}

function buildPodcastResults(query: string, episodes: PodcastEpisode[]): SearchResult[] {
  return episodes
    .filter((episode) =>
      matchesQuery(query, [
        episode.title,
        ...(episode.tags || []).map((tag) => tag.name || tag.slug || ""),
        ...(episode.companies || []).map((company) => company.name || company.slug || ""),
      ])
    )
    .map((episode) => ({
      id: `podcast-${episode.id}`,
      type: "Podcasts",
      title: episode.title,
      description: "Podcast episode",
      href: `/resources/podcasts/${episode.slug}`,
      meta: episode.publishedDate || "Podcast",
    }));
}

function buildArticleResults(query: string, articles: Article[]): SearchResult[] {
  return articles
    .filter((article) =>
      matchesQuery(query, [
        article.title,
        article.description,
        article.category?.name,
        article.author?.name,
      ])
    )
    .map((article) => ({
      id: `article-${article.id}`,
      type: "Articles",
      title: article.title,
      description: article.description || "Article",
      href: `/resources/articles/${article.slug}`,
      meta: article.category?.name || "Article",
    }));
}

function buildCaseStudyResults(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const entries = Object.entries(caseStudies as Record<string, RawIndustryCaseStudies>);
  entries.forEach(([slug, industry]) => {
    const displayName = industry?.industry || getIndustryDisplayName(slug);
    const cases = Array.isArray(industry?.cases) ? industry.cases : [];
    cases.forEach((caseStudy, index) => {
      const title = caseStudy?.title || "Case study";
      const match = matchesQuery(query, [
        displayName,
        title,
        ...(caseStudy?.challenge || []),
        ...(caseStudy?.solution || []),
        ...(caseStudy?.outcomes || []),
      ]);
      if (!match) return;
      results.push({
        id: `case-${slug}-${index}`,
        type: "Case Studies",
        title,
        description: (caseStudy?.challenge || [])[0] || "Industry case study",
        href: `/industries/${slug}`,
        meta: displayName,
      });
    });
  });
  return results;
}

function buildPageResults(query: string): SearchResult[] {
  return STATIC_PAGES.filter((page) =>
    matchesQuery(query, [page.title, page.description, page.meta])
  ).map((page, index) => ({
    id: `page-${index}`,
    ...page,
  }));
}

function groupResults(results: SearchResult[]) {
  const grouped = new Map<SearchResultType, SearchResult[]>();
  results.forEach((result) => {
    const bucket = grouped.get(result.type) || [];
    bucket.push(result);
    grouped.set(result.type, bucket);
  });

  return TYPE_ORDER.map((type) => {
    const items = grouped.get(type) || [];
    const limit = TYPE_LIMITS[type];
    return { type, items: items.slice(0, limit) };
  }).filter((group) => group.items.length > 0);
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async ({ query, res }) => {
  res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=600");
  const rawQuery = typeof query.q === "string" ? query.q.trim() : "";
  if (!rawQuery) {
    return { props: { query: "", results: [], fetchError: false } };
  }

  const normalizedQuery = normalizeText(rawQuery);
  const allowPrivate = process.env.NEXT_PUBLIC_SHOW_PRIVATE === "true";
  const visibilityFilter = allowPrivate ? undefined : "public";
  let fetchError = false;

  const [agentsResult, skillsResult, mcpsResult, useCasesResult, podcastsResult, articlesResult] = await Promise.allSettled([
    fetchAgents(visibilityFilter, { maxRecords: 600 }),
    fetchSkills(visibilityFilter, { maxRecords: 600 }),
    fetchMCPServers(visibilityFilter, { maxRecords: 600 }),
    fetchUseCases(visibilityFilter, { maxRecords: 600 }),
    fetchPodcastEpisodes(),
    fetchArticles({ maxRecords: 300 }),
  ]);

  const agents = agentsResult.status === "fulfilled" ? agentsResult.value : [];
  const skills = skillsResult.status === "fulfilled" ? skillsResult.value : [];
  const mcps = mcpsResult.status === "fulfilled" ? mcpsResult.value : [];
  const useCases = useCasesResult.status === "fulfilled" ? useCasesResult.value : [];
  const podcasts = podcastsResult.status === "fulfilled" ? podcastsResult.value : [];
  const articles = articlesResult.status === "fulfilled" ? articlesResult.value : [];
  if (
    agentsResult.status === "rejected" ||
    skillsResult.status === "rejected" ||
    mcpsResult.status === "rejected" ||
    useCasesResult.status === "rejected" ||
    podcastsResult.status === "rejected" ||
    articlesResult.status === "rejected"
  ) {
    fetchError = true;
  }

  const results = [
    ...buildAgentResults(normalizedQuery, agents),
    ...buildSkillResults(normalizedQuery, skills),
    ...buildMcpResults(normalizedQuery, mcps),
    ...buildUseCaseResults(normalizedQuery, useCases),
    ...buildPodcastResults(normalizedQuery, podcasts),
    ...buildArticleResults(normalizedQuery, articles),
    ...buildCaseStudyResults(normalizedQuery),
    ...buildPageResults(normalizedQuery),
  ];

  return {
    props: {
      query: rawQuery,
      results,
      fetchError,
    },
  };
};

export default function SearchPage({ query, results, fetchError }: SearchPageProps) {
  const grouped = groupResults(results);
  const hasResults = grouped.length > 0;
  const topResultTypes = grouped
    .slice(0, 4)
    .map((group) => `${group.type}: ${group.items.length}`);
  const searchShortcuts = [
    "agent ops",
    "mcp integration",
    "customer support",
    "governance",
    "healthcare",
    "supply chain",
  ];

  const seoMeta: SeoMeta = {
    title: query ? `${query} - Search | Colaberry AI` : "Search | Colaberry AI",
    description: "Find the right AI agent, integration, or use case in seconds. Search the full Colaberry AI catalog.",
    canonical: buildCanonical("/search"),
    noindex: true,
  };

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
      </Head>
      {fetchError ? (
        <div className="mb-6">
          <StatePanel
            variant="error"
            title="Some catalog data is temporarily unavailable"
            description="Search results may be partial while we reconnect to upstream data sources."
          />
        </div>
      ) : null}
      <div className="hero-surface grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rise-in flex flex-col gap-3">
          <SectionHeader
            as="h1"
            size="xl"
            kicker="Search"
            title={query ? `Results for \"${query}\"` : "Find what you need, fast"}
            description="Search agents, integrations, use cases, podcasts, and more across the entire catalog."
          />
        </div>
        <div className="rise-in rise-delay-2 detail-section">
          <div className="text-label font-semibold uppercase tracking-[0.14em] text-slate-500">
            Refine search
          </div>
          <form action="/search" method="get" role="search" className="mt-3 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="search-q" className="sr-only">
              Search
            </label>
            <input
              id="search-q"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Try an industry, agent name, or use case..."
              aria-label="Search the catalog"
              className="input-premium"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
          <p className="mt-2 text-xs text-slate-500">
            Try industry names, agent types, skill categories, or topics like &quot;supply chain&quot; or &quot;analytics.&quot;
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {searchShortcuts.map((shortcut) => (
              <Link
                key={shortcut}
                href={`/search?q=${encodeURIComponent(shortcut)}`}
                className="chip chip-neutral rounded-md px-3 py-1 text-xs font-semibold"
              >
                {shortcut}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {hasResults ? (
        <section className="surface-panel mt-6 p-5 sm:p-6">
          <SectionHeader
            kicker="Search intelligence"
            title="Result distribution"
            description="A quick view of where matches are concentrated so teams can navigate faster."
            size="md"
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="section-card rounded-xl p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Total results</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{results.length}</div>
            </div>
            <div className="section-card rounded-xl p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Result groups</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{grouped.length}</div>
            </div>
            <div className="section-card rounded-xl p-4 sm:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Top buckets</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {topResultTypes.map((item) => (
                  <span key={item} className="chip chip-muted rounded-md px-3 py-1 text-xs font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!query ? (
        <div className="mt-8">
          <StatePanel
            variant="empty"
            title="What are you looking for?"
            description="Enter a keyword to find agents, integrations, use cases, or resources across the catalog."
          />
        </div>
      ) : null}

      {query && !hasResults ? (
        <div className="mt-8">
          <StatePanel
            variant="empty"
            title="No matches found"
            description="Try a different keyword, check your spelling, or browse by industry."
          />
        </div>
      ) : null}

      {hasResults ? (
        <div className="mt-8 grid gap-6">
          {grouped.map((group) => (
            <section key={group.type} className="detail-section">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">{group.type}</div>
                <span className="text-xs text-slate-500">{group.items.length} results</span>
              </div>
              <div className="mt-4 grid gap-3">
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="card-elevated p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                        {item.description ? (
                          <div className="mt-1 text-sm text-slate-600">{item.description}</div>
                        ) : null}
                      </div>
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.type}
                      </span>
                    </div>
                    {item.meta ? <div className="mt-2 text-xs text-slate-500">{item.meta}</div> : null}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      <EnterpriseCtaBand
        kicker="Need guided discovery"
        title="Map search results to a rollout-ready plan"
        description="Use catalog matches to identify the best solution path for your team, then validate it with a focused demo."
        primaryHref="/request-demo"
        primaryLabel="Book a demo"
        secondaryHref="/resources"
        secondaryLabel="Explore resources"
      />
    </Layout>
  );
}
