import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import EnterpriseCtaBand from "../components/EnterpriseCtaBand";
import EnterprisePageHero from "../components/EnterprisePageHero";
import SectionHeader from "../components/SectionHeader";
import { heroImage } from "../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../lib/seo";

export default function PrivacyPolicyPage() {
  const seoMeta: SeoMeta = {
    title: "Privacy Policy | Colaberry AI",
    description: "Colaberry AI privacy policy covering data collection, newsletter subscriptions, analytics, and user rights.",
    canonical: buildCanonical("/privacy-policy"),
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
          "name": "Privacy Policy",
          "description": "Colaberry AI privacy policy covering data collection, newsletter subscriptions, analytics, and user rights.",
          "url": buildCanonical("/privacy-policy"),
          "publisher": { "@type": "Organization", "name": "Colaberry AI" },
        }) }} />
      </Head>

      <EnterprisePageHero
        kicker="Legal"
        title="Privacy Policy"
        description="How Colaberry AI collects, uses, and protects data across product experiences, subscriptions, and support interactions."
        image={heroImage("hero-privacy-cinematic.webp")}
        alt="Privacy and data governance overview"
        imageKicker="Data governance"
        imageTitle="Clarity and control"
        imageDescription="Transparent policy for collection, usage, retention, and privacy rights."
        chips={["Data collection", "Usage controls", "Retention", "User rights"]}
        primaryAction={{ label: "Cookie policy", href: "/cookie-policy" }}
        secondaryAction={{ label: "Contact privacy team", href: "mailto:privacy@colaberry.ai", external: true, variant: "secondary" }}
        metrics={[
          {
            label: "Policy scope",
            value: "Site + services",
            note: "Applies across Colaberry AI product surfaces.",
          },
          {
            label: "Last updated",
            value: "Feb 17, 2026",
            note: "Reviewed with current subscription and analytics practices.",
          },
          {
            label: "Contact",
            value: "privacy@colaberry.ai",
            note: "For privacy requests and data-rights inquiries.",
          },
        ]}
      />

      <section className="surface-panel section-spacing p-5 sm:p-6">
        <SectionHeader
          kicker="At a glance"
          title="Privacy principles in plain language"
          description="A quick summary before the full policy details."
          size="md"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="section-card rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200">Collect only what is needed to deliver requested services.</div>
          <div className="section-card rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200">Use data for reliability, support, and product improvement.</div>
          <div className="section-card rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200">Do not sell personal data.</div>
          <div className="section-card rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200">Provide clear contact path for privacy rights and requests.</div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl">
        <div className="surface-panel px-6 py-8 shadow-sm sm:px-8">
          <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700 dark:text-slate-300">
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">What we collect</h2>
              <p>
                We collect information you submit directly (such as newsletter email addresses and demo requests),
                product usage events needed for platform reliability, and optional analytics data when consent is
                granted.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">How we use data</h2>
              <p>
                We use data to deliver requested services, improve product quality, respond to support or demo
                inquiries, and operate security controls. We do not sell personal data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Cookie and tracking choices</h2>
              <p>
                Essential cookies are always enabled for security and core navigation. Analytics and advertising
                cookies are optional and can be updated at any time through Cookie Preferences.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Retention and security</h2>
              <p>
                We keep data only as long as needed for business, legal, and security obligations. We apply reasonable
                technical and organizational safeguards to protect information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contact</h2>
              <p>
                For privacy requests, contact{" "}
                <a className="font-semibold text-slate-700 underline underline-offset-4 dark:text-slate-300" href="mailto:privacy@colaberry.ai" aria-label="Email Colaberry AI privacy team">
                  privacy@colaberry.ai
                </a>
                .
              </p>
            </section>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/cookie-policy" className="btn btn-secondary btn-sm">
              Cookie policy
            </Link>
            <Link href="/updates" className="btn btn-ghost btn-sm">
              Back to updates
            </Link>
          </div>
        </div>
      </section>

      <EnterpriseCtaBand
        kicker="Need support"
        title="Questions about privacy or data handling?"
        description="Reach the privacy team directly for data requests, policy clarifications, or compliance-related inquiries."
        primaryHref="mailto:privacy@colaberry.ai"
        primaryLabel="Email privacy team"
        secondaryHref="/cookie-policy"
        secondaryLabel="Review cookie policy"
      />
    </Layout>
  );
}
