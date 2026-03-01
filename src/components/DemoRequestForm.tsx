import { FormEvent, useMemo, useState } from "react";
import { DEFAULT_DEMO_REQUEST_MESSAGE, isValidWorkEmail, submitDemoRequest } from "../lib/demoRequest";
import { getTrackingContext } from "../lib/tracking";

type DemoRequestFormProps = {
  sourcePage?: string;
  sourcePath?: string;
  onSuccess?: () => void;
};

type SubmissionState = "idle" | "submitting" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
};

const TEAM_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
];

const TIMELINE_OPTIONS = [
  "Immediate (0-30 days)",
  "Near term (30-60 days)",
  "This quarter",
  "This year",
  "Exploring",
];

export default function DemoRequestForm({
  sourcePage = "request-demo",
  sourcePath,
  onSuccess,
}: DemoRequestFormProps) {
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const trackingContext = useMemo(() => getTrackingContext(), []);

  const resolvedSourcePath = useMemo(() => {
    if (sourcePath) return sourcePath;
    if (typeof window === "undefined") return undefined;
    return `${window.location.pathname}${window.location.search || ""}`;
  }, [sourcePath]);

  function validateEmail(value: string): string | undefined {
    if (!value.trim()) return "Work email is required.";
    if (!isValidWorkEmail(value)) return "Please enter a valid work email address.";
    return undefined;
  }

  function validateName(value: string): string | undefined {
    if (!value.trim()) return "Name is required.";
    return undefined;
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    }
    if (field === "name") {
      setFieldErrors((prev) => ({ ...prev, name: validateName(name) }));
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    setFieldErrors({ name: nameError, email: emailError });
    setTouched({ name: true, email: true });

    if (nameError || emailError) return;

    setState("submitting");
    setStatusMessage(null);

    try {
      const payload = await submitDemoRequest({
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

      if (!payload.ok) {
        setState("error");
        setStatusMessage(payload.message);
        return;
      }

      setState("success");
      setStatusMessage(payload.message);
      setName("");
      setEmail("");
      setCompany("");
      setRole("");
      setTeamSize("");
      setTimeline("");
      setMessage("");
      setWebsite("");
      setFieldErrors({});
      setTouched({});
      onSuccess?.();
    } catch {
      setState("error");
      setStatusMessage("Unable to send request right now.");
    }
  }

  const statusClass =
    state === "success"
      ? "text-[var(--trusted-text)] dark:text-[var(--trusted-text)]"
      : state === "error"
      ? "text-[var(--failure-text)] dark:text-[var(--failure-text)]"
      : "text-slate-500 dark:text-slate-400";

  const inputBaseClass = "input-premium mt-2";
  const inputLabelClass =
    "text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400";
  const inputErrorClass =
    "input-premium mt-2 !border-[var(--failure-stroke)] focus:!border-[var(--failure-text)] focus:!shadow-[0_0_0_3px_var(--failure-stroke)/30]";

  return (
    <form
      id="demo-request-form"
      onSubmit={onSubmit}
      className="surface-panel mt-8 space-y-6 p-6"
      noValidate
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Request a tailored walkthrough
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Share your goals and stack. We will align the session to your team&apos;s priorities.
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
          Required: name + work email
        </span>
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">Contact details</legend>
        <div>
          <label htmlFor="demo-name" className={inputLabelClass}>
            Name <span className="text-[var(--failure-text)]" aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </label>
          <input
            id="demo-name"
            type="text"
            name="name"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={touched.name && !!fieldErrors.name}
            aria-describedby={touched.name && fieldErrors.name ? "demo-name-error" : undefined}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (touched.name) {
                setFieldErrors((prev) => ({ ...prev, name: validateName(event.target.value) }));
              }
            }}
            onBlur={() => handleBlur("name")}
            className={touched.name && fieldErrors.name ? inputErrorClass : inputBaseClass}
            placeholder="Your full name"
          />
          {touched.name && fieldErrors.name ? (
            <p id="demo-name-error" className="mt-1 text-xs text-[var(--failure-text)] dark:text-[var(--failure-text)]" role="alert">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="demo-email" className={inputLabelClass}>
            Work email <span className="text-[var(--failure-text)]" aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </label>
          <input
            id="demo-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={touched.email && !!fieldErrors.email}
            aria-describedby={touched.email && fieldErrors.email ? "demo-email-error" : undefined}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (touched.email) {
                setFieldErrors((prev) => ({ ...prev, email: validateEmail(event.target.value) }));
              }
            }}
            onBlur={() => handleBlur("email")}
            className={touched.email && fieldErrors.email ? inputErrorClass : inputBaseClass}
            placeholder="name@company.com"
          />
          {touched.email && fieldErrors.email ? (
            <p id="demo-email-error" className="mt-1 text-xs text-[var(--failure-text)] dark:text-[var(--failure-text)]" role="alert">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">Company context</legend>
        <label className={inputLabelClass}>
          Company
          <input
            type="text"
            name="company"
            autoComplete="organization"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={inputBaseClass}
            placeholder="Organization"
          />
        </label>
        <label className={inputLabelClass}>
          Role
          <input
            type="text"
            name="role"
            autoComplete="organization-title"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className={inputBaseClass}
            placeholder="Head of Product, CTO, VP Engineering..."
          />
        </label>
        <label className={inputLabelClass}>
          Team size
          <select
            name="teamSize"
            value={teamSize}
            onChange={(event) => setTeamSize(event.target.value)}
            className={inputBaseClass}
          >
            <option value="">Select team size</option>
            {TEAM_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className={inputLabelClass}>
          Timeline
          <select
            name="timeline"
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
            className={inputBaseClass}
          >
            <option value="">Select timeline</option>
            {TIMELINE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <label className={`block ${inputLabelClass}`}>
        Goals and notes
        <textarea
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          className="input-premium mt-2 resize-none"
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

      <div className="flex flex-col items-start gap-3 border-t border-slate-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700/70">
        <button type="submit" className="btn btn-cta" disabled={state === "submitting"}>
          {state === "submitting" ? "Sending request..." : "Submit demo request"}
        </button>
        <p className="max-w-sm text-xs text-slate-500 dark:text-slate-400">
          We reply within 1-2 business days. Your information is used only for demo scheduling.
        </p>
      </div>

      {statusMessage ? (
        <p className={`text-sm ${statusClass}`} role={state === "error" ? "alert" : "status"} aria-live="polite">
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
