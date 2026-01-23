import Layout from "../../../components/Layout";
import { fetchPodcastBySlug } from "../../../lib/cms";
import Link from "next/link";

export async function getServerSideProps({ params }: any) {
  const episode = await fetchPodcastBySlug(params.slug);

  if (!episode) {
    return { notFound: true };
  }

  return { props: { episode } };
}

export default function PodcastDetail({ episode }: any) {
  return (
    <Layout>
      <h1 className="text-3xl font-semibold">{episode.title}</h1>

      <div className="mt-2 text-sm text-slate-500">
        Published on {episode.publishedDate}
      </div>

      {episode.tags?.length > 0 && (
        <div className="mt-4 flex gap-2">
          {episode.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/resources/podcasts/tag/${tag}`}
              className="text-xs px-2 py-1 bg-slate-100 rounded"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {episode.transcript && (
        <div className="mt-6 prose max-w-none">
          <h3>Transcript</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(episode.transcript, null, 2)}
          </pre>
        </div>
      )}
    </Layout>
  );
}
