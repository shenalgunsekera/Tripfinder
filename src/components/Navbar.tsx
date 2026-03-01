"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full bg-white">
      <div className="container flex h-20 items-center justify-between gap-4">
        {/* LEFT - Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/tripfinder-logo.svg"
            alt="TripFinder"
            width={500}
            height={500}
            priority
            className="h-14 w-14 sm:h-16 sm:w-16"
          />
        </Link>

        {/* CENTER - Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/#explore" className="hover:text-primary transition">
            Explore
          </Link>
          <Link href="/#become-a-host" className="hover:text-primary transition">
            Become a Host
          </Link>
        </nav>

        {/* RIGHT - Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-gray-700 transition hover:text-primary sm:inline"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:px-4"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
