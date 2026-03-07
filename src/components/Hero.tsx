"use client";

import Image from "next/image";
import { Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24">
      <Image
        src="/images/hero-banner.jpg"
        alt="TripFinder hero banner"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="container relative z-10 text-center">
        <div className="mb-6 flex justify-center">
          
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
          Discover Your Perfect Stay <br />
          in <span className="text-red-300">Sri Lanka</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-gray-100 md:text-lg">
          Find unique accommodations with our AI-powered recommendations.
          From beach villas to mountain retreats, booking made simple.
        </p>

        <div className="mx-auto mt-10 flex max-w-3xl items-center rounded-xl bg-white p-2 shadow-lg">
          <div className="flex flex-1 items-center gap-3 px-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city, property type, or features..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            Search
          </button>
        </div>

        <div className="mt-6">
          <button className="rounded-lg border border-white/70 bg-white/90 px-6 py-2 text-sm font-medium text-gray-900 transition hover:bg-white">
            Try AI-Powered Search
          </button>
        </div>
      </div>
    </section>
  );
}
