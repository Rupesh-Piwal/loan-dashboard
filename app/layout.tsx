import type { Metadata } from "next";
import { Euphoria_Script, Inter, DM_Sans, Fraunces, Playfair_Display, Bricolage_Grotesque, Instrument_Serif, Dancing_Script, Great_Vibes } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";



const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});


const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const bricolage_grotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
});

const euphoria = Euphoria_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-euphoria',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: '700',        // bold, dramatic script
  display: 'swap',
  variable: '--font-dancing',  // CSS variable for Tailwind/global use
})

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
});


export const metadata: Metadata = {
  title: "NomadGo",
  description: "AI-free luxury travel itineraries",
};

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/app/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        dmSans.variable,
        fraunces.variable,
        greatVibes.variable,
        bricolage_grotesque.variable,
        dancingScript.variable,
        instrument.variable,
        euphoria.variable,
        "scrollbar-hide"
      )}
    >
      <body className="min-h-full flex flex-col scrollbar-hide">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
