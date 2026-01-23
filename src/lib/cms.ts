const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL!;

export type PodcastEpisode = {
  id: number;
  title: string;
  slug: string;
  publishedDate: string;
  tags?: string[];
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

  return (
    json?.data?.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      publishedDate: item.publishedDate,
      tags: item.tags || [],
    })) || []
  );
}
