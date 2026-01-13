import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  const industries = [
    { name: "Agriculture", slug: "agriculture", icon: "leaf" as const },
    { name: "Energy", slug: "energy", icon: "droplet" as const },
    { name: "Utilities", slug: "utilities", icon: "tower" as const },
    {
      name: "Healthcare & Life Sciences",
      slug: "healthcare-life-sciences",
      icon: "dna" as const,
    },
    { name: "Climate Tech", slug: "climate-tech", icon: "leaf" as const },
    { name: "Manufacturing", slug: "manufacturing", icon: "factory" as const },
    { name: "Fintech", slug: "fintech", icon: "truck" as const },
    { name: "Supply Chain", slug: "supply-chain", icon: "truck" as const },
  ];

  return (
    <Layout>
      <section className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-white py-1 pl-2 pr-3 text-xs text-brand-deep">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-aqua" />
            Enterprise AI assistant + agent platform
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Build AI assistants that search, act, and deliver outcomes across your stack
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Colaberry AI unifies agents, MCP servers, and industry context into an operational
            platform-so teams can find answers quickly, automate workflows end-to-end, and
            improve quality with governance, observability, and evaluation.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/request-demo"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 bg-gradient-to-r from-brand-blue to-brand-aqua px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:from-brand-deep hover:to-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            >
              Book a demo
            </Link>
            <Link
              href="/aixcelerator/agents"
              className="inline-flex items-center justify-center rounded-lg border border-brand-blue/25 bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-slate-50"
            >
              Browse agents
            </Link>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              What teams ship with this
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Instant answers in context",
                "Automate multi-step tasks",
                "Governed access + audit trails",
                "Observability + evaluations",
                "Industry-aligned playbooks",
                "Code-first, low-code options",
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Operational readiness</div>
            <div className="mt-1 text-sm text-slate-600">
              Clear controls and metrics from development to production.
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Metric label="Governance" value="Policy controls" />
              <Metric label="Reliability" value="SLO alignment" />
              <Metric label="Security" value="Audit trails" />
              <Metric label="Scale" value="Multi-workspace" />
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Security posture
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                <Badge>SSO-ready</Badge>
                <Badge>Role-based access</Badge>
                <Badge>Audit logging</Badge>
                <Badge>Data boundaries</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:mt-12">
        <div className="grid gap-6 sm:grid-cols-4">
          <Stat title="Weeks to value" value="Fast" note="Start with ready templates" />
          <Stat title="Deployments" value="Repeatable" note="Versioned and auditable" />
          <Stat title="Integrations" value="Extensible" note="MCP-ready connectivity" />
          <Stat title="Governance" value="Built-in" note="Policies and ownership" />
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Agents & assistants catalog"
          description="Adopt agents with clear ownership, status, and workflow alignment-ready for rollout."
        />
        <FeatureCard
          title="MCP integration library"
          description="Standardize tool access via MCP with integration-ready server patterns and endpoints."
        />
        <FeatureCard
          title="Observability + evaluation"
          description="Track outcomes and failures, then close the loop with evals to improve reliability."
        />
        <FeatureCard
          title="Security by design"
          description="Access controls, data boundaries, and governance workflows designed for enterprise."
        />
        <FeatureCard
          title="Industry workspaces"
          description="Bring domain context into delivery with repeatable playbooks and patterns."
        />
        <FeatureCard
          title="Developer control"
          description="Use a clean platform surface that supports code-level control with faster patterns when needed."
        />
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Connect your stack
            </div>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Integrations-ready from day one</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Build assistants that can act across your tools-using a standardized MCP surface.
            </p>
          </div>
          <Link
            href="/aixcelerator/mcp"
            className="mt-3 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 sm:mt-0"
          >
            Explore MCP servers
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            "Slack",
            "Microsoft Teams",
            "Google Drive",
            "Salesforce",
            "ServiceNow",
            "Workday",
            "Jira",
            "Okta",
            "Zendesk",
            "Snowflake",
            "AWS",
            "GitHub",
          ].map((name) => (
            <span
              key={name}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:mt-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Our vision
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
            A vibrant destination for people, LLMs, and agents
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            We’re building a place where teams can discover, deploy, and improve agentic systems-while
            staying grounded in the industries we already serve today and the ones we’ll serve next.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/aixcelerator"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Explore the platform
            </Link>
            <Link
              href="/industries/agriculture"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              View industries
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Industry expertise
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                Proven success across industries
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {industries.map((item) => (
              <IndustryTile
                key={item.slug}
                href={`/industries/${item.slug}`}
                title={item.name}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Explore next
            </div>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Resources, solutions, and updates</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Dedicated landing spots for podcasts, books, white papers, case studies, and news.
            </p>
          </div>
          <Link
            href="/resources"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-slate-900 bg-gradient-to-r from-brand-blue to-brand-aqua px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:from-brand-deep hover:to-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 sm:mt-0"
          >
            Explore resources
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <QuickLink href="/solutions" title="Solutions" description="Packaged offerings and playbooks." />
          <QuickLink href="/resources/podcasts" title="Podcasts" description="Internal posts + external curation." />
          <QuickLink href="/updates" title="News & product" description="Updates, announcements, and signals." />
        </div>
      </section>
    </Layout>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-blue/40 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>
        </div>
        <div className="mt-0.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-deep">
          →
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-slate-600">{description}</div>
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

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
      {children}
    </span>
  );
}

function Stat({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-600">{note}</div>
    </div>
  );
}

type IndustryIcon = "leaf" | "tower" | "droplet" | "dna" | "factory" | "truck";

function IndustryTile({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: IndustryIcon;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="absolute right-4 top-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-deep">
        →
      </div>
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 group-hover:bg-white">
          <IndustryIconSvg icon={icon} />
        </div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
      </div>
    </Link>
  );
}

function IndustryIconSvg({ icon }: { icon: IndustryIcon }) {
  const common = "h-7 w-7";
  switch (icon) {
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path
            d="M20 4c-6.5 0-12 3.2-14.8 9.2C4.3 15.1 4 17 4 20c3 0 4.9-.3 6.8-1.2C16.8 16 20 10.5 20 4Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M7 17c2-2.6 5.2-5.2 10-7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "tower":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path
            d="M12 2v20"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M7 22l5-8 5 8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M6 8c2.2-2 4.3-3 6-3s3.8 1 6 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "droplet":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path
            d="M12 2s6 6.4 6 12a6 6 0 1 1-12 0C6 8.4 12 2 12 2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "dna":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path
            d="M8 3c3 3 3 6 0 9s-3 6 0 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M16 3c-3 3-3 6 0 9s3 6 0 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M9 7h6M9 12h6M9 17h6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "factory":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path
            d="M4 21V10l6 3V10l6 3V8l4 2v11H4Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8 21v-4m4 4v-4m4 4v-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "truck":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
          <path
            d="M3 7h11v10H3V7Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M14 10h4l3 3v4h-7v-7Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M7 19.5a1.5 1.5 0 1 0 0-.01V19.5Zm12 0a1.5 1.5 0 1 0 0-.01V19.5Z"
            fill="currentColor"
          />
        </svg>
      );
  }
}
