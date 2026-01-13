import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getIndustryCaseStudies, getIndustryDisplayName } from "../../data/caseStudies";
import Link from "next/link";

export default function Industry() {
  const { industry } = useRouter().query;
  const industrySlug = typeof industry === "string" ? industry : "industry";
  const industryName = getIndustryDisplayName(industrySlug);
  const caseStudies = getIndustryCaseStudies(industrySlug);

  return (
    <Layout>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
            Industry workspace
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {industryName} AI Platform
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A workspace designed for people, LLMs, and agents-bringing together MCP servers, agent
            catalogs, and domain intelligence tailored for {industryName}.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/request-demo"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 bg-gradient-to-r from-brand-blue to-brand-aqua px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 hover:from-brand-deep hover:to-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Book a demo
            </Link>
            <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50">
              Subscribe
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
            <InfoCard
              title="What you get"
              body="Curated agents, MCP servers, and playbooks mapped to real workflows-ready for enterprise adoption."
            />
            <InfoCard
              title="How it’s delivered"
              body="Versioned releases with clear ownership, governance controls, and audit-ready operational metadata."
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Workspace summary</div>
            <div className="mt-1 text-sm text-slate-600">
              Default subscriptions and recommended starting points.
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Metric label="Agents" value="Catalog" />
              <Metric label="MCP" value="Servers" />
              <Metric label="Research" value="Playbooks" />
              <Metric label="Governance" value="Policies" />
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Case studies
            </div>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Real outcomes in {industryName}
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              Challenges, solutions, and measurable outcomes drawn from Colaberry industry work.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            {caseStudies?.items.length ? `${caseStudies.items.length} use cases` : "More coming soon"}
          </div>
        </div>

        {caseStudies?.items.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {caseStudies.items.map((item) => (
              <CaseStudyCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            We’re finalizing more {industryName} case studies for this workspace.
          </div>
        )}
      </section>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{item.title}</div>

      <div className="mt-4 grid gap-4">
        <Section title="Challenge" items={item.challenge} />
        <Section title="Colaberry’s solution" items={item.solution} />
        <Section title="Outcomes" items={item.outcomes} />
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <ul className="mt-2 space-y-1 text-sm text-slate-700">
        {items.map((line, idx) => (
          <li key={`${title}-${idx}`} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-aqua" />
            <span className="leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-slate-600">{body}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
