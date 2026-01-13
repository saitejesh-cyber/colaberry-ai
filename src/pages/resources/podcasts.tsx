import Layout from "../../components/Layout";
import Link from "next/link";

export default function Podcasts() {
  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Resources
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Podcasts</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Space for internal podcast posts and curated external aggregation.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-2">
        <Panel title="Internal posting" description="Publish episodes, transcripts, show notes, and takeaways.">
          <ul className="mt-3 grid gap-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-aqua" />
              Episode page with summary + key moments
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-aqua" />
              Transcript + highlights + linked artifacts
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-aqua" />
              Industry tags and solution tags
            </li>
          </ul>
        </Panel>

        <Panel title="External aggregation" description="Curate trusted sources and surface them consistently.">
          <ul className="mt-3 grid gap-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-aqua" />
              RSS / platform links (Apple, Spotify, YouTube)
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-aqua" />
              Editorial picks and featured playlists
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-aqua" />
              Consolidated feed for demo-ready browsing
            </li>
          </ul>
        </Panel>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/resources"
          className="inline-flex items-center justify-center rounded-lg border border-brand-blue/25 bg-white px-4 py-2.5 text-sm font-semibold text-brand-ink hover:bg-slate-50"
        >
          Back to Resources
        </Link>
        <Link
          href="/updates"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 bg-gradient-to-r from-brand-blue to-brand-aqua px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover:from-brand-deep hover:to-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
        >
          View News & Product
        </Link>
      </div>
    </Layout>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{description}</div>
      {children}
    </div>
  );
}
