import { CollectionsPage } from "@/components/pages/organize-pages";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CollectionsPage id={id} />;
}
