import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Track } from "@/views/track";
import { TRACK } from "@/copy/catalogue";
import { TRACKS, getTrack } from "@/lib/curriculum";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TRACKS.map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) return { title: TRACK.id.notFound };
  return {
    title: track.language,
    description: TRACK.id.meta(track.language, track.levels.at(-1)?.code ?? ""),
    alternates: {
      languages: {
        en: `/catalogue/${slug}`,
        id: `/id/catalogue/${slug}`,
      },
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();
  return <Track locale="id" track={track} />;
}
