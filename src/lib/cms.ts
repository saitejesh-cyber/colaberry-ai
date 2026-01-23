const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL!;

export type PodcastEpisode = {
  id: number;
  title: string;
  slug: string;
  publishedDate: string;
  transcript?: any;
  tags: string[];
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
      transcript: item.transcript,
      tags: item.tags || [],
    })) || []
  );
}

export async function fetchPodcastBySlug(slug: string) {
  const res = await fetch(
    `${CMS_URL}/api/podcast-episodes?filters[slug][$eq]=${slug}`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json?.data?.[0] || null;
}
