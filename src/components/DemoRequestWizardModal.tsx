import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_DEMO_REQUEST_MESSAGE,
  isValidWorkEmail,
  submitDemoRequest,
} from "../lib/demoRequest";
import { getTrackingContext, type UtmContext } from "../lib/tracking";

type DemoRequestWizardModalProps = {
  open: boolean;
  onClose: () => void;
  sourcePage?: string;
  sourcePath?: string;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

const STEP_LABELS = ["Contact", "Company", "Details"] as const;

export default function DemoRequestWizardModal({
  open,
  onClose,
  sourcePage = "request-demo-wizard",
  sourcePath,
}: DemoRequestWizardModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [trackingContext, setTrackingContext] = useState<UtmContext>({});
  const [animatingStep, setAnimatingStep] = useState(false);
  const previousOpenRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && state !== "submitting") {
        onClose();
      }
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input:not([aria-hidden="true"]), select, [tabindex]:not([tabindex="-1"])'
          )
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, state]);

  useEffect(() => {
    if (open && !previousOpenRef.current) {
      previousOpenRef.current = true;
      const rafId = window.requestAnimationFrame(() => {
        setStep(1);
        setState("idle");
        setStatusMessage(null);
        setTrackingContext(getTrackingContext());
        setAnimatingStep(false);
      });
      return () => window.cancelAnimationFrame(rafId);
    }
    if (!open) {
      previousOpenRef.current = false;
    }
  }, [open]);

  const canGoNext = useMemo(() => {
    if (step === 1) return isValidWorkEmail(email);
    return true;
  }, [step, email]);

  const submitDisabled = state === "submitting" || !isValidWorkEmail(email);
  const resolvedSourcePath =
    sourcePath || (typeof window !== "undefined" ? `${window.location.pathname}${window.location.search || ""}` : undefined);

  function transitionToStep(nextStep: number) {
    setAnimatingStep(true);
    // Brief delay for fade-out before switching content
    const timeout = setTimeout(() => {
      setStep(nextStep);
      // Allow a frame for the DOM to update, then fade-in
      requestAnimationFrame(() => {
        setAnimatingStep(false);
      });
    }, 150);
    return () => clearTimeout(timeout);
  }

  async function handleSubmit() {
    if (submitDisabled) return;
    setState("submitting");
    setStatusMessage(null);
    try {
      const result = await submitDemoRequest({
        name,
        email,
        company,
        role,
        teamSize,
        timeline,
        message,
        website,
        sourcePage,
        sourcePath: resolvedSourcePath,
        utmSource: trackingContext.utmSource,
        utmMedium: trackingContext.utmMedium,
        utmCampaign: trackingContext.utmCampaign,
        utmTerm: trackingContext.utmTerm,
        utmContent: trackingContext.utmContent,
        referrer: trackingContext.referrer,
      });
      if (!result.ok) {
        setState("error");
        setStatusMessage(result.message);
        return;
      }
      setState("success");
      setStatusMessage(result.message);
    } catch {
      setState("error");
      setStatusMessage("Unable to send request right now.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      onClick={(event) => {
        if (event.currentTarget === event.target && state !== "submitting") onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-wizard-title"
        aria-describedby="demo-wizard-desc"
        className="w-full max-w-2xl rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-[var(--stroke)] dark:bg-[var(--bg)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-[var(--text-muted)]">Book a demo</div>
            <h2 id="demo-wizard-title" className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Guided booking
            </h2>
            <p id="demo-wizard-desc" className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Step-by-step intake so our team can prepare a tailored walkthrough.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            aria-label="Close demo request modal"
            disabled={state === "submitting"}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {state === "success" ? (
          <div className="mt-5 rounded-lg border border-[var(--trusted-stroke)] bg-[var(--trusted-surface)] p-6 text-center dark:border-[var(--trusted-stroke)] dark:bg-[var(--trusted-surface)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--trusted-surface)] ring-1 ring-[var(--trusted-stroke)] dark:bg-[var(--trusted-surface)]">
              <svg className="h-7 w-7 text-[var(--trusted-fill)] dark:text-[var(--trusted-text)]" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="mt-3 text-base font-semibold text-[var(--trusted-text)] dark:text-[var(--trusted-text)]">Request submitted</div>
            <p className="mt-1.5 text-sm text-[var(--trusted-text)] dark:text-[var(--trusted-text)]">
              {statusMessage || "Thanks! We'll reach out shortly to schedule your demo."}
            </p>
            <div className="mt-5">
              <button type="button" onClick={onClose} className="btn btn-cta">
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`h-2 flex-1 rounded-full transition-colors duration-300 ${item <= step ? "bg-brand-purple-600" : "bg-slate-200 dark:bg-slate-700"}`}
                  />
                ))}
              </div>

              {/* Step labels with completed badges */}
              <div className="mt-1.5 flex items-center gap-2">
                {STEP_LABELS.map((label, i) => {
                  const stepNumber = i + 1;
                  const isCompleted = stepNumber < step;
                  const isCurrent = stepNumber === step;

                  return (
                    <span
                      key={label}
                      className={`flex flex-1 items-center justify-center gap-1 text-center text-label font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                        isCurrent
                          ? "text-[var(--pivot-fill)] dark:text-[var(--pivot-text)]"
                          : isCompleted
                          ? "text-[var(--trusted-text)] dark:text-[var(--trusted-text)]"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="h-3 w-3 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Step content with fade transition */}
            <div
              className="mt-5 transition-opacity duration-150 ease-in-out"
              style={{ opacity: animatingStep ? 0 : 1 }}
            >
              {step === 1 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Name
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-purple-600/40 focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Work email<span className="text-[var(--failure-text)]" aria-hidden="true">*</span>
                    <input
                      type="email"
                      required
                      aria-required="true"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-purple-600/40 focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                      placeholder="name@company.com"
                    />
                  </label>
                  {!isValidWorkEmail(email) && email.trim() ? (
                    <p className="sm:col-span-2 text-sm text-[var(--failure-text)] dark:text-[var(--failure-text)]" role="alert">
                      Enter a valid work email.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Company
                    <input
                      type="text"
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-purple-600/40 focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                      placeholder="Company name"
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Role
                    <input
                      type="text"
                      value={role}
                      onChange={(event) => setRole(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-purple-600/40 focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                      placeholder="Title or team"
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Team size
                    <input
                      type="text"
                      value={teamSize}
                      onChange={(event) => setTeamSize(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-purple-600/40 focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                      placeholder="e.g. 10-50"
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Timeline
                    <select
                      value={timeline}
                      onChange={(event) => setTimeline(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-purple-600/40 focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                    >
                      <option value="">Select timeline</option>
                      <option value="Immediate">Immediate</option>
                      <option value="30-60 days">30-60 days</option>
                      <option value="This quarter">This quarter</option>
                      <option value="This year">This year</option>
                      <option value="Exploring">Exploring</option>
                    </select>
                  </label>
                </div>
              ) : null}

              {step === 3 ? (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Notes
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      className="mt-2 w-full resize-none rounded-lg border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand-purple-600/40 focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                      placeholder={DEFAULT_DEMO_REQUEST_MESSAGE}
                    />
                  </label>
                  <input
                    name="website"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">Summary</div>
                    <div className="mt-1">Email: {email}</div>
                    {company ? <div>Company: {company}</div> : null}
                    {timeline ? <div>Timeline: {timeline}</div> : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                {statusMessage ? (
                  <p className={`text-sm ${state === "error" ? "text-[var(--failure-text)] dark:text-[var(--failure-text)]" : "text-slate-600 dark:text-slate-300"}`}>
                    {statusMessage}
                  </p>
                ) : (
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    <p>We usually reply in 1-2 business days.</p>
                    <p className="mt-1">
                      Prefer full form?{" "}
                      <Link href="/request-demo?wizard=off" className="font-semibold text-brand-deep underline underline-offset-4">
                        Open full page
                      </Link>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => transitionToStep(Math.max(1, step - 1))}
                    className="btn btn-secondary"
                    disabled={state === "submitting"}
                  >
                    Back
                  </button>
                ) : null}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => transitionToStep(step + 1)}
                    className="btn btn-primary"
                    disabled={!canGoNext}
                  >
                    Next
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} className="btn btn-cta" disabled={submitDisabled}>
                    {state === "submitting" ? "Sending..." : "Submit request"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
