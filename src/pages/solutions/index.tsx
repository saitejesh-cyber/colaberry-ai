import Layout from "../../components/Layout";
import Head from "next/head";
import Link from "next/link";
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
    description: "Governed rollout patterns for agent ownership, lifecycle, and reliability.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "Knowledge assistants",
    description: "Secure retrieval + workflow assistants for enterprise teams.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "Document automation",
    description: "Summarization, extraction, drafting, and review with audit-ready metadata.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "MCP integration",
    description: "Standardized tool access for automation across systems.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "Governance & guardrails",
    description: "Policies, data boundaries, and controls for enterprise adoption.",
    status: null,
    slug: null,
    benefits: [],
    industries: [],
  },
  {
    title: "Industry playbooks",
    description: "Domain context and repeatable delivery patterns by industry.",
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
    description: "Packaged offerings and reusable solution patterns aligned to industries and delivery playbooks.",
    canonical: buildCanonical("/solutions"),
  };

  const solutionHighlights = [
    {
      title: "Operational playbooks",
      description: "Repeatable patterns ready for enterprise deployment.",
    },
    {
      title: "Governance baked in",
      description: "Approvals, ownership, and audit-ready delivery context.",
    },
    {
      title: "Integration ready",
      description: "MCP connectors and tool access with consistent patterns.",
    },
    {
      title: "Outcome aligned",
      description: "Mapped to industry outcomes and measurable value.",
    },
  ];

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
          "description": "Packaged offerings and reusable solution patterns for enterprise AI deployment.",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/solutions`,
        }) }} />
      </Head>
      <EnterprisePageHero
        kicker="Solutions"
        title="Packaged offerings & playbooks"
        description="Repeatable solution patterns aligned to industries and delivery playbooks. Enterprise-grade governance, agent operations, and MCP integration."
        image={heroImage("hero-solutions-cinematic.webp")}
        alt="Solutions overview"
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {solutionHighlights.map((item) => (
          <div
            key={item.title}
            className="card-elevated p-4"
          >
            <h3 className="text-caption font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
            <div className="mt-1 text-sm text-slate-600">{item.description}</div>
          </div>
        ))}
      </div>
      {agentCount > 0 || useCaseCount > 0 ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Backed by {agentCount > 0 ? `${agentCount} agents` : ""}{agentCount > 0 && useCaseCount > 0 ? " and " : ""}{useCaseCount > 0 ? `${useCaseCount} use cases` : ""} in the catalog.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {solutionCards.map((item) => {
          const isPlanned = !item.status || item.status.toLowerCase() === "planned";
          return (
            <div key={item.title} className="card-feature p-5">
              <h3 className="text-caption font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
              <div className="mt-1 text-sm text-slate-600">{item.description}</div>
              {item.industries.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.industries.map((ind) => (
                    <span
                      key={ind}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-[var(--surface-soft)] dark:text-slate-300"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              )}
              {item.benefits.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {item.benefits.slice(0, 3).map((b) => (
                    <li key={b} className="text-xs text-slate-600">
                      <span className="mr-1 text-[var(--trusted-fill)]">&#10003;</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <div className={`mt-4 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${
                isPlanned
                  ? "chip chip-muted border-slate-200/80 bg-white text-slate-700"
                  : "border-[var(--trusted-stroke)] bg-[var(--trusted-surface)] text-[var(--trusted-text)]"
              }`}>
                {item.status || "Planned"}
              </div>
            </div>
          );
        })}
      </div>

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
        title="Ready to explore enterprise solutions?"
        description="Book a demo to see how Colaberry AI accelerates delivery across your organization."
        primaryHref="/request-demo"
        primaryLabel="Book a demo"
        secondaryHref="/use-cases"
        secondaryLabel="Explore use cases"
      />
    </Layout>
  );
}
