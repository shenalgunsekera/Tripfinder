"use client";

import { Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-primary-light py-24">
      <div className="container text-center">

        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span className="rounded-full bg-white px-4 py-1 text-xs font-medium text-secondary-foreground shadow-sm">
            AI-Powered Search
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
          Discover Your Perfect Stay <br />
          in <span className="text-primary">Sri Lanka</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-gray-600 md:text-lg">
          Find unique accommodations with our AI-powered recommendations.
          From beach villas to mountain retreats, instant booking or
          reservation — we’ve got you covered.
        </p>

        {/* Search Box */}
        <div className="mx-auto mt-10 flex max-w-3xl items-center rounded-xl bg-white p-2 shadow-lg">
          
          <div className="flex flex-1 items-center gap-3 px-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city, property type, or features..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
            Search
          </button>
        </div>

        {/* Secondary CTA */}
        <div className="mt-6">
          <button className="rounded-lg border border-primary bg-white px-6 py-2 text-sm font-medium text-primary hover:bg-primary-light transition">
            ✨ Try AI-Powered Search
          </button>
        </div>

      </div>
    </section>
  );
}
