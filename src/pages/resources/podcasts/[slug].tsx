// src/pages/resources/podcasts/[slug].tsx
import Layout from "../../../components/Layout";
import Link from "next/link";

export async function getServerSideProps({ params }: any) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/podcast-episodes?filters[slug][$eq]=${params.slug}`
  );

  const json = await res.json();
  const episode = json?.data?.[0];

  if (!episode) return { notFound: true };

  return { props: { episode } };
}

export default function PodcastDetail({ episode }: any) {
  return (
    <Layout>
      <h1 className="text-3xl font-semibold">{episode.title}</h1>
      <p className="text-sm text-slate-500">{episode.publishedDate}</p>

      {/* TAGS */}
      <div className="mt-4 flex gap-2">
        {episode.tags?.map((tag: string) => (
          <Link
            key={tag}
            href={`/resources/podcasts/tag/${tag}`}
            className="text-xs bg-slate-100 px-2 py-1 rounded"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* TRANSCRIPT */}
      {episode.transcript && (
        <article className="prose mt-6 max-w-none">
          <h3>Transcript</h3>
          <div>{episode.transcript}</div>
        </article>
      )}

      {/* EXTERNAL LINKS */}
      {episode.external_links && (
        <div className="mt-6 space-x-4">
          {Object.entries(episode.external_links).map(
            ([key, url]: any) =>
              url && (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  className="text-sm text-brand-blue"
                >
                  {key}
                </a>
              )
          )}
        </div>
      )}
    </Layout>
  );
}
