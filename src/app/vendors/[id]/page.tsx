import { VendorProfilePage } from "@/components/vendor-profile-page";

type VendorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VendorPage({ params }: VendorPageProps) {
  const { id } = await params;
  return <VendorProfilePage id={id} />;
}
