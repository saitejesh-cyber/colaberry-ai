import Layout from "../../components/Layout";
import PremiumMediaCard from "../../components/PremiumMediaCard";
import EnterpriseCtaBand from "../../components/EnterpriseCtaBand";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import { heroImage } from "../../lib/media";

export default function IndustriesIndex() {
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
      title: "Outcome stories",
      description: "Case studies with measurable outcomes and delivery context.",
      meta: "Outcomes",
      image: heroImage("hero-solutions-cinematic.webp"),
    },
    {
      href: "/solutions",
      title: "Workspace templates",
      description: "Repeatable industry-aligned playbooks and signal feeds.",
      meta: "Playbooks",
      image: heroImage("hero-platform-cinematic.webp"),
    },
    {
      href: "/updates",
      title: "Domain signals",
      description: "Key data sources, workflows, and AI surfaces per industry.",
      meta: "Signals",
      image: heroImage("hero-updates-cinematic.webp"),
    },
    {
      href: "/aixcelerator/agents",
      title: "Governed delivery",
      description: "Ownership, approvals, and evaluation-ready metadata.",
      meta: "Governance",
      image: heroImage("hero-agents-cinematic.webp"),
    },
  ];

  return (
    <Layout>
      <EnterprisePageHero
        kicker="Industry expertise"
        title="Industries"
        description="Domain-led delivery surfaces for sector-specific agents, MCP patterns, use cases, and outcomes."
        image={heroImage("hero-industries-cinematic.webp")}
        alt="Industry landscape overview"
        imageKicker="Coverage"
        imageTitle="Service line coverage map"
        imageDescription="Industry-aligned AI delivery contexts with playbooks and measurable outcomes."
        chips={["Agriculture", "Energy", "Utilities", "Healthcare", "Manufacturing", "Supply chain"]}
        primaryAction={{ label: "Explore solutions", href: "/solutions" }}
        secondaryAction={{ label: "Browse case studies", href: "/resources/case-studies", variant: "secondary" }}
        metrics={[
          { label: "Industry tracks", value: `${industries.length}`, note: "Current vertical delivery surfaces." },
          { label: "Launch path", value: "Catalog → outcome", note: "From signals to deployable patterns." },
          { label: "Distribution", value: "Global", note: "Shared framework, domain-adapted execution." },
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

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((item) => (
          <PremiumMediaCard
            key={item.slug}
            href={`/industries/${item.slug}`}
            title={item.name}
            description="Case studies, outcomes, and context."
            meta="Industry"
            image={item.image}
            size="sm"
          />
        ))}
      </div>

      <EnterpriseCtaBand
        kicker="Industry expansion"
        title="Move from catalog to outcome with domain-ready AI delivery"
        description="Combine industry context, governed agents, and MCP integrations into repeatable playbooks that teams can deploy with confidence."
        primaryHref="/solutions"
        primaryLabel="Explore solutions"
        secondaryHref="/resources/case-studies"
        secondaryLabel="Browse case studies"
      />
    </Layout>
  );
}
