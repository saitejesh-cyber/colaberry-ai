import Layout from "../../components/Layout";
import Link from "next/link";

export default function IndustriesIndex() {
  const industries = [
    { name: "Agriculture", slug: "agriculture" },
    { name: "Energy", slug: "energy" },
    { name: "Utilities", slug: "utilities" },
    { name: "Healthcare & Life Sciences", slug: "healthcare-life-sciences" },
    { name: "Climate Tech", slug: "climate-tech" },
    { name: "Manufacturing", slug: "manufacturing" },
    { name: "Fintech", slug: "fintech" },
    { name: "Supply Chain", slug: "supply-chain" },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Industries</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Domain-led delivery. Explore industry pages with aligned solutions and case studies.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((item) => (
          <Link
            key={item.slug}
            href={`/industries/${item.slug}`}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-blue/40 hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                <div className="mt-1 text-sm text-slate-600">Case studies, outcomes, and context.</div>
              </div>
              <div className="mt-0.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-deep">
                →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/resources/case-studies"
          className="inline-flex items-center justify-center rounded-lg border border-brand-blue/25 bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-slate-50"
        >
          Browse case studies
        </Link>
        <Link
          href="/solutions"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 bg-gradient-to-r from-brand-blue to-brand-aqua px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:from-brand-deep hover:to-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
        >
          Explore solutions
        </Link>
      </div>
    </Layout>
  );
}
