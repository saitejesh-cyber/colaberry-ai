import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import EnterpriseCtaBand from "../components/EnterpriseCtaBand";
import EnterprisePageHero from "../components/EnterprisePageHero";
import SectionHeader from "../components/SectionHeader";
import { heroImage } from "../lib/media";
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

      <EnterprisePageHero
        kicker="Legal"
        title="Cookie Policy"
        description="How Colaberry AI uses essential and optional cookies, and how you can control preferences at any time."
        image={heroImage("hero-resources-cinematic.webp")}
        alt="Cookie policy and consent management overview"
        imageKicker="Consent controls"
        imageTitle="Transparent tracking choices"
        imageDescription="Clear separation between essential, analytics, and advertising usage."
        chips={["Essential", "Analytics", "Advertising", "Preference controls"]}
        primaryAction={{ label: "Privacy policy", href: "/privacy-policy" }}
        secondaryAction={{ label: "Back to updates", href: "/updates", variant: "secondary" }}
        metrics={[
          {
            label: "Last updated",
            value: "Feb 17, 2026",
            note: "Aligned with current consent and tracking behavior.",
          },
          {
            label: "Control model",
            value: "User-managed",
            note: "Preferences can be updated at any time.",
          },
          {
            label: "Default posture",
            value: "Essential only",
            note: "Optional categories require consent.",
          },
        ]}
      />

      <section className="surface-panel section-spacing p-5 sm:p-6">
        <SectionHeader
          kicker="Cookie categories"
          title="What each cookie class does"
          description="A quick operational summary before the full policy details."
          size="md"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="section-card rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200">Essential cookies power authentication, security, and baseline site behavior.</div>
          <div className="section-card rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200">Analytics cookies measure engagement and performance for product improvement.</div>
          <div className="section-card rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200">Advertising cookies support attribution and campaign effectiveness when enabled.</div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl">
        <div className="surface-panel px-6 py-8 shadow-sm sm:px-8">
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
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/privacy-policy" className="btn btn-secondary btn-sm">
              Privacy policy
            </Link>
            <Link href="/updates" className="btn btn-ghost btn-sm">
              Back to updates
            </Link>
          </div>
        </div>
      </section>

      <EnterpriseCtaBand
        kicker="Preference updates"
        title="Need to change consent settings?"
        description="Use Cookie Preferences on any page to update analytics and advertising consent instantly."
        primaryHref="/privacy-policy"
        primaryLabel="Review privacy policy"
        secondaryHref="/updates"
        secondaryLabel="Back to updates"
      />
    </Layout>
  );
}
