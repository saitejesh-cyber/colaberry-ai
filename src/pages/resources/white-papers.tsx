import Layout from "../../components/Layout";
import Link from "next/link";

export default function WhitePapers() {
  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Resources
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          White papers
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Space for technical deep-dives, POVs, and reference architectures.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-3">
        <Card title="Reference architectures" description="Platform patterns and enterprise rollout." />
        <Card title="Governance" description="Controls, auditability, and risk management." />
        <Card title="Industry playbooks" description="Domain-specific delivery frameworks." />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/resources"
          className="inline-flex items-center justify-center rounded-lg border border-brand-blue/25 bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-slate-50"
        >
          Back to Resources
        </Link>
        <Link
          href="/updates"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 bg-gradient-to-r from-brand-blue to-brand-aqua px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:from-brand-deep hover:to-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
        >
          View News & Product
        </Link>
      </div>
    </Layout>
  );
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          Planned
        </span>
      </div>
    </div>
  );
}
