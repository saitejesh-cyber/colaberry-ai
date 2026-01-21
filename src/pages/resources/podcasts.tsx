import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import BuzzsproutPlayer from "../../components/BuzzsproutPlayer";
import Link from "next/link";
import { fetchPodcastEpisodes, PodcastEpisode } from "../../lib/cms";

export default function Podcasts() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPodcastEpisodes()
      .then(setEpisodes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Resources
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Podcasts
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Space for internal podcast posts and curated external aggregation.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-2">
        {/* INTERNAL POSTING */}
        <Panel
          title="Internal posting"
          description="Publish episodes, transcripts, show notes, and takeaways."
        >
          {loading && (
            <div className="mt-3 text-sm text-slate-500">
              Loading podcasts…
            </div>
          )}

          {!loading && episodes.length === 0 && (
            <div className="mt-3 text-sm text-slate-500">
              No podcasts published yet.
            </div>
          )}

          <ul className="mt-4 grid gap-3">
            {episodes.map((episode) => (
              <li
                key={episode.id}
                className="rounded-lg border border-slate-200 p-4 hover:shadow-sm transition"
              >
                <div className="text-sm font-semibold text-slate-900">
                  {episode.title}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Published on{" "}
                  {new Date(episode.publishedDate)
                    .toISOString()
                    .split("T")[0]}
                </div>

                {/* Future-ready deep link */}
                <Link
                  href={`/resources/podcasts/${episode.slug}`}
                  className="mt-2 inline-block text-xs font-semibold text-brand-blue hover:underline"
                >
                  View episode →
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        {/* EXTERNAL AGGREGATION */}
        <Panel
          title="External aggregation"
          description="Curated external podcasts powered by Buzzsprout."
        >
          <BuzzsproutPlayer />
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
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 bg-gradient-to-r from-brand-blue to-brand-aqua px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
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
