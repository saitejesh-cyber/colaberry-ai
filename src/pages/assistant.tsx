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
    label: "Find supply-chain agents",
    href: "/search?q=supply+chain+public+agents",
    description: "See which agents are ready to automate supply-chain workflows today.",
  },
  {
    label: "Find analytics integrations",
    href: "/search?q=analytics+mcp+server+integration",
    description: "Discover MCP servers that connect your data and analytics tools to AI agents.",
  },
  {
    label: "Explore biotech use cases",
    href: "/search?q=biotech+use+cases+outcomes",
    description: "See proven AI implementations and outcomes in biotech and healthcare.",
  },
  {
    label: "Catch up on AI news",
    href: "/search?q=latest+ai+updates+briefing",
    description: "Get the latest product updates and rated AI headlines in one view.",
  },
];

const ENTRY_POINTS = [
  {
    title: "Agents catalog",
    href: "/aixcelerator/agents",
    description: "Browse and compare AI agents by readiness, ownership, and industry.",
  },
  {
    title: "MCP servers",
    href: "/aixcelerator/mcp",
    description: "Find the right MCP server to connect AI agents to your tools.",
  },
  {
    title: "Use cases",
    href: "/use-cases",
    description: "See how real teams solve problems with AI, including outcomes and timelines.",
  },
  {
    title: "Resources + updates",
    href: "/updates",
    description: "Stay current with product releases, rated AI news, and research.",
  },
];

type TrendingItem = { title: string; href: string; type: string };
type AssistantProps = { trending: TrendingItem[] };
type DiscoveryEntity = {
  slug?: string | null;
  name?: string | null;
  title?: string | null;
};

export const getStaticProps: GetStaticProps<AssistantProps> = async () => {
  const trending: TrendingItem[] = [];
  try {
    const [agentsResult, mcpResult, podResult] = await Promise.allSettled([
      fetchAgents("public"),
      fetchMCPServers("public"),
      fetchPodcastEpisodes({ maxRecords: 3 }),
    ]);
    if (agentsResult.status === "fulfilled") {
      agentsResult.value.slice(0, 3).forEach((a: DiscoveryEntity) => {
        if (!a.slug) return;
        trending.push({
          title: a.name || a.title || "Agent",
          href: `/aixcelerator/agents/${a.slug}`,
          type: "Agent",
        });
      });
    }
    if (mcpResult.status === "fulfilled") {
      mcpResult.value.slice(0, 3).forEach((m: DiscoveryEntity) => {
        if (!m.slug) return;
        trending.push({
          title: m.name || m.title || "MCP Server",
          href: `/aixcelerator/mcp/${m.slug}`,
          type: "MCP",
        });
      });
    }
    if (podResult.status === "fulfilled") {
      podResult.value.slice(0, 3).forEach((p: DiscoveryEntity) => {
        if (!p.slug) return;
        trending.push({
          title: p.title || "Episode",
          href: `/resources/podcasts/${p.slug}`,
          type: "Podcast",
        });
      });
    }
  } catch {}
  return { props: { trending }, revalidate: 600 };
};

export default function AssistantPage({ trending }: AssistantProps) {
  const seoMeta: SeoMeta = {
    title: "Discovery Assistant | Colaberry AI",
    description: "Find the right AI agent or solution in seconds. Guided prompts route you to exactly what you need.",
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
          "description": "Find the right AI agent or solution in seconds. Guided prompts route you to exactly what you need.",
          "url": buildCanonical("/assistant"),
          "publisher": { "@type": "Organization", "name": "Colaberry AI" },
        }) }} />
      </Head>

      <EnterprisePageHero
        kicker="Discovery assistant"
        title="Find the right AI solution in seconds"
        description="One starting point to discover agents, integrations, and use cases -- whether you are evaluating or ready to deploy."
        image={heroImage("hero-assistant-cinematic.webp")}
        alt="Discovery assistant entry flow"
        imageKicker="How it works"
        imageTitle="Ask, discover, deploy"
        imageDescription="Curated prompts route you to the exact agent, integration, or use case you need."
        chips={["Guided search", "Catalog-linked", "LLM-ready", "Enterprise-grade"]}
        primaryAction={{ label: "Search catalog", href: "/search" }}
        secondaryAction={{ label: "Book a demo", href: "/request-demo", variant: "secondary" }}
      />

      <section className="surface-panel mt-6 border border-slate-200/80 bg-white/90 p-6">
        <SectionHeader
          as="h2"
          size="md"
          kicker="Quick start"
          title="Start with a question"
          description="Pick a guided prompt or type your own to find what you need."
        />
        <form action="/search" method="get" role="search" className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor="assistant-search" className="sr-only">
            Search query
          </label>
          <input
            id="assistant-search"
            name="q"
            type="search"
            placeholder="What problem are you solving? Try an industry or topic..."
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
          kicker="Browse directly"
          title="Jump to a catalog section"
          description="Go straight to the agents, integrations, use cases, or updates you need."
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

      {trending.length > 0 ? (
        <section className="surface-panel mt-6 border border-slate-200/80 bg-white/90 p-6">
          <SectionHeader
            as="h2"
            size="md"
            kicker="Trending"
            title="Popular discovery paths right now"
            description="Frequently opened entities across agents, MCP servers, and podcast episodes."
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {trending.slice(0, 9).map((item, index) => (
              <Link key={`${item.type}-${item.href}-${index}`} href={item.href} className="card-feature p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {item.type}
                </div>
                <div className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </Layout>
  );
}
