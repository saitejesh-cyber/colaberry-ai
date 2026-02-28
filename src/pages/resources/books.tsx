import Head from "next/head";
import Layout from "../../components/Layout";
import Link from "next/link";
import SectionHeader from "../../components/SectionHeader";
import EnterprisePageHero from "../../components/EnterprisePageHero";
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
    description: "Books and companion artifacts including templates, worksheets, code samples, and related learning assets.",
    canonical: buildCanonical("/resources/books"),
  };

  const hasCmsBooks = books.length > 0;

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
          "description": "Books and companion artifacts including templates, worksheets, code samples, and related learning assets.",
          "url": buildCanonical("/resources/books"),
          "publisher": { "@type": "Organization", "name": "Colaberry AI" },
        }) }} />
      </Head>
      <EnterprisePageHero
        kicker="Resources"
        title="Books & artifacts"
        description="Books and companion artifacts — templates, worksheets, code samples, and related learning assets."
        image={heroImage("hero-books-cinematic.webp")}
        alt="Curated books and artifact knowledge surface"
        imageKicker="Artifacts"
        imageTitle="Learning assets"
        imageDescription="Curated books and reusable artifacts."
        primaryAction={{ label: "Browse resources", href: "/resources" }}
      />

      {/* CMS-driven book cards */}
      {hasCmsBooks && (
        <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="surface-panel border border-slate-200/80 bg-white/90 dark:bg-[var(--surface-strong)]/90 p-6"
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
          description="A foundational guide to responsible AI delivery—designed for leadership teams, operators, and LLM indexability."
          size="md"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Trust-by-design principles for enterprise AI adoption.",
            "Governance, reliability, and alignment frameworks.",
            "Practical checklists for teams and delivery leaders.",
            "LLM-ready summaries for faster discovery.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200/80 bg-white/90 dark:bg-[var(--surface-strong)]/90 p-4 text-sm text-slate-700 shadow-sm"
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
          <PlannedCard title="Books" description="Catalog books, chapters, and release notes." badge="Planned" />
          <PlannedCard
            title="Artifacts"
            description="Store/download templates, worksheets, and companion assets."
            badge="Planned"
          />
          <PlannedCard
            title="Learning paths"
            description="Curate reading + artifacts by role, industry, or solution."
            badge="Planned"
          />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/resources"
          className="btn btn-secondary"
        >
          Back to Resources
        </Link>
        <Link
          href="/solutions"
          className="btn btn-primary"
        >
          Explore Solutions
        </Link>
      </div>
    </Layout>
  );
}

function PlannedCard({ title, description, badge }: { title: string; description: string; badge: string }) {
  return (
    <div className="surface-panel border border-slate-200/80 bg-white/90 dark:bg-[var(--surface-strong)]/90 p-6">
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
