import mcps from "../../data/mcps.json";
import MCPCard from "../../components/MCPCard";
import Layout from "../../components/Layout";
import Link from "next/link";

export default function MCP() {
  const industries = Array.from(new Set(mcps.map((m) => m.industry))).slice(0, 8);

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          MCP Servers
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          A curated MCP server library for connecting agents to business apps, data, and developer
          tools-with patterns that support security, reliability, and observability.
        </p>
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-3 sm:items-center sm:gap-6">
        <Stat title="Servers" value={String(mcps.length)} note="Curated library" />
        <Stat title="Industries" value={String(new Set(mcps.map((m) => m.industry)).size)} note="Domain-aware" />
        <Stat title="Delivery" value="Integration-ready" note="Auth-ready patterns" />
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Explore by industry
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {industries.map((industry) => (
            <Link
              key={industry}
              href={`/industries/${encodeURIComponent(industry)}`}
              className="rounded-full border border-brand-blue/25 bg-brand-blue/10 px-3 py-1 text-xs text-brand-deep hover:bg-brand-blue/15"
            >
              {industry}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {mcps.map((m, i) => (
          <MCPCard key={i} mcp={m} />
        ))}
      </div>
    </Layout>
  );
}

function Stat({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-600">{note}</div>
    </div>
  );
}
