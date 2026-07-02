"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LayoutGrid, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { logout } from "@/features/auth/actions";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: LayoutGrid },
];

export function AppSidebar() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r bg-muted/30 p-4">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Academia del CIO"
          width={36}
          height={36}
          className="size-9 rounded-lg"
        />
        <span className="text-sm font-semibold tracking-tight">
          Academia del CIO
        </span>
      </div>
      <nav className="space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <form action={logout} className="mt-auto">
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
