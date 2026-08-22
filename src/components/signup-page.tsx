"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowRight, CheckSquare, ChevronLeft, Square } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { signInWithProvider, signUp } from "@/lib/api/vendorhub";
import type { AuthProvider } from "@/lib/api/types";
import { Brand } from "./brand";
import { Button } from "./ui/button";
import { TextInput } from "./ui/input";

const providers: { provider: AuthProvider; label: string; mark: string }[] = [
  { provider: "google", label: "Google", mark: "G" },
  { provider: "microsoft", label: "Microsoft", mark: "MS" },
  { provider: "linkedin", label: "LinkedIn", mark: "in" },
];

export function SignupPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [providerLoading, setProviderLoading] = useState<AuthProvider | null>(null);

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => router.push(`/verify-email?email=${encodeURIComponent(email)}`),
  });

  const oauthMutation = useMutation({
    mutationFn: signInWithProvider,
    onSuccess: () => router.push("/dashboard"),
    onSettled: () => setProviderLoading(null),
  });

  const passwordError = useMemo(() => {
    if (!confirmPassword) return undefined;
    return password !== confirmPassword ? "Passwords do not match" : undefined;
  }, [password, confirmPassword]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) return;
    signUpMutation.mutate({ companyName, email, password, confirmPassword, acceptedTerms });
  };

  const submitProvider = (provider: AuthProvider) => {
    setProviderLoading(provider);
    oauthMutation.mutate(provider);
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="flex min-h-screen flex-col px-5 py-5 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Brand />
          <Link href="/login" className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-navy">
            <ChevronLeft size={17} /> Back to sign in
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <p className="eyebrow text-blue">Buyer portal</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy">Create your account</h1>
          <p className="mt-3 text-sm leading-6 text-muted">Start sourcing with verified suppliers and AI recommendations.</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {providers.map((item) => (
              <Button
                key={item.provider}
                type="button"
                variant="secondary"
                size="md"
                className="!rounded-xl"
                loading={providerLoading === item.provider}
                onClick={() => submitProvider(item.provider)}
              >
                {item.mark}
              </Button>
            ))}
          </div>

          <div className="my-7 flex items-center gap-3">
            <i className="h-px flex-1 bg-line" />
            <span className="text-xs font-medium text-muted">or continue with email</span>
            <i className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <TextInput label="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            <TextInput label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <TextInput
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordError}
              required
            />

            <button
              type="button"
              onClick={() => setAcceptedTerms((state) => !state)}
              className="flex items-center gap-2 text-sm text-muted"
            >
              {acceptedTerms ? <CheckSquare size={18} className="text-blue" /> : <Square size={18} />}
              I accept the terms and privacy policy
            </button>

            {signUpMutation.isError && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Unable to create your account right now.</p>
            )}

            <Button type="submit" className="w-full" loading={signUpMutation.isPending}>
              Sign up <ArrowRight size={17} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account? <Link href="/login" className="font-semibold text-blue hover:underline">Sign in</Link>
          </p>
        </div>
      </section>

      <aside className="hidden bg-gradient-to-br from-navy via-slate-900 to-blue p-14 text-white lg:flex lg:items-end">
        <div>
          <p className="eyebrow text-blue-100">VendorHub AI</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight">Enterprise sourcing, simplified.</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">Create your buyer workspace and move from search to RFQ in minutes.</p>
        </div>
      </aside>
    </main>
  );
}
