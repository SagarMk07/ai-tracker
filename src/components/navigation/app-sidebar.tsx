"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BrainCircuit, Crosshair, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/focus", label: "Focus Mode", icon: Crosshair },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="surface-card hidden h-fit w-64 shrink-0 p-4 lg:block">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
          <BrainCircuit size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Focus Guardian</p>
          <p className="text-sm text-[var(--text-secondary)]">AI Accountability</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]",
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
