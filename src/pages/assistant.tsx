import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import EnterprisePageHero from "../components/EnterprisePageHero";
import SectionHeader from "../components/SectionHeader";
import { fetchAgents, fetchMCPServers, fetchPodcastEpisodes } from "../lib/cms";
import { heroImage } from "../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../lib/seo";

const QUICK_PROMPTS = [
  {
    label: "Find public supply-chain agents",
    href: "/search?q=supply+chain+public+agents",
    description: "Discover agent listings aligned to supply-chain workflows and governance controls.",
  },
  {
    label: "Find MCP servers for analytics",
    href: "/search?q=analytics+mcp+server+integration",
    description: "Locate MCP infrastructure for data workflows, observability, and automation.",
  },
  {
    label: "Find biotech use cases",
    href: "/search?q=biotech+use+cases+outcomes",
    description: "Review implementation patterns and outcomes in biotech and healthcare.",
  },
  {
    label: "Find latest AI updates",
    href: "/search?q=latest+ai+updates+briefing",
    description: "Jump to curated product and ecosystem updates in one place.",
  },
];

const ENTRY_POINTS = [
  {
    title: "Agents catalog",
    href: "/aixcelerator/agents",
    description: "Compare agent ownership, readiness, and deployment context.",
  },
  {
    title: "MCP servers",
    href: "/aixcelerator/mcp",
    description: "Evaluate MCP capabilities, security posture, and integration fit.",
  },
  {
    title: "Use cases",
    href: "/use-cases",
    description: "Explore problem statements, implementation patterns, and measurable outcomes.",
  },
  {
    title: "Resources + updates",
    href: "/updates",
    description: "Track new signals from podcasts, research, and curated AI news feeds.",
  },
];

type TrendingItem = { title: string; href: string; type: string };
type AssistantProps = { trending: TrendingItem[] };

export const getStaticProps: GetStaticProps<AssistantProps> = async () => {
  const trending: TrendingItem[] = [];
  try {
    const [agentsResult, mcpResult, podResult] = await Promise.allSettled([
      fetchAgents("public"),
      fetchMCPServers("public"),
      fetchPodcastEpisodes({ maxRecords: 3 }),
    ]);
    if (agentsResult.status === "fulfilled") {
      agentsResult.value.slice(0, 3).forEach((a: any) => {
        trending.push({ title: a.name || a.title || "Agent", href: `/aixcelerator/agents/${a.slug}`, type: "Agent" });
      });
    }
    if (mcpResult.status === "fulfilled") {
      mcpResult.value.slice(0, 3).forEach((m: any) => {
        trending.push({ title: m.name || m.title || "MCP Server", href: `/aixcelerator/mcp/${m.slug}`, type: "MCP" });
      });
    }
    if (podResult.status === "fulfilled") {
      podResult.value.slice(0, 3).forEach((p: any) => {
        trending.push({ title: p.title || "Episode", href: `/resources/podcasts/${p.slug}`, type: "Podcast" });
      });
    }
  } catch {}
  return { props: { trending }, revalidate: 600 };
};

export default function AssistantPage({ trending }: AssistantProps) {
  const seoMeta: SeoMeta = {
    title: "Discovery Assistant | Colaberry AI",
    description: "Start from guided prompts to discover agents, MCP servers, use cases, and updates.",
    canonical: buildCanonical("/assistant"),
  };

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Discovery Assistant",
          "description": "Start from guided prompts to discover agents, MCP servers, use cases, and updates.",
          "url": buildCanonical("/assistant"),
          "publisher": { "@type": "Organization", "name": "Colaberry AI" },
        }) }} />
      </Head>

      <EnterprisePageHero
        kicker="Discovery assistant"
        title="Start with guided discovery"
        description="A single entry point for people and LLM workflows to find agents, MCP servers, use cases, and updates."
        image={heroImage("hero-platform-cinematic.webp")}
        alt="Discovery assistant entry flow"
        imageKicker="Assistant flow"
        imageTitle="Prompt to destination"
        imageDescription="Use curated prompts to route into the right catalog surface quickly."
        chips={["Prompt-first", "Catalog-linked", "LLM-readable", "Enterprise ready"]}
        primaryAction={{ label: "Search catalog", href: "/search" }}
        secondaryAction={{ label: "Book a demo", href: "/request-demo", variant: "secondary" }}
      />

      <section className="surface-panel mt-6 border border-slate-200/80 bg-white/90 p-6">
        <SectionHeader
          as="h2"
          size="md"
          kicker="Prompt launcher"
          title="Search with intent"
          description="Use one of the guided prompts or type your own query."
        />
        <form action="/search" method="get" role="search" className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor="assistant-search" className="sr-only">
            Search query
          </label>
          <input
            id="assistant-search"
            name="q"
            type="search"
            placeholder="Ask for agents, MCPs, use cases, or updates..."
            aria-label="Search query"
            className="input-premium"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {QUICK_PROMPTS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="card-feature p-4"
            >
              <div className="text-sm font-semibold text-slate-900">{item.label}</div>
              <p className="mt-1 text-xs text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="surface-panel mt-6 border border-slate-200/80 bg-white/90 p-6">
        <SectionHeader
          as="h2"
          size="md"
          kicker="Destination map"
          title="Assistant entry points"
          description="Jump directly into the relevant catalog destination."
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ENTRY_POINTS.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="card-feature p-4"
            >
              <div className="text-base font-semibold text-slate-900">{entry.title}</div>
              <p className="mt-1 text-sm text-slate-600">{entry.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/request-demo" className="btn btn-primary">
            Book a demo
          </Link>
          <Link href="/updates" className="btn btn-secondary">
            View latest updates
          </Link>
        </div>
      </section>
    </Layout>
  );
}
