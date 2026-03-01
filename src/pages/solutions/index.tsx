import Layout from "../../components/Layout";
import Head from "next/head";
import Link from "next/link";
import SectionHeader from "../../components/SectionHeader";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import EnterpriseCtaBand from "../../components/EnterpriseCtaBand";
import { heroImage } from "../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";
import type { GetStaticProps } from "next";
import { fetchAgents, fetchUseCases, fetchSolutions, type Solution } from "../../lib/cms";

type SolutionCard = {
  title: string;
  description: string;
  status: string | null;
  slug: string | null;
  benefits: string[];
  industries: string[];
};

type SolutionsProps = {
  agentCount: number;
  useCaseCount: number;
  solutionCards: SolutionCard[];
};

const hardcodedSolutions: SolutionCard[] = [
  {
    title: "Agent operations",
    description: "Deploy and manage AI agents with clear ownership, lifecycle controls, and reliability built in.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "Knowledge assistants",
    description: "Give teams instant, secure answers from internal data without building from scratch.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "Document automation",
    description: "Cut document processing time with AI-powered summarization, extraction, and drafting.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "MCP integration",
    description: "Connect AI agents to your existing tools through a single, standardized protocol.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "Governance & guardrails",
    description: "Adopt AI confidently with built-in policies, data boundaries, and compliance controls.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "Industry playbooks",
    description: "Launch faster with pre-built workflows designed for your specific industry.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
];

function cmsSolutionToCard(s: Solution): SolutionCard {
  return {
    title: s.title,
    description: s.description ?? "",
    status: s.status ?? null,
    slug: s.slug ?? null,
    benefits: s.benefits ?? [],
    industries: s.industries ?? [],
  };
}

export const getStaticProps: GetStaticProps<SolutionsProps> = async () => {
  let agentCount = 0;
  let useCaseCount = 0;
  let cmsSolutions: Solution[] = [];

  try {
    const [agents, useCases, solutions] = await Promise.allSettled([
      fetchAgents("public"),
      fetchUseCases("public"),
      fetchSolutions(),
    ]);
    if (agents.status === "fulfilled") agentCount = agents.value.length;
    if (useCases.status === "fulfilled") useCaseCount = useCases.value.length;
    if (solutions.status === "fulfilled") cmsSolutions = solutions.value;
  } catch {
    // graceful degradation — hardcoded solutions will render
  }

  // Merge: CMS solutions take priority, hardcoded items fill in as "Planned"
  const cmsCards = cmsSolutions.map(cmsSolutionToCard);
  const cmsTitlesLower = new Set(cmsCards.map((c) => c.title.toLowerCase()));

  const mergedCards: SolutionCard[] = [
    ...cmsCards,
    ...hardcodedSolutions
      .filter((h) => !cmsTitlesLower.has(h.title.toLowerCase()))
      .map((h) => ({ ...h, status: "Planned" })),
  ];

  return {
    props: { agentCount, useCaseCount, solutionCards: mergedCards },
    revalidate: 3600,
  };
};

export default function Solutions({ agentCount, useCaseCount, solutionCards }: SolutionsProps) {
  const seoMeta: SeoMeta = {
    title: "Solutions | Colaberry AI - Packaged Offerings & Playbooks",
    description: "Ship AI faster with packaged solutions. Governed agents, integration playbooks, and industry templates ready to deploy.",
    canonical: buildCanonical("/solutions"),
  };

  const solutionHighlights = [
    {
      title: "Deploy in weeks, not months",
      description: "Pre-built playbooks eliminate setup so teams ship faster.",
    },
    {
      title: "Governance from day one",
      description: "Every solution includes approvals, ownership, and audit trails.",
    },
    {
      title: "Plug into your stack",
      description: "MCP connectors integrate with the tools your team already uses.",
    },
    {
      title: "Tied to real outcomes",
      description: "Each solution maps to documented business metrics and ROI.",
    },
  ];
  const liveCards = solutionCards.filter((item) => !isPlannedStatus(item.status));
  const plannedCards = solutionCards.filter((item) => isPlannedStatus(item.status));
  const industrySignals = extractIndustrySignals(solutionCards).slice(0, 10);
  const catalogCoverage = `${agentCount} agents • ${useCaseCount} use cases`;

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Colaberry AI Solutions",
          "description": "Ship AI faster with packaged solutions. Governed agents, integration playbooks, and industry templates ready to deploy.",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/solutions`,
        }) }} />
      </Head>
      <EnterprisePageHero
        kicker="Solutions"
        title="Accelerate AI delivery with ready-made solutions"
        description="Move from strategy to production with delivery-ready solution tracks that combine agents, MCP integrations, and governance controls."
        image={heroImage("hero-solutions-cinematic.webp")}
        alt="Solutions overview"
        imageKicker="Delivery tracks"
        imageTitle="Enterprise launch templates"
        imageDescription="Each solution includes operating guidance, outcome mapping, and implementation signals."
        chips={["Outcome-first", "Governed by default", "MCP-ready", "Industry-mapped"]}
        primaryAction={{ label: "Explore use cases", href: "/use-cases" }}
        secondaryAction={{ label: "View industries", href: "/industries", variant: "secondary" }}
        metrics={[
          {
            label: "Solution tracks",
            value: `${solutionCards.length}`,
            note: "Live and planned tracks in the catalog.",
          },
          {
            label: "Catalog coverage",
            value: catalogCoverage,
            note: "Connected deployment assets.",
          },
          {
            label: "Live now",
            value: `${liveCards.length}`,
            note: `${plannedCards.length} planned for upcoming releases.`,
          },
        ]}
      />

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {solutionHighlights.map((item) => (
          <article key={item.title} className="card-elevated p-4">
            <h2 className="text-caption font-semibold text-slate-900 dark:text-slate-100">{item.title}</h2>
            <div className="mt-1 text-sm text-slate-600">{item.description}</div>
          </article>
        ))}
      </section>

      <section className="surface-panel mt-6 p-6">
        <SectionHeader
          kicker="Portfolio signal"
          title="Where these solutions are being deployed"
          description="Industry coverage and execution availability across the current solution portfolio."
          size="md"
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <SnapshotCard title="Live tracks" value={`${liveCards.length}`} note="Operational and delivery-ready today." />
          <SnapshotCard title="Planned tracks" value={`${plannedCards.length}`} note="Queued for upcoming releases." />
          <SnapshotCard
            title="Industry reach"
            value={industrySignals.length ? `${industrySignals.length}+` : "Growing"}
            note="Vertical-specific implementation pathways."
          />
        </div>
        {industrySignals.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {industrySignals.map((industry) => (
              <span key={industry} className="chip chip-neutral rounded-md px-3 py-1 text-xs font-semibold">
                {industry}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-6">
        <SectionHeader
          kicker="Live now"
          title="Production solution tracks"
          description="Solutions currently available for implementation with your team."
          size="md"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(liveCards.length > 0 ? liveCards : solutionCards).map((item) => (
            <SolutionTrackCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {plannedCards.length > 0 ? (
        <section className="mt-6">
          <SectionHeader
            kicker="Roadmap queue"
            title="Planned solution tracks"
            description="Upcoming tracks we are expanding based on delivery demand and vertical requirements."
            size="md"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plannedCards.map((item) => (
              <SolutionTrackCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/use-cases"
          className="btn btn-primary"
        >
          Explore use cases
        </Link>
        <Link
          href="/industries"
          className="btn btn-secondary"
        >
          View industries
        </Link>
        <Link
          href="/resources"
          className="btn btn-ghost"
        >
          Explore resources
        </Link>
      </div>

      <EnterpriseCtaBand
        kicker="Get started"
        title="See how fast your team can go live"
        description="Book a 30-minute demo and walk through the solution that fits your industry and use case."
        primaryHref="/request-demo"
        primaryLabel="Book a demo"
        secondaryHref="/use-cases"
        secondaryLabel="Explore use cases"
      />
    </Layout>
  );
}

function isPlannedStatus(status?: string | null) {
  const normalized = (status || "").toLowerCase();
  if (!normalized) return true;
  return normalized === "planned" || normalized === "draft" || normalized === "queued";
}

function extractIndustrySignals(cards: SolutionCard[]) {
  const map = new Map<string, number>();
  for (const card of cards) {
    for (const industry of card.industries || []) {
      const key = industry.trim();
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([industry]) => industry);
}

function SnapshotCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <article className="card-elevated p-4">
      <div className="text-label font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{note}</div>
    </article>
  );
}

function SolutionTrackCard({ item }: { item: SolutionCard }) {
  const planned = isPlannedStatus(item.status);
  return (
    <article className="card-feature p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-caption font-semibold text-slate-900 dark:text-slate-100">{item.title}</h2>
        <div
          className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${
            planned
              ? "chip chip-muted border-slate-200/80 bg-white text-slate-700"
              : "border-[var(--trusted-stroke)] bg-[var(--trusted-surface)] text-[var(--trusted-text)]"
          }`}
        >
          {item.status || "Planned"}
        </div>
      </div>
      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</div>
      {item.industries.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.industries.slice(0, 4).map((industry) => (
            <span
              key={industry}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-[var(--surface-soft)] dark:text-slate-300"
            >
              {industry}
            </span>
          ))}
        </div>
      ) : null}
      {item.benefits.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {item.benefits.slice(0, 3).map((benefit) => (
            <li key={benefit} className="text-xs text-slate-600 dark:text-slate-300">
              <span className="mr-1 text-[var(--trusted-fill)]">&#10003;</span>
              {benefit}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
