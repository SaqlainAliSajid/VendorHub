"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { verifyEmailCode, verifyTwoFactorCode } from "@/lib/api/vendorhub";
import { Button } from "./ui/button";
import { Card, CardBody } from "./ui/card";

type VerificationMode = "email" | "2fa";

export function VerificationPage({ mode }: { mode: VerificationMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "you@company.com";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const code = useMemo(() => digits.join(""), [digits]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "email") {
        return verifyEmailCode({ email, code });
      }
      return verifyTwoFactorCode({ email, code });
    },
    onSuccess: () => router.push("/dashboard"),
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const updateDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 1);
    setDigits((current) => {
      const next = [...current];
      next[index] = clean;
      return next;
    });
    if (clean && index < 5) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (code.length !== 6) return;
    mutation.mutate();
  };

  return (
    <main className="min-h-screen bg-canvas">
      <div className="page-shell py-16">
        <Card className="mx-auto max-w-xl">
          <CardBody className="p-6 sm:p-8">
            <p className="eyebrow text-blue">Security check</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy">
              {mode === "email" ? "Verify your email" : "Two-factor verification"}
            </h1>
            <p className="mt-3 text-sm text-muted">Enter the 6-digit code sent to {email}.</p>

            <form onSubmit={submit} className="mt-6 space-y-5">
              <div className="flex items-center justify-between gap-2">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      refs.current[index] = node;
                    }}
                    value={digit}
                    onChange={(event) => updateDigit(index, event.target.value)}
                    onKeyDown={(event) => onKeyDown(index, event)}
                    className="size-11 rounded-xl border border-line text-center text-lg font-semibold text-navy outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/20 sm:size-12"
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Code digit ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setSecondsLeft(45)}
                  disabled={secondsLeft > 0}
                  className="font-semibold text-blue disabled:text-muted"
                >
                  Resend code
                </button>
                <span className="text-muted">{secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "You can resend now"}</span>
              </div>

              {mutation.isError && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Invalid code. Please try again.</p>
              )}

              <Button type="submit" className="w-full" loading={mutation.isPending}>
                Verify code
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
