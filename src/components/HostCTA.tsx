"use client";

import Link from "next/link";

export default function HostCTA() {
  return (
    <section className="w-full bg-primary text-primary-foreground py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold">
          Have a property to share?
        </h2>

        {/* Subtext */}
        <p className="mt-4 text-lg md:text-xl opacity-90">
          Join thousands of hosts and start earning from your space
        </p>

        {/* Button */}
        <div className="mt-8">
          <Link
            href="/host"
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
          >
            Become a Host
          </Link>
        </div>

      </div>
    </section>
  );
}
