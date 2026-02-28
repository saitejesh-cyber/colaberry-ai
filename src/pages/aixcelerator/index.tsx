import Layout from "../../components/Layout";
import Link from "next/link";
import Head from "next/head";
import type { GetStaticProps } from "next";
import SectionHeader from "../../components/SectionHeader";
import MediaPanel from "../../components/MediaPanel";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import StatePanel from "../../components/StatePanel";
import { coreCapabilities, modularLayers } from "../../data/platformCapabilities";
import { fetchUseCases, type UseCase } from "../../lib/cms";
import { heroImage } from "../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";

type AIXceleratorProps = {
  latestUseCases: UseCase[];
  fetchError: boolean;
};

export const getStaticProps: GetStaticProps<AIXceleratorProps> = async () => {
  const allowPrivate = process.env.NEXT_PUBLIC_SHOW_PRIVATE === "true";
  const visibilityFilter = allowPrivate ? undefined : "public";

  try {
    const latestUseCases = await fetchUseCases(visibilityFilter, { maxRecords: 4, sortBy: "latest" });
    return {
      props: { latestUseCases, fetchError: false },
      revalidate: 600,
    };
  } catch {
    return {
      props: { latestUseCases: [], fetchError: true },
      revalidate: 120,
    };
  }
};

export default function AIXcelerator({ latestUseCases, fetchError }: AIXceleratorProps) {
  const seoMeta: SeoMeta = {
    title: "AIXcelerator Platform | Colaberry AI - Enterprise Agent Delivery",
    description: "AIXcelerator is the core platform for governed AI agent delivery. Discover agents, MCP servers, skills, and use cases in one enterprise operating surface.",
    canonical: buildCanonical("/aixcelerator"),
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
          "@type": "WebApplication",
          "name": "AIXcelerator",
          "applicationCategory": "Enterprise AI Platform",
          "description": "Core platform for governed AI agent delivery, observability, and evaluation.",
          "url": buildCanonical("/aixcelerator"),
          "provider": { "@type": "Organization", "name": "Colaberry AI" },
        }) }} />
      </Head>
      {fetchError ? (
        <div className="mb-6">
          <StatePanel
            variant="error"
            title="Use case signals are temporarily unavailable"
            description="Showing platform content while the use case feed reconnects."
          />
        </div>
      ) : null}

      <EnterprisePageHero
        kicker="Core platform + modular layers"
        title="AIXcelerator"
        description="The core platform for governed agent delivery. Move from opportunity and workflow definition to production execution — then close the loop with observability and evaluation."
        image={heroImage("hero-platform-cinematic.webp")}
        alt="AIXcelerator platform overview"
        imageKicker="Platform"
        imageTitle="Governed delivery surface"
        imageDescription="From opportunity definition to production execution and evaluation."
        chips={["Agent delivery", "MCP patterns", "Skills", "Use cases", "Observability"]}
        primaryAction={{ label: "Explore agents", href: "/aixcelerator/agents" }}
        secondaryAction={{ label: "Book a demo", href: "/request-demo", variant: "secondary" }}
        metrics={[
          { label: "Catalog surfaces", value: "5", note: "Agents, MCP, skills, use cases, research." },
          { label: "Governance", value: "Built-in", note: "Ownership, approval, and lifecycle tracking." },
          { label: "Distribution", value: "Global", note: "Shared framework, domain-adapted execution." },
        ]}
      />

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            kicker="Core"
            title="Core platform surface"
            description="The trusted foundation for agent delivery, governance, and observability."
            size="md"
          />
          <div className="hidden rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 sm:inline-flex">
            Stable foundation
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreCapabilities
            .filter((capability) => capability.href !== "/aixcelerator")
            .map((capability) => (
              <NavCard
                key={capability.href}
                href={capability.href}
                title={capability.title}
                description={capability.description}
                badge="Core"
              />
            ))}
        </div>
      </section>

      <section className="mt-10 surface-panel p-6 sm:mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            kicker="Layers"
            title="Modular capability layers"
            description="First-class capabilities introduced incrementally on top of the core. Each layer can start as a curated surface and mature into a full system over time."
            size="md"
          />
          <Link
            href="/resources"
            className="btn btn-cta mt-3 sm:mt-0"
          >
            Explore resource layers
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modularLayers.map((capability) => (
            <NavCard
              key={capability.href}
              href={capability.href}
              title={capability.title}
              description={capability.description}
              badge="Layer"
            />
          ))}
        </div>
      </section>

      <section className="mt-10 surface-panel p-6 sm:mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            kicker="Signals"
            title="Latest use cases"
            description="Fresh deployment patterns teams can review before moving into full execution design."
            size="md"
          />
          <Link href="/use-cases" className="btn btn-cta mt-3 sm:mt-0">
            Open use case catalog
          </Link>
        </div>

        {latestUseCases.length === 0 ? (
          <div className="mt-5">
            <StatePanel
              variant="empty"
              title="No use case signals yet"
              description="Latest use cases will appear here once new profiles are published."
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestUseCases.map((item) => (
              <Link
                key={item.slug || item.id}
                href={`/use-cases/${item.slug}`}
                className="surface-panel surface-hover surface-interactive border border-slate-200/80 bg-white/90 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="line-clamp-2 text-sm font-semibold text-slate-900">{item.title}</div>
                  <span className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                    →
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="chip chip-neutral rounded-md px-2.5 py-1 text-label font-semibold">
                    {item.industry || "General"}
                  </span>
                  <span className="chip chip-neutral rounded-md px-2.5 py-1 text-label font-semibold">
                    {(item.status || "live").toUpperCase()}
                  </span>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  {item.lastUpdated ? `Updated ${formatDate(item.lastUpdated)}` : "Update date pending"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 surface-panel p-6 sm:mt-12">
        <SectionHeader
          kicker="Roadmap"
          title="Discovery layer next steps"
          description="Clear milestones that deepen how teams and LLMs explore the catalog."
          size="md"
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <RoadmapItem
            title="LLM-friendly detail pages"
            status="Now live"
            description="Structured profiles for Agents and MCP servers with metadata-first layouts."
          />
          <RoadmapItem
            title="Chatbot exploration layer"
            status="Planned"
            description="Conversational discovery across agents, MCPs, and knowledge signals."
          />
        </div>
      </section>
    </Layout>
  );
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function NavCard({
  href,
  title,
  description,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="card-feature group p-6"
      aria-label={`Open ${title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-caption font-semibold text-slate-900 dark:text-slate-100">{title}</div>
            {badge ? (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-label font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {badge}
              </span>
            ) : null}
          </div>
          <div className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300">
          <path d="M6.5 3.5 11 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </Link>
  );
}

function RoadmapItem({
  title,
  status,
  description,
}: {
  title: string;
  status: string;
  description: string;
}) {
  const isLive = status.toLowerCase().includes("live");
  return (
    <div className="card-elevated p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="text-caption font-semibold text-slate-900 dark:text-slate-100">{title}</div>
        <span className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-label font-semibold uppercase tracking-[0.1em] ${isLive ? "bg-[var(--trusted-surface)] text-[var(--trusted-text)] dark:bg-[var(--trusted-surface)] dark:text-[var(--trusted-text)]" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
          {isLive ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--trusted-fill)" }} /> : null}
          {status}
        </span>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</div>
    </div>
  );
}
