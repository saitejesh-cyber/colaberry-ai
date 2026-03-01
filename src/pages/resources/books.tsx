import Head from "next/head";
import Layout from "../../components/Layout";
import Link from "next/link";
import SectionHeader from "../../components/SectionHeader";
import EnterprisePageHero from "../../components/EnterprisePageHero";
import EnterpriseCtaBand from "../../components/EnterpriseCtaBand";
import { heroImage } from "../../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../../lib/seo";
import type { GetStaticProps } from "next";
import { fetchBooks, type Book } from "../../lib/cms";

type BooksProps = {
  books: Book[];
};

export const getStaticProps: GetStaticProps<BooksProps> = async () => {
  let books: Book[] = [];
  try {
    books = await fetchBooks("public");
  } catch {
    // CMS unavailable — fall back to empty list (hardcoded fallback renders below)
  }
  return { props: { books }, revalidate: 3600 };
};

export default function Books({ books }: BooksProps) {
  const seoMeta: SeoMeta = {
    title: "Books & Artifacts | Colaberry AI",
    description: "Books, templates, and reusable assets to help your team build trustworthy AI systems and accelerate enterprise adoption.",
    canonical: buildCanonical("/resources/books"),
  };

  const hasCmsBooks = books.length > 0;
  const downloadableCount = books.filter((book) => Boolean(book.downloadUrl)).length;
  const upcomingCount = books.filter((book) => (book.status || "").toLowerCase() === "planned").length;
  const trackCards = [
    {
      title: "Executive learning track",
      description: "Outcome-driven material for sponsors validating value, risk, and operating model decisions.",
      href: "/resources/case-studies",
      cta: "Open case studies",
    },
    {
      title: "Architecture track",
      description: "Books and artifacts for governance, reference architecture, and controlled rollout design.",
      href: "/resources/white-papers",
      cta: "Read white papers",
    },
    {
      title: "Delivery track",
      description: "Implementation-ready assets for squads shipping agents, integrations, and measurable outcomes.",
      href: "/resources/podcasts",
      cta: "Browse podcasts",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Books & Artifacts",
          "description": "Books, templates, and reusable assets to build trustworthy AI systems and accelerate enterprise adoption.",
          "url": buildCanonical("/resources/books"),
          "publisher": { "@type": "Organization", "name": "Colaberry AI" },
        }) }} />
      </Head>
      <EnterprisePageHero
        kicker="Resources"
        title="Books & artifacts"
        description="Deep-dive books and ready-to-use templates that help teams build, govern, and scale AI with confidence."
        image={heroImage("hero-books-cinematic.webp")}
        alt="Books and delivery assets for enterprise AI teams"
        imageKicker="Artifacts"
        imageTitle="Accelerate your team"
        imageDescription="Books and reusable assets designed for practitioners and leaders."
        primaryAction={{ label: "Browse resources", href: "/resources" }}
        secondaryAction={{ label: "Explore case studies", href: "/resources/case-studies", variant: "secondary" }}
        metrics={[
          {
            label: "Published titles",
            value: hasCmsBooks ? String(books.length) : "Featured",
            note: "Books and artifacts mapped to enterprise AI delivery.",
          },
          {
            label: "Downloads",
            value: String(downloadableCount),
            note: "Assets immediately available to your team.",
          },
          {
            label: "Roadmap items",
            value: String(upcomingCount),
            note: "Planned additions queued in the content backlog.",
          },
        ]}
      />

      <section className="surface-panel mt-6 p-6 sm:mt-8">
        <SectionHeader
          kicker="Learning pathways"
          title="Pick the track that matches your role"
          description="Each pathway groups resources by the decision you are trying to make next."
          size="md"
        />
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {trackCards.map((track) => (
            <article key={track.title} className="card-feature p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{track.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {track.description}
              </p>
              <Link href={track.href} className="btn btn-ghost mt-3 text-xs">
                {track.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* CMS-driven book cards */}
      {hasCmsBooks && (
        <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="surface-panel p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-slate-900">{book.title}</div>
                  {book.summary && (
                    <p className="mt-1 text-sm text-slate-600 line-clamp-3">{book.summary}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {book.publisher && <span>{book.publisher}</span>}
                    {book.publishDate && (
                      <span>
                        {book.publisher ? " · " : ""}
                        {new Date(book.publishDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                    {book.format && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {book.format}
                      </span>
                    )}
                  </div>
                </div>
                {book.status && (
                  <span className="chip chip-muted shrink-0 rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {book.status}
                  </span>
                )}
              </div>
              {(book.downloadUrl || book.previewUrl || book.sourceUrl) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {book.downloadUrl && (
                    <a
                      href={book.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Download
                    </a>
                  )}
                  {book.previewUrl && (
                    <a
                      href={book.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Preview
                    </a>
                  )}
                  {book.sourceUrl && !book.downloadUrl && !book.previewUrl && (
                    <a
                      href={book.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      View source
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Hardcoded fallback: featured book */}
      <section id="trust-before-intelligence" className="surface-panel mt-6 p-6 sm:mt-8">
        <SectionHeader
          kicker="Featured book"
          title="Trust Before Intelligence"
          description="A practical guide to building trust into every stage of enterprise AI delivery -- for leaders, operators, and technical teams."
          size="md"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Build stakeholder confidence before scaling AI investments.",
            "Governance and risk frameworks that satisfy compliance teams.",
            "Actionable checklists for CIOs, delivery leads, and engineers.",
            "Reduce time-to-trust with structured adoption playbooks.",
          ].map((item) => (
            <div
              key={item}
              className="section-card rounded-2xl p-4 text-sm text-slate-700 dark:text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="https://trustbeforeintelligence.ai/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Visit Trust Before Intelligence
          </Link>
          <Link
            href="/resources"
            className="btn btn-secondary"
          >
            Back to Resources
          </Link>
        </div>
      </section>

      {/* Planned placeholders shown only when CMS is empty */}
      {!hasCmsBooks && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <PlannedCard title="Books" description="Full-length guides on AI strategy, governance, and delivery." badge="Planned" />
          <PlannedCard
            title="Artifacts"
            description="Downloadable templates, checklists, and companion assets."
            badge="Planned"
          />
          <PlannedCard
            title="Learning paths"
            description="Curated reading tracks by role, industry, or solution area."
            badge="Planned"
          />
        </div>
      )}

      <EnterpriseCtaBand
        kicker="Scale capability"
        title="Turn reading into delivery momentum"
        description="Use books and artifacts to align leadership, architecture, and delivery on one AI execution model."
        primaryHref="/resources"
        primaryLabel="Back to resources"
        secondaryHref="/solutions"
        secondaryLabel="Explore solutions"
      />
    </Layout>
  );
}

function PlannedCard({ title, description, badge }: { title: string; description: string; badge: string }) {
  return (
    <div className="surface-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{description}</div>
        </div>
        <span className="chip chip-muted rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
          {badge}
        </span>
      </div>
    </div>
  );
}
