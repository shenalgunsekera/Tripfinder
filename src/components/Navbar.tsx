"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between">
        
        {/* LEFT - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground">
              📍
            </span>
          </div>
          <span className="text-lg font-semibold text-primary">
            TripFinder
          </span>
        </Link>

        {/* CENTER - Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/explore" className="hover:text-primary transition">
            Explore
          </Link>
          <Link href="/instant-book" className="hover:text-primary transition">
            Instant Book
          </Link>
          <Link href="/host" className="hover:text-primary transition">
            Become a Host
          </Link>
        </nav>

        {/* RIGHT - Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-primary transition"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
