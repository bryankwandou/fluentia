import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleDetail } from "@/views/module-detail";
import { MODULE_DETAIL } from "@/copy/catalogue";
import { ALL_MODULES, getModule, slugifyModule } from "@/lib/modules";

type Params = { params: Promise<{ code: string }> };

export function generateStaticParams() {
  return ALL_MODULES.map((rung) => ({ code: slugifyModule(rung.code) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { code } = await params;
  const found = getModule(code);
  if (!found) return { title: MODULE_DETAIL.id.notFound };
  return {
    title: `${found.code}: ${found.title}`,
    description: found.summary,
    alternates: {
      languages: { en: `/modules/${code}`, id: `/id/modules/${code}` },
    },
  };
}

export default async function Page({ params }: Params) {
  const { code } = await params;
  const found = getModule(code);
  if (!found) notFound();
  return <ModuleDetail locale="id" module={found} />;
}
