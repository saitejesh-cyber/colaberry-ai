import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getIndustryCaseStudies, getIndustryDisplayName } from "../../data/caseStudies";
import SectionHeader from "../../components/SectionHeader";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import EnterpriseCtaBand from "../../components/EnterpriseCtaBand";
import { heroImage } from "../../lib/media";

const INDUSTRY_HERO_IMAGES: Record<string, string> = {
  agriculture: heroImage("hero-industries-cinematic.webp"),
  energy: heroImage("hero-updates-cinematic.webp"),
  utilities: heroImage("hero-platform-cinematic.webp"),
  "healthcare-life-sciences": heroImage("hero-resources-cinematic.webp"),
  "climate-tech": heroImage("hero-solutions-cinematic.webp"),
  manufacturing: heroImage("hero-agents-cinematic.webp"),
  fintech: heroImage("hero-mcp-cinematic.webp"),
  "supply-chain": heroImage("hero-platform-cinematic.webp"),
};

export default function Industry() {
  const { industry } = useRouter().query;
  const industrySlug = typeof industry === "string" ? industry : "industry";
  const industryName = getIndustryDisplayName(industrySlug);
  const caseStudies = getIndustryCaseStudies(industrySlug);
  const caseStudyCount = caseStudies?.items.length ?? 0;
  const outcomeCount = (caseStudies?.items || []).reduce(
    (sum, item) => sum + (item.outcomes?.length || 0),
    0
  );
  const keyChips = [
    `${industryName} workflows`,
    "Governed delivery",
    "Outcome tracking",
    "Enterprise-ready",
  ];
  const heroImageSrc =
    INDUSTRY_HERO_IMAGES[industrySlug] || heroImage("hero-industries-cinematic.webp");

  return (
    <Layout>
      <EnterprisePageHero
        kicker="Industry workspace"
        title={`${industryName} AI Platform`}
        description={`A premium workspace for ${industryName} teams to evaluate, deploy, and govern AI with aligned agents, MCP integrations, and implementation playbooks.`}
        image={heroImageSrc}
        alt={`${industryName} industry workspace preview`}
        imageKicker="Workspace preview"
        imageTitle={`${industryName} delivery lane`}
        imageDescription="Curated operating patterns, case studies, and implementation context for this vertical."
        chips={keyChips}
        primaryAction={{ label: "Request a demo", href: "/request-demo" }}
        secondaryAction={{ label: "Explore use cases", href: "/use-cases", variant: "secondary" }}
        metrics={[
          { label: "Case studies", value: `${caseStudyCount}`, note: "Sector-specific deployment stories." },
          { label: "Outcome signals", value: `${outcomeCount}`, note: "Documented results across use cases." },
          { label: "Workspace mode", value: "Governed", note: "Built for enterprise operations and auditability." },
        ]}
      />

      <section className="surface-panel mt-6 p-6">
        <SectionHeader
          kicker="Operating model"
          title={`How ${industryName} teams use this workspace`}
          description="From discovery to rollout, these capabilities help teams deliver AI with confidence."
          size="md"
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <InfoCard
            title="What you get"
            body="Curated agents, MCP servers, and playbooks mapped to real workflows and operating constraints."
          />
          <InfoCard
            title="How it is delivered"
            body="Versioned rollout tracks with ownership controls, governance guardrails, and release checkpoints."
          />
          <InfoCard
            title="What moves first"
            body="High-impact workflows prioritized by outcome potential, implementation complexity, and stakeholder urgency."
          />
        </div>
      </section>

      <section className="mt-6 surface-panel p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            kicker="Case studies"
            title={`Real outcomes in ${industryName}`}
            description="Challenges, solutions, and measurable outcomes drawn from Colaberry industry programs."
            size="md"
          />
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {caseStudyCount ? `${caseStudyCount} use cases` : "More coming soon"}
          </div>
        </div>

        {caseStudyCount ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {(caseStudies?.items || []).map((item) => (
              <CaseStudyCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 dark:border-[var(--stroke)] dark:bg-[var(--surface-strong)] dark:text-slate-300">
            We are finalizing more {industryName} case studies for this workspace.
          </div>
        )}
      </section>

      <EnterpriseCtaBand
        kicker="Next step"
        title={`Launch ${industryName} AI initiatives with execution clarity`}
        description="Review this industry lane with our team and get a phased deployment plan aligned to your goals."
        primaryHref="/request-demo"
        primaryLabel="Book a demo"
        secondaryHref="/solutions"
        secondaryLabel="View solutions"
      />
    </Layout>
  );
}

function CaseStudyCard({
  item,
}: {
  item: {
    title: string;
    challenge: string[];
    solution: string[];
    outcomes: string[];
  };
}) {
  return (
    <article className="surface-panel border border-slate-200/80 bg-white/90 p-5 dark:border-[var(--stroke)] dark:bg-[var(--surface-strong)]/90">
      <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</div>
      <div className="mt-4 grid gap-4">
        <CaseStudySection title="Challenge" items={item.challenge} />
        <CaseStudySection title="Colaberry solution" items={item.solution} />
        <CaseStudySection title="Outcomes" items={item.outcomes} />
      </div>
    </article>
  );
}

function CaseStudySection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </div>
      <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
        {items.map((line, idx) => (
          <li key={`${title}-${idx}`} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--trusted-fill)]" />
            <span className="leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="card-elevated p-5">
      <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{body}</div>
      <div className="mt-3 inline-flex items-center rounded-md bg-[var(--pivot-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--pivot-fill)]">
        Enterprise track
      </div>
    </article>
  );
}
