"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, LogOut, User, LayoutDashboard,
  Building2, ShieldCheck, Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import InitialAvatar from "@/components/InitialAvatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isHeroOverlayPage = pathname === "/" || pathname === "/ai-search";
  const shellClassName = isHeroOverlayPage
    ? "fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5"
    : "sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/92 px-3 py-3 shadow-sm backdrop-blur-xl md:px-6 md:py-4";
  const frameClassName = isHeroOverlayPage
    ? "flex h-16 items-center justify-between gap-4 rounded-2xl border border-white/20 bg-slate-950/28 px-4 shadow-[0_18px_50px_rgba(15,23,42,0.22)] backdrop-blur-xl md:px-5"
    : "flex h-16 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/90 px-4 shadow-[0_10px_30px_rgba(15,23,42,0.28)] md:px-5";
  const brandTextClassName = isHeroOverlayPage
    ? "text-base font-bold tracking-tight text-white drop-shadow-sm"
    : "text-base font-bold tracking-tight text-white";
  const navLinkClassName = (active: boolean) =>
    isHeroOverlayPage
      ? `flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors ${
          active ? "bg-white/18 text-white" : "text-white hover:bg-white/12 hover:text-red-400"
        }`
      : `flex items-center gap-1.5 rounded-full px-4 py-2 transition-colors ${
          active ? "bg-white/16 text-white" : "text-white hover:bg-white/10 hover:text-red-400"
        }`;
  const navIconClassName = isHeroOverlayPage ? "h-3.5 w-3.5 text-red-300" : "h-3.5 w-3.5 text-primary";
  const profileButtonClassName = isHeroOverlayPage
    ? "flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm backdrop-blur-md transition hover:bg-white/16"
    : "flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-white/16";
  const loginLinkClassName = isHeroOverlayPage
    ? "hidden px-3 py-2 text-sm font-medium text-white transition hover:text-red-400 sm:inline"
    : "hidden px-3 py-2 text-sm font-medium text-white transition hover:text-red-400 sm:inline";
  const signupLinkClassName = isHeroOverlayPage
    ? "rounded-full border border-white/20 bg-white/14 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
    : "rounded-full border border-white/20 bg-white/14 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20";
  const mobileToggleClassName = isHeroOverlayPage
    ? "rounded-xl p-2 text-white/85 transition-colors hover:bg-white/12 md:hidden"
    : "rounded-xl p-2 text-white/85 transition-colors hover:bg-white/12 md:hidden";
  const mobilePanelClassName = isHeroOverlayPage
    ? "mt-3 overflow-hidden rounded-2xl border border-white/20 bg-slate-950/72 shadow-[0_18px_50px_rgba(15,23,42,0.3)] backdrop-blur-xl md:hidden"
    : "mt-3 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/92 shadow-[0_18px_50px_rgba(15,23,42,0.32)] md:hidden";
  const mobileItemClassName = isHeroOverlayPage
    ? "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-red-400"
    : "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-red-400";
  const mobileLoginClassName = isHeroOverlayPage
    ? "flex-1 rounded-xl border border-white/15 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-red-400"
    : "flex-1 rounded-xl border border-white/15 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-red-400";
  const mobileSignupClassName = isHeroOverlayPage
    ? "flex-1 rounded-xl bg-white/14 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/20"
    : "flex-1 rounded-xl bg-white/14 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/20";

  function handleLogout() {
    logout();
    setProfileOpen(false);
    router.push("/");
  }

  function getDashboardLink() {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "host") return "/host/dashboard";
    return "/dashboard";
  }

  const navLinks = [
    { href: "/properties", label: "Explore" },
    { href: "/ai-search", label: "AI Search" },
    { href: "/contact", label: "Contact" },
    { href: "/#become-a-host", label: "Become a Host" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className={shellClassName}>
      <div className="container">
        <div className={frameClassName}>
          <Link href="/" className="flex flex-shrink-0 items-center gap-2.5">
            <Image
              src="/tripfinder-logo.svg"
              alt="TripFinder"
              width={36}
              height={36}
              priority
              className="h-9 w-9"
            />
            <span className={brandTextClassName}>
              TripFinder
            </span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={navLinkClassName(isActive(href))}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={profileButtonClassName}
                >
                  <InitialAvatar name={user.name} className="h-7 w-7" textClassName="text-xs" />
                  <span className="hidden max-w-[110px] truncate sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isHeroOverlayPage ? "text-white/65" : "text-white/65"} ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg shadow-gray-200/60">
                      <div className="mb-1 border-b border-gray-100 px-4 py-2.5">
                        <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">{user.email}</p>
                        <span className="mt-1.5 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                          {user.role}
                        </span>
                      </div>

                      {[
                        { href: getDashboardLink(), icon: LayoutDashboard, label: "Dashboard" },
                        ...(user.role === "host" ? [{ href: "/host/properties/new", icon: Building2, label: "Add Property" }] : []),
                        ...(user.role === "admin" ? [{ href: "/admin", icon: ShieldCheck, label: "Admin Panel" }] : []),
                        { href: "/dashboard?tab=profile", icon: User, label: "Profile Settings" },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link
                          key={`${label}-${href}`}
                          href={href}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Icon className="h-4 w-4 text-gray-400" />
                          {label}
                        </Link>
                      ))}

                      <div className="mt-1 border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className={loginLinkClassName}>
                  Log in
                </Link>
                <Link href="/signup" className={signupLinkClassName}>
                  Sign up
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={mobileToggleClassName}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={mobilePanelClassName}>
            <nav className="space-y-1 px-4 py-3">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={mobileItemClassName}
                >
                  {label}
                </Link>
              ))}
            </nav>
            {!user && (
              <div className={`flex gap-2 px-4 pb-4 pt-3 ${isHeroOverlayPage ? "border-t border-white/10" : "border-t border-gray-100"}`}>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className={mobileLoginClassName}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className={mobileSignupClassName}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
