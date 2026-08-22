"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  signIn,
  signInWithProvider,
} from "@/lib/api/vendorhub";

import type { AuthProvider } from "@/lib/api/types";
import { Brand } from "./brand";

export function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [visible, setVisible] = useState(false);

  const [providerLoading, setProviderLoading] =
    useState<AuthProvider | null>(null);

  /*
   * Email/password login
   */
  const signInMutation = useMutation({
    mutationFn: signIn,

    onSuccess: (result) => {
      if (result.nextStep === "verify_2fa") {
        router.push("/verify-email?mode=2fa");
        return;
      }

      router.push("/dashboard");
    },
  });

  /*
   * OAuth login
   */
  const oauthMutation = useMutation({
    mutationFn: signInWithProvider,

    onSuccess: () => {
      router.push("/dashboard");
    },

    onSettled: () => {
      setProviderLoading(null);
    },
  });

  /*
   * Email/password submit
   */
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (signInMutation.isPending) {
      return;
    }

    signInMutation.mutate({
      email: email.trim(),
      password,
      remember,
    });
  };

  /*
   * OAuth submit
   */
  const submitProvider = (provider: AuthProvider) => {
    if (oauthMutation.isPending) {
      return;
    }

    setProviderLoading(provider);
    oauthMutation.mutate(provider);
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* LEFT SIDE */}
      <section className="flex min-h-screen flex-col px-5 py-5 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Brand />

          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-navy"
          >
            <ChevronLeft size={17} />
            Back to website
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-16">
          <p className="eyebrow text-blue">
            Buyer portal
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-navy">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted">
            Sign in to manage RFQs, compare suppliers,
            and keep your sourcing moving.
          </p>

          {/* OAuth BUTTONS */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {/* GOOGLE */}
            <button
              aria-label="Sign in with Google"
              type="button"
              disabled={oauthMutation.isPending}
              onClick={() =>
                submitProvider("google")
              }
              className="button-secondary !rounded-xl !px-3 !py-3 disabled:opacity-60"
            >
              <span className="font-bold text-[#ea4335]">
                {providerLoading === "google" ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  "G"
                )}
              </span>
            </button>

            {/* MICROSOFT */}
            <button
              aria-label="Sign in with Microsoft"
              type="button"
              disabled={oauthMutation.isPending}
              onClick={() =>
                submitProvider("microsoft")
              }
              className="button-secondary !rounded-xl !px-3 !py-3 disabled:opacity-60"
            >
              <span className="grid grid-cols-2 gap-px">
                {providerLoading === "microsoft" ? (
                  <LoaderCircle
                    size={18}
                    className="col-span-2 animate-spin"
                  />
                ) : (
                  <>
                    <i className="size-2 bg-[#f25022]" />
                    <i className="size-2 bg-[#7fba00]" />
                    <i className="size-2 bg-[#00a4ef]" />
                    <i className="size-2 bg-[#ffb900]" />
                  </>
                )}
              </span>
            </button>

            {/* LINKEDIN */}
            <button
              aria-label="Sign in with LinkedIn"
              type="button"
              disabled={oauthMutation.isPending}
              onClick={() =>
                submitProvider("linkedin")
              }
              className="button-secondary !rounded-xl !px-3 !py-3 disabled:opacity-60"
            >
              <span className="font-bold text-[#0a66c2]">
                {providerLoading === "linkedin" ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  "in"
                )}
              </span>
            </button>
          </div>

          {/* DIVIDER */}
          <div className="my-7 flex items-center gap-3">
            <i className="h-px flex-1 bg-line" />

            <span className="text-xs font-medium text-muted">
              or continue with email
            </span>

            <i className="h-px flex-1 bg-line" />
          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={submit}
            className="space-y-5"
          >
            {/* EMAIL */}
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">
                Work email
              </span>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />

                <input
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full rounded-xl border border-line px-10 py-3 text-sm outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/15"
                  placeholder="you@company.com"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            {/* PASSWORD */}
            <label className="block">
              <div className="mb-2 flex justify-between">
                <span className="text-sm font-semibold text-ink">
                  Password
                </span>

                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-blue hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />

                <input
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="w-full rounded-xl border border-line px-10 py-3 pr-11 text-sm outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/15"
                  placeholder="Enter your password"
                  type={
                    visible ? "text" : "password"
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  aria-label={
                    visible
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setVisible(
                      (state) => !state
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                >
                  {visible ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            {/* REMEMBER ME */}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                className="size-4 rounded border-line accent-navy"
                checked={remember}
                onChange={(event) =>
                  setRemember(
                    event.target.checked
                  )
                }
                type="checkbox"
              />

              Remember me for 30 days
            </label>

            {/* ERROR */}
            {signInMutation.isError && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                Unable to sign in. Please check
                your email and password and try
                again.
              </p>
            )}

            {oauthMutation.isError && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                Unable to continue with the
                selected provider. Please try
                again.
              </p>
            )}

            {/* SIGN IN BUTTON */}
            <button
              disabled={
                signInMutation.isPending ||
                oauthMutation.isPending
              }
              className="button-primary w-full disabled:opacity-60"
              type="submit"
            >
              {signInMutation.isPending ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* SIGN UP */}
          <p className="mt-7 text-center text-sm text-muted">
            New to VendorHub?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted">
          Protected by enterprise-grade encryption
          and role-based access.
        </p>
      </section>

      {/* RIGHT SIDE */}
      <aside className="relative hidden overflow-hidden bg-navy p-14 text-white lg:flex lg:flex-col">
        <div className="grid-dots absolute inset-0 opacity-20" />

        <div className="hero-orb absolute -left-24 top-20 size-80 rounded-full bg-blue/40" />

        <div className="hero-orb hero-orb-delayed absolute -right-32 bottom-0 size-96 rounded-full bg-violet-500/30" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-blue-100">
            <Sparkles size={14} />
            Intelligent sourcing
          </span>

          <h2 className="mt-7 max-w-lg text-5xl font-semibold leading-tight tracking-tight">
            Every sourcing decision, made clearer.
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            One workspace for discovering verified
            suppliers, building RFQs, and acting with
            confidence.
          </p>
        </div>

        {/* TESTIMONIAL */}
        <div className="relative mt-auto max-w-lg rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur">
          <div className="flex items-center gap-1 text-amber-300">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <span key={index}>★</span>
              )
            )}
          </div>

          <blockquote className="mt-4 text-xl leading-8 text-white">
            “VendorHub helped our procurement team
            shorten supplier discovery from weeks to
            a single afternoon.”
          </blockquote>

          <div className="mt-6 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-blue-200 to-violet-300 font-bold text-navy">
              JM
            </div>

            <div>
              <p className="text-sm font-semibold">
                Jordan Mills
              </p>

              <p className="text-xs text-slate-300">
                Senior Procurement Manager,
                Northstar Co.
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-1.5">
            {[0, 1, 2].map((item) => (
              <i
                key={item}
                className={`h-1.5 rounded-full ${
                  item === 0
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-8 flex items-center gap-2 text-xs text-blue-100">
          <ShieldCheck size={15} />

          <span>
            Verified suppliers. Secure collaboration.
            Faster sourcing.
          </span>
        </div>
      </aside>
    </main>
  );
}