import type { GetStaticProps } from "next";
import Layout from "../../components/Layout";
import Head from "next/head";
import PremiumMediaCard from "../../components/PremiumMediaCard";
import EnterpriseCtaBand from "../../components/EnterpriseCtaBand";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import SectionHeader from "../../components/SectionHeader";
import { heroImage } from "../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";
import { fetchAgents, fetchUseCases } from "../../lib/cms";

type IndustryCount = { agents: number; useCases: number };
type IndustriesProps = { industryCounts: Record<string, IndustryCount> };

export const getStaticProps: GetStaticProps<IndustriesProps> = async () => {
  const industryCounts: Record<string, IndustryCount> = {};
  try {
    const [agentsResult, useCasesResult] = await Promise.allSettled([
      fetchAgents("public"),
      fetchUseCases("public"),
    ]);
    const agents = agentsResult.status === "fulfilled" ? agentsResult.value : [];
    const useCases = useCasesResult.status === "fulfilled" ? useCasesResult.value : [];
    const toSlug = (ind?: string | null) => {
      if (!ind) return "";
      return ind.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
    };
    for (const agent of agents) {
      const slug = toSlug(agent.industry);
      if (slug) {
        if (!industryCounts[slug]) industryCounts[slug] = { agents: 0, useCases: 0 };
        industryCounts[slug].agents++;
      }
    }
    for (const uc of useCases) {
      const slug = toSlug(uc.industry);
      if (slug) {
        if (!industryCounts[slug]) industryCounts[slug] = { agents: 0, useCases: 0 };
        industryCounts[slug].useCases++;
      }
    }
  } catch {}
  return { props: { industryCounts }, revalidate: 600 };
};

