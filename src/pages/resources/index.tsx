import Layout from "../../components/Layout";
import Link from "next/link";

export default function Resources() {
  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-blue/20 bg-white py-1 pl-2 pr-3 text-xs text-brand-deep">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-aqua" />
          Modular layer
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Resources
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          A home for research, artifacts, and updates-built to support both internal publishing and
          curated external sources as we evolve.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        <ResourceCard
          href="/resources/podcasts"
          title="Podcasts"
          description="Internal posts + curated external aggregation."
          meta="Internal + External"
        />
        <ResourceCard
          href="/resources/books"
          title="Books & artifacts"
          description="Books, companion assets, templates, and working artifacts."
          meta="Artifacts"
        />
        <ResourceCard
          href="/resources/case-studies"
          title="Case studies"
          description="Outcomes and delivery stories, organized by industry."
          meta="By industry"
        />
        <ResourceCard
          href="/resources/white-papers"
          title="White papers"
          description="Technical deep-dives, POVs, and best-practice guidance."
          meta="Research"
        />
        <ResourceCard
          href="/solutions"
          title="Solutions"
          description="Reusable solution patterns and packaged offerings."
          meta="Playbooks"
        />
        <ResourceCard
          href="/updates"
          title="News & product"
          description="A single feed for product updates, announcements, and relevant news."
          meta="Aggregator"
        />
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:mt-12">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          How this evolves
        </div>
        <div className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold text-slate-900">Internal publishing</div>
            <div className="mt-1 text-slate-600">
              Structured posting for podcasts, books, white papers, and curated collections.
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold text-slate-900">External aggregation</div>
            <div className="mt-1 text-slate-600">
              Pull in relevant sources (feeds, links, announcements) with light editorial control.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ResourceCard({
  href,
  title,
  description,
  meta,
}: {
  href: string;
  title: string;
  description: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-blue/40 hover:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>
        </div>
        <div className="mt-0.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-deep">
          →
        </div>
      </div>
      <div className="mt-4 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
        {meta}
      </div>
    </Link>
  );
}
