// src/lib/cms.ts
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL!;

export type PodcastEpisode = {
  id: number;
  title: string;
  slug: string;
  publishedDate: string;
};

export async function fetchPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const res = await fetch(
    `${CMS_URL}/api/podcast-episodes?sort=publishedDate:desc`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch podcast episodes");
  }

  const json = await res.json();

  return (json.data ?? []).map((item: any) => {
    // Support both Strapi shapes safely
    const source = item.attributes ?? item;

    return {
      id: item.id,
      title: source.title,
      slug: source.slug,
      publishedDate: source.publishedDate,
    };
  });
}
