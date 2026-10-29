import { ItemPage } from "@/components/pages/item-page";
export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ItemPage id={id} edit />;
}
