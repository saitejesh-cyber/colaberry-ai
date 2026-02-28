import Head from "next/head";
import Layout from "../components/Layout";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../lib/seo";

export default function CookiePolicyPage() {
  const seoMeta: SeoMeta = {
    title: "Cookie Policy | Colaberry AI",
    description: "Colaberry AI cookie policy with cookie categories and user preference controls.",
    canonical: buildCanonical("/cookie-policy"),
  };

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Cookie Policy",
          "description": "Colaberry AI cookie policy with cookie categories and user preference controls.",
          "url": buildCanonical("/cookie-policy"),
          "publisher": { "@type": "Organization", "name": "Colaberry AI" },
        }) }} />
      </Head>

      <section className="mx-auto w-full max-w-4xl">
        <div className="surface-panel border border-slate-200/80 bg-white/95 px-6 py-8 shadow-sm dark:border-[#374151] dark:bg-[#111827]/85 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-1 text-label font-semibold uppercase tracking-[0.14em] text-[#111827] dark:border-slate-700 dark:bg-slate-800 dark:text-[#F9FAFB]">
            Legal
          </div>
          <h1 className="mt-4 font-display text-display-sm sm:text-display-md font-bold text-slate-900 dark:text-slate-100">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Last updated: February 17, 2026
          </p>

          <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700 dark:text-slate-300">
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Essential cookies</h2>
              <p>
                Required for authentication state, security controls, and basic site functionality. These cookies
                cannot be disabled.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Analytics cookies</h2>
              <p>
                Used to measure usage patterns, page performance, and feature engagement so we can improve product
                quality and UX.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Advertising cookies</h2>
              <p>
                Used for campaign attribution and personalized marketing. These are optional and off by default until
                accepted.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Manage preferences</h2>
              <p>
                You can update your consent anytime using the Cookie Preferences control available on every page.
                Changes are applied immediately and stored in your browser.
              </p>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
}
