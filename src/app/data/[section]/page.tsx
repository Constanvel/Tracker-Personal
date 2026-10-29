import { notFound } from "next/navigation";
import { DataPage } from "@/components/pages/data-pages";
export function generateStaticParams() {
  return ["import", "export", "connections", "jobs"].map((section) => ({
    section,
  }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!["import", "export", "connections", "jobs"].includes(section))
    notFound();
  return <DataPage section={section} />;
}
