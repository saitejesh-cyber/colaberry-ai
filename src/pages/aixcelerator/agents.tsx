import agents from "../../data/agents.json";
import AgentCard from "../../components/AgentCard";
import Layout from "../../components/Layout";
import Link from "next/link";

export default function Agents() {
  const industries = Array.from(new Set(agents.map((a) => a.industry))).slice(0, 8);
  const statusCounts = agents.reduce<Record<string, number>>((acc, a) => {
    const key = (a.status || "unknown").toLowerCase();
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          AI Agents
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          A governed catalog of enterprise agents and assistants-aligned to teams, workflows, and
          industry context.
        </p>
      </div>

      <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-3 sm:items-center sm:gap-6">
        <Stat title="Agents" value={String(agents.length)} note="Versioned catalog" />
        <Stat title="Industries" value={String(new Set(agents.map((a) => a.industry)).size)} note="Domain-aligned" />
        <Stat
          title="Status mix"
          value={`${statusCounts.active ?? 0} active`}
          note={`${statusCounts.beta ?? 0} beta • ${statusCounts.unknown ?? 0} other`}
        />
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
        {agents.map((a, i) => (
          <AgentCard key={i} agent={a} />
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
