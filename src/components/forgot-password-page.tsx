"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestPasswordReset } from "@/lib/api/vendorhub";
import { Brand } from "./brand";
import { Button } from "./ui/button";
import { Card, CardBody } from "./ui/card";
import { TextInput } from "./ui/input";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const resetMutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => setSubmitted(true),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    resetMutation.mutate(email);
  };

  return (
    <main className="min-h-screen bg-canvas">
      <div className="page-shell py-8">
        <div className="flex items-center justify-between">
          <Brand />
          <Link href="/login" className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-navy">
            <ChevronLeft size={16} /> Back to sign in
          </Link>
        </div>

        <Card className="mx-auto mt-12 max-w-lg">
          <CardBody className="p-6 sm:p-8">
            <p className="eyebrow text-blue">Account recovery</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy">Forgot password</h1>

            {!submitted ? (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <TextInput
                  label="Work email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  hint="We will send password reset instructions to this email."
                  required
                />
                {resetMutation.isError && (
                  <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to submit request.</p>
                )}
                <Button type="submit" className="w-full" loading={resetMutation.isPending}>
                  Send reset link <ArrowRight size={16} />
                </Button>
              </form>
            ) : (
              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
                A password reset link has been sent to {email}. Check your inbox and follow the instructions.
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
