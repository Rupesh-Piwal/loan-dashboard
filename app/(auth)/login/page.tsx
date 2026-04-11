import type { Metadata } from "next";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in — NomadGo",
  description:
    "Sign in to NomadGo and start planning your next adventure with AI-powered itineraries.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Mobile-only logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5Z" fill="white" opacity="0.9" />
            <path
              d="M2 17l10 5 10-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
            <path
              d="M2 12l10 5 10-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          </svg>
        </div>
        <span className="text-xl font-semibold tracking-tight">NomadGo</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue planning your next adventure.
        </p>
      </div>

      {/* Google Sign In */}
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          id="google-sign-in-btn"
          className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 text-sm font-medium text-card-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          {/* Google Icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-border" />
        <span className="mx-4 text-xs uppercase tracking-wider text-muted-foreground">
          or
        </span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* Email sign-in form (visual only — placeholder for future expansion) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled
            className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none text-foreground"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled
            className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <button
          disabled
          className="flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground opacity-50 cursor-not-allowed transition-all"
        >
          Sign in with Email
          <span className="ml-2 rounded-md bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            Soon
          </span>
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
