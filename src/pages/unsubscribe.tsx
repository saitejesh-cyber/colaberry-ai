import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import EnterpriseCtaBand from "../components/EnterpriseCtaBand";
import EnterprisePageHero from "../components/EnterprisePageHero";
import SectionHeader from "../components/SectionHeader";
import StatePanel from "../components/StatePanel";
import { heroImage } from "../lib/media";
import { seoTags, canonicalUrl as buildCanonical, type SeoMeta } from "../lib/seo";

type UnsubscribeState = "idle" | "submitting" | "success" | "error";

type ApiPayload = {
  ok?: boolean;
  message?: string;
};

export default function UnsubscribePage() {
  const router = useRouter();
  const token = typeof router.query.token === "string" ? router.query.token : "";
  const email = typeof router.query.email === "string" ? router.query.email : "";
  const hasUnsubscribeInput = Boolean(token || email);
  const [state, setState] = useState<UnsubscribeState>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;
    if (!hasUnsubscribeInput) return;

    let isActive = true;
    fetch("/api/newsletter-unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token || undefined,
        email: email || undefined,
      }),
    })
      .then(async (response) => {
        const payload = (await response.json()) as ApiPayload;
        if (!isActive) return;
        if (!response.ok || !payload?.ok) {
          setState("error");
          setMessage(payload?.message || "Unable to process unsubscribe request.");
          return;
        }
        setState("success");
        setMessage(payload?.message || "You have been unsubscribed.");
      })
      .catch(() => {
        if (!isActive) return;
        setState("error");
        setMessage("Unable to process unsubscribe request.");
      });

    return () => {
      isActive = false;
    };
  }, [router.isReady, token, email, hasUnsubscribeInput]);

  const seoMeta: SeoMeta = {
    title: "Unsubscribe | Colaberry AI",
    description: "Manage your Colaberry AI newsletter subscription preferences.",
    canonical: buildCanonical("/unsubscribe"),
    noindex: true,
  };
  const stateLabel =
    state === "success"
      ? "Completed"
      : state === "error"
      ? "Needs attention"
      : state === "submitting" || (hasUnsubscribeInput && state === "idle")
      ? "Processing"
      : "Awaiting link";
  const statusDescription =
    state === "success"
      ? "Your subscription preference has been updated."
      : state === "error"
      ? "The request could not be completed from this link."
      : "Waiting for a valid unsubscribe token or email parameter.";

  return (
    <Layout>
      <Head>
        <title>{seoMeta.title}</title>
        {seoTags(seoMeta).map(({ key, ...props }) => (
          "rel" in props ? <link key={key} {...props} /> : <meta key={key} {...props} />
        ))}
      </Head>
      <EnterprisePageHero
        kicker="Newsletter"
        title="Manage your subscription"
        description="Use this secure endpoint to unsubscribe from Colaberry AI update emails."
        image={heroImage("hero-unsubscribe-cinematic.webp")}
        alt="Newsletter preference management"
        imageKicker="Preference control"
        imageTitle="Unsubscribe status"
        imageDescription={statusDescription}
        chips={[`Status: ${stateLabel}`, hasUnsubscribeInput ? "Token detected" : "Token missing", "One-click update"]}
        primaryAction={{ label: "Back to updates", href: "/updates" }}
        secondaryAction={{ label: "Go to homepage", href: "/", variant: "secondary" }}
        metrics={[
          {
            label: "Request state",
            value: stateLabel,
            note: "Current unsubscribe workflow status.",
          },
          {
            label: "Input",
            value: hasUnsubscribeInput ? "Valid link found" : "Missing token/email",
            note: "Token or email query param required.",
          },
          {
            label: "Indexing",
            value: "Disabled",
            note: "This utility page is intentionally `noindex`.",
          },
        ]}
      />

      <section className="surface-panel section-spacing p-5 sm:p-6">
        <SectionHeader
          as="h2"
          size="md"
          kicker="Request status"
          title="Unsubscribe execution"
          description="Your request is processed automatically when a valid token or email parameter is present."
        />
        <div className="mt-4">
          {!hasUnsubscribeInput ? (
            <StatePanel
              variant="error"
              title="Unable to unsubscribe"
              description="A valid unsubscribe link is required."
            />
          ) : null}
          {hasUnsubscribeInput && state === "idle" ? (
            <StatePanel
              variant="empty"
              title="Processing request"
              description="Please wait while we update your subscription preferences."
            />
          ) : null}
          {state === "success" ? (
            <StatePanel variant="empty" title="Unsubscribed" description={message} />
          ) : null}
          {state === "error" ? (
            <StatePanel
              variant="error"
              title="Unable to unsubscribe"
              description={message}
            />
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link href="/updates" className="btn btn-secondary">
            Back to updates
          </Link>
          <Link href="/" className="btn btn-primary">
            Go to homepage
          </Link>
        </div>
      </section>

      <EnterpriseCtaBand
        kicker="Preferences managed"
        title="Need to re-subscribe later?"
        description="You can join the newsletter again from the Updates page whenever you are ready."
        primaryHref="/updates"
        primaryLabel="Open updates"
        secondaryHref="/"
        secondaryLabel="Go to homepage"
      />
    </Layout>
  );
}
