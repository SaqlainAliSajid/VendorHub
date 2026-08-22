import { Suspense } from "react";
import { VerificationPage } from "@/components/verification-page";

type VerifyEmailPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function VerifyEmailRoute({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const mode = params.mode === "2fa" ? "2fa" : "email";

  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <VerificationPage mode={mode} />
    </Suspense>
  );
}
