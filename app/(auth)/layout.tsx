import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — hero image with overlay */}
      <div className="relative hidden w-[55%] lg:block">
        <Image
          src="/auth-hero.png"
          alt="Beautiful travel destination"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-black/20" />

        {/* Branding overlay */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5Z" fill="white" opacity="0.9" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              NomadGo
            </span>
          </div>

          {/* Testimonial / tagline */}
          <div className="max-w-md space-y-6">
            <blockquote className="space-y-4">
              <p className="text-2xl leading-relaxed font-medium text-white/95">
                &ldquo;NomadGo planned our entire 10-day trip to Japan in
                minutes. Every restaurant, every hidden temple — it was like
                travelling with a local.&rdquo;
              </p>
              <footer className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white backdrop-blur-sm">
                  MM
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">Mayur M.</p>
                  <p className="text-sm text-white/60">Explored 12 countries</p>
                </div>
              </footer>
            </blockquote>

            {/* Mini stats */}
            <div className="flex gap-8 border-t border-white/15 pt-6">
              <div>
                <p className="text-2xl font-bold text-white">50k+</p>
                <p className="text-xs text-white/60 uppercase tracking-wider">Trips planned</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">120+</p>
                <p className="text-xs text-white/60 uppercase tracking-wider">Countries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">4.9</p>
                <p className="text-xs text-white/60 uppercase tracking-wider">User rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-105">{children}</div>
      </div>
    </div>
  );
}
