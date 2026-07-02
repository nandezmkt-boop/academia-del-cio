import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión — Academia del CIO",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-card p-8 ring-1 ring-foreground/10">
        <div className="flex flex-col items-center gap-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Academia del CIO"
            width={48}
            height={48}
            className="size-12 rounded-lg"
          />
          <h1 className="text-lg font-semibold tracking-tight">
            Academia del CIO
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
