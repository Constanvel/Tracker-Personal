import { notFound } from "next/navigation";
import { SettingsPage } from "@/components/pages/settings-page";
export function generateStaticParams() {
  return ["categories", "privacy"].map((section) => ({ section }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!["categories", "privacy"].includes(section)) notFound();
  return <SettingsPage section={section} />;
}
