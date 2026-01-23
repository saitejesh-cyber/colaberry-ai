import Layout from "../../../../components/Layout";
import { fetchPodcastEpisodes } from "../../../../lib/cms";
import Link from "next/link";

export async function getServerSideProps({ params }: any) {
  const episodes = await fetchPodcastEpisodes();
  const filtered = episodes.filter((e) =>
    e.tags?.includes(params.tag)
  );

  return {
    props: {
      tag: params.tag,
      episodes: filtered,
    },
  };
}

export default function PodcastTagPage({ tag, episodes }: any) {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">#{tag} Podcasts</h1>

      <ul className="mt-6 grid gap-4">
        {episodes.map((e: any) => (
          <li key={e.id} className="border p-4 rounded">
            <div className="font-semibold">{e.title}</div>
            <Link
              href={`/resources/podcasts/${e.slug}`}
              className="text-sm text-brand-blue"
            >
              View →
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
