"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, Calendar,
  ShieldCheck, BarChart3, Settings, LogOut, TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import InitialAvatar from "@/components/InitialAvatar";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", Icon: Users },
  { href: "/admin/properties", label: "Properties", Icon: Building2 },
  { href: "/admin/bookings", label: "Bookings", Icon: Calendar },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && user.role !== "admin") router.push("/");
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") return null;

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <div className="flex min-h-[calc(100vh-81px)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-gray-900 text-white">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Admin Panel</p>
            <p className="text-xs text-gray-400">TripFinder</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(item.href, item.exact)
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.Icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-700 p-4 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <InitialAvatar name={user.name} className="h-8 w-8" textClassName="text-sm" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-red-900/40 hover:text-red-300 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              isActive(item.href, item.exact) ? "text-primary" : "text-gray-400 hover:text-white"
            }`}
          >
            <item.Icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-16 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
