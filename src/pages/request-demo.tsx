import Head from "next/head";
import { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import SectionHeader from "../components/SectionHeader";
import MediaPanel from "../components/MediaPanel";
import DemoRequestForm from "../components/DemoRequestForm";
import { heroImage } from "../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../lib/seo";

export default function RequestDemo() {
  const [submitted, setSubmitted] = useState(false);
  const outcomeSignals = [
    { label: "Executive walkthrough", value: "45 min" },
    { label: "Architecture fit review", value: "Stack-ready" },
    { label: "Delivery roadmap", value: "30-90 days" },
  ];
  const agendaHighlights = [
    "Agent catalog + rollout readiness",
    "MCP server library + integrations",
    "Industry workspaces + case studies",
    "Governance, controls, and audit trails",
    "Modular layers: resources, playbooks, aggregation",
    "Roadmap and next-step implementation",
  ];
  const engagementFlow = [
    {
      title: "Discovery alignment",
      body: "We review priorities, stakeholders, and where AI must create measurable outcomes.",
    },
    {
      title: "Live platform walkthrough",
      body: "Agents, MCP integrations, skills, and governance controls mapped to your workflows.",
    },
    {
      title: "Execution plan",
      body: "You leave with phased recommendations, delivery options, and next checkpoints.",
    },
  ];
  const attendeeRoles = [
    "CEO / COO / Business sponsor",
    "Head of Product / Digital",
    "Engineering & architecture leadership",
    "Operations and data owners",
  ];
  const preparationChecklist = [
    "Primary business outcomes to improve",
    "Current tools and systems in scope",
    "Priority workflows and user personas",
    "Security and compliance requirements",
  ];

  const seoMeta: SeoMeta = {
    title: "Book a Demo | Colaberry AI",
    description: "Talk to our team about your AI strategy. Get a tailored demo of AIXcelerator, agents, MCP servers, and more.",
    canonical: buildCanonical("/request-demo"),
  };

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Book a Demo | Colaberry AI",
              "description": "Request a tailored walkthrough of AIXcelerator, Agents, MCP servers, and modular capability layers.",
              "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai"}/request-demo`,
            }),
          }}
        />
      </Head>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="hero-surface p-6 sm:p-8 lg:col-span-7">
          <div className="rise-in rise-delay-1 chip chip-neutral inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-slate-100 py-1 pl-2 pr-3 text-label font-semibold uppercase tracking-[0.14em] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--trusted-fill)]" />
            Executive demo
          </div>

          <div className="mt-5">
            <SectionHeader
              as="h1"
              size="xl"
              title="Plan your AI platform rollout with a tailored executive demo"
              description="Bring your priorities and current stack. We will run a practical walkthrough focused on architecture fit, deployment readiness, and measurable outcomes."
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {outcomeSignals.map((item) => (
              <div key={item.label} className="card-elevated p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  {item.label}
                </div>
                <div className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {submitted ? (
            <ThankYouPanel onReset={() => setSubmitted(false)} />
          ) : (
            <>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="submit" form="demo-request-form" className="btn btn-cta">
                  Submit demo request
                </button>
                <Link href="/aixcelerator" className="btn btn-secondary">
                  Explore AIXcelerator
                </Link>
              </div>

              <DemoRequestForm
                sourcePage="request-demo"
                sourcePath="/request-demo"
                onSuccess={() => setSubmitted(true)}
              />
            </>
          )}

          <div className="detail-section mt-10">
            <SectionHeader
              kicker="What we can cover"
              title="AI delivery agenda for leadership teams"
              description="Every session is adapted to your operating model, risk posture, and implementation goals."
              size="md"
            />
            <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {agendaHighlights.map((item) => (
                <Bullet key={item}>{item}</Bullet>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <MediaPanel
            kicker="Demo preview"
            title="Walkthrough highlights"
            description="See how agents, MCP, and modular layers connect end to end."
            image={heroImage("hero-platform-cinematic.webp")}
            alt="Enterprise platform walkthrough preview"
            aspect="wide"
            fit="cover"
            className="mb-6"
          />
          <div className="detail-section">
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">What happens after you submit</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">A structured process designed for fast alignment and stakeholder clarity.</div>
            <div className="mt-5 grid gap-3 text-sm text-slate-700">
              {engagementFlow.map((step, index) => (
                <Step key={step.title} n={String(index + 1)} title={step.title} body={step.body} />
              ))}
            </div>
          </div>
          <div className="detail-section mt-4">
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">Who should attend</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Bring decision-makers across product, engineering, and operations for the fastest path to execution.
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-300">
              {attendeeRoles.map((item) => (
                <Bullet key={item}>{item}</Bullet>
              ))}
            </div>
          </div>
          <div className="detail-section mt-4">
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">Preparation checklist</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Sharing this context early helps us tailor the demo for your executive team.
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-300">
              {preparationChecklist.map((item) => (
                <Bullet key={item}>{item}</Bullet>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ThankYouPanel({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="mt-8 rounded-xl border border-[var(--trusted-stroke)] bg-[var(--trusted-surface)] p-8 text-center dark:border-[var(--trusted-stroke)] dark:bg-[var(--trusted-surface)]"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--trusted-surface)] ring-1 ring-[var(--trusted-stroke)] dark:bg-[var(--trusted-surface)]">
        <svg className="h-8 w-8 text-[var(--trusted-fill)] dark:text-[var(--trusted-text)]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-[var(--trusted-text)] dark:text-[var(--trusted-text)]">
        Request received
      </h3>
      <p className="mt-2 text-sm text-[var(--trusted-text)] dark:text-[var(--trusted-text)]">
        We received your details and will follow up in 1-2 business days to schedule your executive walkthrough.
      </p>
      <p className="mt-1 text-sm text-[var(--trusted-fill)] dark:text-[var(--trusted-text)]">
        Check your inbox for the confirmation and next-step notes.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/aixcelerator" className="btn btn-cta">
          Explore AIXcelerator
        </Link>
        <button type="button" onClick={onReset} className="btn btn-secondary">
          Submit another request
        </button>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: string }) {
  return (
    <div className="flex gap-2">
      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--trusted-fill)]" />
      <span>{children}</span>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card-elevated flex items-start gap-3 p-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
        {n}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-0.5 text-sm text-slate-600">{body}</div>
      </div>
    </div>
  );
}
