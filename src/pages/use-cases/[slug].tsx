import { useState, useEffect } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import Layout from "../../components/Layout";
import Breadcrumb from "../../components/Breadcrumb";
import SectionHeader from "../../components/SectionHeader";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import StatePanel from "../../components/StatePanel";
import { fetchUseCaseBySlug, UseCase } from "../../lib/cms";
import { heroImage } from "../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";

type UseCaseDetailProps = {
  useCase: UseCase;
  allowPrivate: boolean;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<UseCaseDetailProps> = async ({ params }) => {
  const slug = String(params?.slug || "");
  if (!slug) {
    return { notFound: true, revalidate: 120 };
  }

  const allowPrivate = process.env.NEXT_PUBLIC_SHOW_PRIVATE === "true";

  try {
    const useCase = await fetchUseCaseBySlug(slug);
    if (!useCase) {
      return { notFound: true, revalidate: 120 };
    }
    if (!allowPrivate && (useCase.visibility || "public").toLowerCase() === "private") {
      return { notFound: true, revalidate: 120 };
    }

    return {
      props: { useCase, allowPrivate },
      revalidate: 600,
    };
  } catch {
    return { notFound: true, revalidate: 120 };
  }
};

export default function UseCaseDetailPage({ useCase, allowPrivate }: UseCaseDetailProps) {
  const isPrivate = (useCase.visibility || "public").toLowerCase() === "private";
  const status = (useCase.status || "live").toLowerCase();
  const source = (useCase.source || "internal").toLowerCase();
  const sourceLabel =
    source === "external" ? "External" : source === "partner" ? "Partner" : "Internal";
  const sourceDisplay = useCase.sourceName ? `${sourceLabel} (${useCase.sourceName})` : sourceLabel;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colaberry.ai";
  const canonicalUrl = `${siteUrl}/use-cases/${useCase.slug}`;
  const metaTitle = `${useCase.title} | Use Cases | Colaberry AI`;
  const metaDescription =
    useCase.summary ||
    "Enterprise use case profile with problem framing, implementation approach, and outcome signals.";
  const seoMeta: SeoMeta = {
    title: metaTitle,
    description: metaDescription,
    canonical: buildCanonical(`/use-cases/${useCase.slug}`),
    ogType: "article",
    ogImage: useCase.coverImageUrl || null,
    ogImageAlt: useCase.coverImageAlt || useCase.title,
  };
  const keyBenefits = parseList(useCase.keyBenefits);
  const implementationSteps = parseList(useCase.implementationSteps);
  const requirements = parseList(useCase.requirements);
  const limitations = parseList(useCase.limitations);
  const lastUpdatedLabel = formatDate(useCase.lastUpdated);
  const hasOverview =
    Boolean(useCase.problem || useCase.approach || useCase.outcomes || useCase.metrics);
  const hasExecutionDetails =
    keyBenefits.length > 0 ||
    implementationSteps.length > 0 ||
    requirements.length > 0 ||
    limitations.length > 0;
  const hasRelations = useCase.agents.length > 0 || useCase.mcpServers.length > 0;
  const hasLinks = Boolean(useCase.docsUrl || useCase.demoUrl || useCase.sourceUrl);
  const visibilityModeNote = allowPrivate
    ? "Private preview mode enabled for this environment."
    : "Public-only mode in this environment.";
  const safeLongDescription = sanitizeRichText(useCase.longDescription);

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: useCase.title,
    name: useCase.title,
    description: metaDescription,
    url: canonicalUrl,
    about: [useCase.industry, useCase.category].filter(Boolean),
    keywords: [...(useCase.tags || []).map((tag) => tag.name || tag.slug || "")].filter(Boolean),
    isAccessibleForFree: !isPrivate,
    ...(lastUpdatedLabel ? { dateModified: useCase.lastUpdated } : {}),
    publisher: {
      "@type": "Organization",
      name: "Colaberry AI",
      url: siteUrl,
    },
  };

  const jsonLdHowTo = implementationSteps.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to implement: ${useCase.title}`,
        description: useCase.approach || metaDescription,
        url: canonicalUrl,
        step: implementationSteps.map((step, idx) => ({
          "@type": "HowToStep",
          position: idx + 1,
          text: step,
        })),
      }
    : null;

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
        {jsonLdHowTo && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
        )}
      </Head>

      <ScrollProgress />

      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Use Cases", href: "/use-cases" },
        { label: useCase.title },
      ]} />

      <div className="mt-4">
        <EnterprisePageHero
          kicker="Use case profile"
          title={useCase.title}
          description={metaDescription}
          image={heroImage("hero-solutions-cinematic.webp")}
          alt={`${useCase.title} use case preview`}
          imageKicker="Use case lane"
          imageTitle="Workflow orchestration context"
          imageDescription={`${useCase.industry || "General"}${useCase.category ? ` • ${useCase.category}` : ""} • ${
            status.charAt(0).toUpperCase() + status.slice(1)
          }`}
          chips={[
            useCase.industry || "General",
            ...(useCase.category ? [useCase.category] : []),
            status.charAt(0).toUpperCase() + status.slice(1),
            isPrivate ? "Private" : "Public",
            sourceDisplay,
            ...(useCase.verified ? ["Verified"] : []),
          ]}
          primaryAction={
            useCase.docsUrl
              ? { label: "Open docs", href: useCase.docsUrl, external: true }
              : useCase.demoUrl
              ? { label: "Open demo", href: useCase.demoUrl, external: true }
              : { label: "Back to use cases", href: "/use-cases" }
          }
          secondaryAction={{ label: "View solutions", href: "/solutions", variant: "secondary" }}
          metrics={[
            {
              label: "Last updated",
              value: lastUpdatedLabel || "Pending",
              note: "Latest metadata refresh.",
            },
            {
              label: "Linked assets",
              value: `${useCase.agents.length} agents • ${useCase.mcpServers.length} MCP`,
              note: "Catalog components in this workflow.",
            },
            {
              label: "Visibility",
              value: isPrivate ? "Private" : "Public",
              note: isPrivate
                ? "Restricted access listing."
                : `Available for catalog discovery. ${visibilityModeNote}`,
            },
          ]}
        />
      </div>

      <section className="reveal section-spacing grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="grid gap-6">
          {!hasOverview && !safeLongDescription ? (
            <StatePanel
              variant="empty"
              title="Use case content is being populated"
              description="Add overview details in CMS to publish the full use case profile."
            />
          ) : (
            <>
              {safeLongDescription ? (
                <section className="surface-panel section-shell p-6">
                  <SectionHeader
                    as="h2"
                    size="md"
                    kicker="Narrative"
                    title="Long description"
                    description="Context and rationale for this deployment pattern."
                  />
                  <div
                    className="prose mt-6 max-w-none text-slate-700 dark:text-slate-200"
                    dangerouslySetInnerHTML={{ __html: safeLongDescription }}
                  />
                </section>
              ) : null}

              {hasOverview ? (
                <section className="surface-panel section-shell p-6">
                  <SectionHeader
                    as="h2"
                    size="md"
                    kicker="Operational overview"
                    title="Problem, approach, and outcomes"
                    description="How this use case is structured from intent through delivery."
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <InfoBlock title="Problem" body={useCase.problem} />
                    <InfoBlock title="Approach" body={useCase.approach} />
                    <InfoBlock title="Outcomes" body={useCase.outcomes} />
                    <InfoBlock title="Metrics" body={useCase.metrics} />
                    <InfoBlock title="Timeline" body={useCase.timeline} />
                  </div>
                </section>
              ) : null}

              {hasExecutionDetails ? (
                <section className="surface-panel section-shell p-6">
                  <SectionHeader
                    as="h2"
                    size="md"
                    kicker="Execution details"
                    title="Benefits, steps, and constraints"
                    description="Implementation guidance for teams adopting this pattern."
                  />
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <ListBlock title="Key benefits" items={keyBenefits} empty="Benefits not documented yet." />
                    <ListBlock
                      title="Implementation steps"
                      items={implementationSteps}
                      empty="Implementation steps not documented yet."
                    />
                    <ListBlock title="Requirements" items={requirements} empty="Requirements not documented yet." />
                    <ListBlock title="Limitations" items={limitations} empty="Limitations not documented yet." />
                  </div>
                </section>
              ) : null}
            </>
          )}

          {hasRelations ? (
            <section className="surface-panel section-shell p-6">
              <SectionHeader
                as="h2"
                size="md"
                kicker="Linked assets"
                title="Related agents and MCP servers"
                description="Connected catalog entries that implement this use case."
              />
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <RelationList
                  title="Agents"
                  empty="No linked agents yet."
                  links={useCase.agents.map((agent) => ({
                    href: `/aixcelerator/agents/${agent.slug}`,
                    label: agent.name || agent.slug,
                  }))}
                />
                <RelationList
                  title="MCP servers"
                  empty="No linked MCP servers yet."
                  links={useCase.mcpServers.map((server) => ({
                    href: `/aixcelerator/mcp/${server.slug}`,
                    label: server.name || server.slug,
                  }))}
                />
              </div>
            </section>
          ) : null}

          {hasLinks ? (
            <section className="surface-panel section-shell p-6">
              <SectionHeader
                as="h2"
                size="md"
                kicker="References"
                title="Docs and external links"
                description="Reference endpoints and source materials."
              />
              <div className="mt-6 flex flex-wrap gap-3">
                {useCase.docsUrl ? (
                  <a href={useCase.docsUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Open docs
                  </a>
                ) : null}
                {useCase.demoUrl ? (
                  <a href={useCase.demoUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    Open demo
                  </a>
                ) : null}
                {useCase.sourceUrl ? (
                  <a href={useCase.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
                    Open source reference
                  </a>
                ) : null}
              </div>
            </section>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/use-cases" className="btn btn-secondary">
              Back to Use Cases
            </Link>
            <Link href="/solutions" className="btn btn-primary">
              View Solutions
            </Link>
          </div>
        </div>

        <aside className="surface-panel p-6 lg:sticky lg:top-6">
          <SectionHeader
            as="h2"
            size="md"
            kicker="LLM metadata"
            title="Structured profile"
            description="Fields optimized for catalog indexing and retrieval."
          />
          <dl className="mt-6 grid gap-4">
            <MetadataRow label="Title" value={useCase.title} />
            <MetadataRow label="Slug" value={useCase.slug} />
            <MetadataRow label="Industry" value={useCase.industry || "General"} />
            <MetadataRow label="Category" value={useCase.category || "Not provided"} />
            <MetadataRow label="Status" value={status.charAt(0).toUpperCase() + status.slice(1)} />
            <MetadataRow label="Visibility" value={isPrivate ? "Private" : "Public"} />
            <MetadataRow label="Source" value={sourceDisplay} />
            <MetadataRow label="Verified" value={useCase.verified ? "Yes" : "No"} />
            <MetadataRow label="Last updated" value={lastUpdatedLabel || "Not provided"} />
          </dl>

          {(useCase.tags || []).length > 0 && (
            <div className="mt-6 border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
              <div className="text-label font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Tags
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(useCase.tags || []).map((tag) => (
                  <span key={tag.slug} className="chip chip-muted rounded-md px-2.5 py-1 text-xs font-semibold">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>

      <ShareActions title={useCase.title} />
    </Layout>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="scroll-progress"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}

function ShareActions({ title: _title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="fixed bottom-6 right-6 z-30 flex gap-2">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] shadow-lg transition-colors hover:bg-[var(--surface-soft)]"
        aria-label="Copy link"
        onClick={copy}
      >
        {copied ? (
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--trust-green)]" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
        )}
      </button>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function parseList(value?: string | null) {
  if (!value) return [];
  return value
    .split(/\r?\n|;/g)
    .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
    .filter(Boolean);
}

function sanitizeRichText(value?: string | null) {
  if (!value) return "";
  return sanitizeHtml(value, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "a",
      "blockquote",
      "code",
      "pre",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-section">
      <dt className="text-label font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}

function InfoBlock({ title, body }: { title: string; body?: string | null }) {
  return (
    <div className="detail-section">
      <div className="text-label font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{title}</div>
      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{body || "Not documented yet."}</p>
    </div>
  );
}

function ListBlock({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="detail-section">
      <div className="text-label font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{title}</div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RelationList({
  title,
  links,
  empty,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
  empty: string;
}) {
  return (
    <div className="card-elevated p-5">
      <div className="text-label font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{title}</div>
      {links.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {links.map((item) => (
            <li key={`${item.href}|${item.label}`}>
              <Link
                href={item.href}
                className="text-sm font-semibold text-slate-700 hover:underline dark:text-slate-300 dark:hover:text-slate-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
