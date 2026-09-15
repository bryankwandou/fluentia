import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Rung } from "@/views/rung";
import { RUNG } from "@/copy/rung";
import { TRACKS, getTrack } from "@/lib/curriculum";
import { slugifyModule } from "@/lib/modules";
import { writtenModule } from "@/lib/routes";

type Params = { params: Promise<{ slug: string; level: string }> };

// Only the rungs with nothing written get a page here; a written rung lives
// at /modules/<code>.
export function generateStaticParams() {
  return TRACKS.flatMap((track) =>
    track.levels
      .filter((level) => !writtenModule(track, level))
      .map((level) => ({ slug: track.slug, level: slugifyModule(level.code) }))
  );
}

export const dynamicParams = false;

function find(slug: string, code: string) {
  const track = getTrack(slug);
  const level = track?.levels.find((entry) => slugifyModule(entry.code) === code);
  return track && level ? { track, level } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, level } = await params;
  const found = find(slug, level);
  if (!found) return { title: RUNG.id.notFound };
  return {
    title: `${found.track.language} ${found.level.code}`,
    alternates: {
      languages: {
        en: `/catalogue/${slug}/${level}`,
        id: `/id/catalogue/${slug}/${level}`,
      },
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug, level } = await params;
  const found = find(slug, level);
  if (!found) notFound();
  return <Rung locale="id" track={found.track} level={found.level} />;
}
