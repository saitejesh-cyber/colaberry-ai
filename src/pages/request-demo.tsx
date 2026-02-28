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

  const seoMeta: SeoMeta = {
    title: "Book a Demo | Colaberry AI",
    description: "Request a tailored walkthrough of AIXcelerator, Agents, MCP servers, and modular capability layers.",
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
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="hero-surface p-6 sm:p-8 lg:col-span-7">
          <div className="rise-in rise-delay-1 chip chip-neutral inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-slate-100 py-1 pl-2 pr-3 text-label font-semibold uppercase tracking-[0.14em] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669]" />
            Demo request
          </div>

          <div className="mt-5">
            <SectionHeader
              as="h1"
              size="xl"
              title="Book a demo"
              description="Tell us what you're trying to launch and we'll tailor a walkthrough across AIXcelerator, Agents, MCP, and the modular capability layers."
            />
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
              title="Demo agenda highlights"
              description="Key topics we can tailor to your workflows and stakeholders."
              size="md"
            />
            <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <Bullet>Agent catalog + rollout readiness</Bullet>
              <Bullet>MCP server library + integrations</Bullet>
              <Bullet>Industry workspaces + case studies</Bullet>
              <Bullet>Governance, controls, and audit trails</Bullet>
              <Bullet>Modular layers: resources, playbooks, aggregation</Bullet>
              <Bullet>Roadmap and next-step implementation</Bullet>
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
            <div className="text-base font-semibold text-slate-900">Suggested demo flow</div>
            <div className="mt-1 text-sm text-slate-600">A clean, consistent walkthrough for stakeholders.</div>
            <div className="mt-5 grid gap-3 text-sm text-slate-700">
              <Step n="1" title="Core platform" body="AIXcelerator + Agents + MCP" />
              <Step n="2" title="Industry workspace" body="Case studies and domain context" />
              <Step n="3" title="Modular layers" body="Resources, playbooks, news/product" />
              <Step n="4" title="Deployment" body="Governance, audit, reliability" />
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
        Thank you for your request!
      </h3>
      <p className="mt-2 text-sm text-[var(--trusted-text)] dark:text-[var(--trusted-text)]">
        We have received your demo request and will reach out within 1-2 business days to schedule a
        tailored walkthrough for your team.
      </p>
      <p className="mt-1 text-sm text-[var(--trusted-fill)] dark:text-[var(--trusted-text)]">
        Check your inbox for a confirmation email.
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
      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#059669]" />
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
