import Layout from "../../components/Layout";
import Link from "next/link";
import { coreCapabilities, modularLayers } from "../../data/platformCapabilities";

export default function AIXcelerator() {
  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-blue/20 bg-white py-1 pl-2 pr-3 text-xs text-brand-deep">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-aqua" />
          Core platform + modular layers
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">AIXcelerator</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          AIXcelerator is the core platform for governed agent delivery. It helps teams move from
          opportunity and workflow definition to production execution-then close the loop with
          observability and evaluation. On top of it, we can introduce modular capability layers
          (resources, industries, playbooks, and aggregation) incrementally without disrupting the
          core surface.
        </p>
      </div>

      <section className="mt-6 sm:mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Core</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Core platform surface</div>
          </div>
          <div className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 sm:inline-flex">
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

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Layers</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">Modular capability layers</div>
            <p className="mt-1 max-w-3xl text-sm text-slate-600">
              These are first-class capabilities, introduced incrementally on top of the core. Each
              layer can start as a curated demo surface and mature into a full system over time.
            </p>
          </div>
          <Link
            href="/resources"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-slate-900 bg-gradient-to-r from-brand-blue to-brand-aqua px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:from-brand-deep hover:to-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 sm:mt-0"
          >
            Explore layers
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
    </Layout>
  );
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
      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-blue/40 hover:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            {badge ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {badge}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>
        </div>
              <div className="mt-0.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-deep">
                →
              </div>
      </div>
    </Link>
  );
}
