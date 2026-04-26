"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Heart,
  CreditCard,
  Wallet,
  Plus,
  Compass,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "Trip History", icon: History },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/credits", label: "Credits", icon: CreditCard },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border/50 bg-background/50 backdrop-blur-xl flex flex-col z-40">
      <nav className="flex-1 px-4 py-26 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <link.icon className={cn("w-4 h-4", isActive ? "text-primary" : "")} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Link href="/dashboard/itinerary/new">
          <Button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-6 flex items-center justify-start gap-3 shadow-lg shadow-orange-950/20"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Plan New Trip</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
