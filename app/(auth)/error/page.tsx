import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error — NomadGo",
  description: "There was a problem signing in to your NomadGo account.",
};

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Server configuration error",
    description:
      "There is a problem with the server configuration. Please contact support if this error persists.",
  },
  AccessDenied: {
    title: "Access denied",
    description:
      "You do not have permission to sign in. Please contact support if you believe this is a mistake.",
  },
  Verification: {
    title: "Verification failed",
    description:
      "The verification token has expired or has already been used. Please try signing in again.",
  },
  Default: {
    title: "Something went wrong",
    description:
      "An unexpected error occurred during authentication. Please try again.",
  },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: errorCode } = await searchParams;
  const errorInfo =
    ERROR_MESSAGES[errorCode ?? "Default"] ?? ERROR_MESSAGES.Default;

  return (
    <div className="flex flex-col gap-8">
      {/* Mobile logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5Z" fill="white" opacity="0.9" />
            <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
          </svg>
        </div>
        <span className="text-xl font-semibold tracking-tight">NomadGo</span>
      </div>

      {/* Error icon */}
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-destructive"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      </div>

      {/* Error messaging */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{errorInfo.title}</h1>
        <p className="text-muted-foreground">{errorInfo.description}</p>
        {errorCode && errorCode !== "Default" && (
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
            Error code: {errorCode}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <a
          href="/login"
          id="try-again-btn"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Try again
        </a>
        <a
          href="/"
          id="go-home-btn"
          className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card text-sm font-medium text-card-foreground shadow-sm transition-all duration-200 hover:bg-accent active:scale-[0.98]"
        >
          Go to homepage
        </a>
      </div>
    </div>
  );
}