export default function IndustriesIndex({ industryCounts }: IndustriesProps) {
  const seoMeta: SeoMeta = {
    title: "Industries | Colaberry AI",
    description: "Deploy AI agents tailored to your industry. Pre-built playbooks for agriculture, energy, healthcare, and more.",
    canonical: buildCanonical("/industries"),
  };

  const industries = [
    { name: "Agriculture", slug: "agriculture", image: heroImage("hero-agents-cinematic.webp") },
    { name: "Energy", slug: "energy", image: heroImage("hero-updates-cinematic.webp") },
    { name: "Utilities", slug: "utilities", image: heroImage("hero-platform-cinematic.webp") },
    { name: "Healthcare & Life Sciences", slug: "healthcare-life-sciences", image: heroImage("hero-resources-cinematic.webp") },
    { name: "Climate Tech", slug: "climate-tech", image: heroImage("hero-industries-cinematic.webp") },
    { name: "Manufacturing", slug: "manufacturing", image: heroImage("hero-solutions-cinematic.webp") },
    { name: "Fintech", slug: "fintech", image: heroImage("hero-mcp-cinematic.webp") },
    { name: "Supply Chain", slug: "supply-chain", image: heroImage("hero-platform-cinematic.webp") },
  ];
  const industryHighlights = [
    {
      href: "/resources/case-studies",
      title: "Proven results",
      description: "Real deployments with documented ROI and timelines.",
      meta: "Outcomes",
      image: heroImage("hero-solutions-cinematic.webp"),
    },
    {
      href: "/solutions",
      title: "Ready-to-deploy playbooks",
      description: "Pre-built workflows aligned to your industry's needs.",
      meta: "Playbooks",
      image: heroImage("hero-platform-cinematic.webp"),
    },
    {
      href: "/updates",
      title: "Industry intelligence",
      description: "Curated data sources and AI signals for your sector.",
      meta: "Signals",
      image: heroImage("hero-updates-cinematic.webp"),
    },
    {
      href: "/aixcelerator/agents",
      title: "Enterprise governance",
      description: "Built-in ownership, approvals, and audit trails.",
      meta: "Governance",
      image: heroImage("hero-agents-cinematic.webp"),
    },
  ];
  const industrySummaries = industries
    .map((industry) => {
      const counts = industryCounts[industry.slug] || { agents: 0, useCases: 0 };
      const score = counts.agents * 2 + counts.useCases * 3;
      return { ...industry, counts, score };
    })
    .sort((left, right) => right.score - left.score || left.name.localeCompare(right.name));
  const aggregateAgents = Object.values(industryCounts).reduce((sum, item) => sum + item.agents, 0);
  const aggregateUseCases = Object.values(industryCounts).reduce((sum, item) => sum + item.useCases, 0);

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Colaberry AI Industries",
              description:
                "Deploy AI agents tailored to your industry. Pre-built playbooks for agriculture, energy, healthcare, and more.",
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/industries`,
            }),
          }}
        />
      </Head>
      <EnterprisePageHero
        kicker="Industry expertise"
        title="AI built for your industry"
        description="Pre-configured agents, proven playbooks, and measurable outcomes for each sector you operate in."
        image={heroImage("hero-industries-cinematic.webp")}
        alt="Industry landscape overview"
        imageKicker="Coverage"
        imageTitle="8 industries, one platform"
        imageDescription="Each vertical includes tailored agents, integration patterns, and documented outcomes."
        chips={["Agriculture", "Energy", "Utilities", "Healthcare", "Manufacturing", "Supply chain"]}
        primaryAction={{ label: "Explore solutions", href: "/solutions" }}
        secondaryAction={{ label: "Browse case studies", href: "/resources/case-studies", variant: "secondary" }}
        metrics={[
          { label: "Industry tracks", value: `${industries.length}`, note: "Active verticals with dedicated playbooks." },
          { label: "Mapped agents", value: `${aggregateAgents}`, note: "Agents tagged to industry needs." },
          { label: "Mapped use cases", value: `${aggregateUseCases}`, note: "Outcome patterns across sectors." },
        ]}
      />

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        {industryHighlights.map((item) => (
          <PremiumMediaCard
            key={item.title}
            href={item.href}
            title={item.title}
            description={item.description}
            meta={item.meta}
            image={item.image}
            size="sm"
          />
        ))}
      </section>

      <section className="surface-panel mt-6 p-6">
        <SectionHeader
          kicker="Delivery signal"
          title="Industry readiness by catalog density"
          description="Tracks with more linked agents and use cases typically move faster from pilot to production."
          size="md"
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {industrySummaries.slice(0, 4).map((item) => (
            <article key={`${item.slug}-signal`} className="card-elevated p-4">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {item.counts.agents} agent{item.counts.agents === 1 ? "" : "s"} • {item.counts.useCases} use case
                {item.counts.useCases === 1 ? "" : "s"}
              </div>
              <div className="mt-3 inline-flex items-center rounded-md border border-[var(--trusted-stroke)] bg-[var(--trusted-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--trusted-text)]">
                {item.score >= 9 ? "Launch-ready" : item.score >= 4 ? "Scaling" : "Emerging"}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((item) => (
          <PremiumMediaCard
            key={item.slug}
            href={`/industries/${item.slug}`}
            title={item.name}
            description={(() => {
              const counts = industryCounts[item.slug];
              if (!counts || (counts.agents === 0 && counts.useCases === 0)) return "Case studies, outcomes, and context.";
              const parts: string[] = [];
              if (counts.agents > 0) parts.push(`${counts.agents} agent${counts.agents === 1 ? "" : "s"}`);
              if (counts.useCases > 0) parts.push(`${counts.useCases} use case${counts.useCases === 1 ? "" : "s"}`);
              return parts.join(" \u00b7 ") + " in the catalog.";
            })()}
            meta="Industry"
            image={item.image}
            size="sm"
          />
        ))}
      </div>

      <EnterpriseCtaBand
        kicker="Get started"
        title="Go live in your industry with AI that fits"
        description="Combine tailored agents, governed workflows, and proven playbooks to deliver measurable results your team can trust."
        primaryHref="/solutions"
        primaryLabel="Explore solutions"
        secondaryHref="/resources/case-studies"
        secondaryLabel="Browse case studies"
      />
    </Layout>
  );
}
