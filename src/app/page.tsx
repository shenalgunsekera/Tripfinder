import { Sparkles, Zap, Shield, Heart } from "lucide-react";
import Hero from "@/components/Hero";
import HostCTA from "@/components/HostCTA";
import FeaturedProperties from "@/components/FeaturedProperties";
import Image from "next/image";
import Link from "next/link";

const DESTINATIONS = [
  { name: "Colombo", properties: 45, image: "https://picsum.photos/seed/colombo-city/600/400", desc: "The vibrant capital" },
  { name: "Galle", properties: 32, image: "https://picsum.photos/seed/galle-fort/600/400", desc: "UNESCO Heritage" },
  { name: "Ella", properties: 28, image: "https://picsum.photos/seed/ella-hills/600/400", desc: "Scenic highlands" },
  { name: "Bentota", properties: 38, image: "https://picsum.photos/seed/bentota-beach/600/400", desc: "Golden beaches" },
];

const FEATURES = [
  {
    Icon: Sparkles,
    title: "AI Recommendations",
    desc: "Search with natural language and get personalized suggestions tailored to your preferences.",
  },
  {
    Icon: Zap,
    title: "Instant Booking",
    desc: "Book instantly without waiting for host approval on select properties.",
  },
  {
    Icon: Shield,
    title: "Secure Payments",
    desc: "Safe, encrypted payment processing with multiple payment options.",
  },
  {
    Icon: Heart,
    title: "Verified Hosts",
    desc: "All properties reviewed and verified for quality, safety and accuracy.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Why Choose TripFinder */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Why TripFinder</p>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">The smarter way to book in Sri Lanka</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 hover:border-gray-200 hover:shadow-md transition-all">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="container">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Popular Destinations</p>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Explore Sri Lanka</h2>
            </div>
            <Link href="/properties" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
              View all locations →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((place) => (
              <div
                key={place.name}
                className="group relative overflow-hidden rounded-xl"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">{place.name}</h3>
                  <p className="text-sm text-gray-200">{place.properties} properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProperties />

      {/* AI Search CTA */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="relative overflow-hidden mx-auto max-w-4xl rounded-3xl bg-gray-900 px-8 py-16 md:px-16 text-center">
            {/* Subtle background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-gray-900 to-gray-900 pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs font-medium uppercase tracking-wider text-white/70">AI-Powered Search</span>
              </div>
              <h2 className="text-2xl font-bold text-white md:text-3xl mb-4">
                Describe Your Perfect Stay
              </h2>
              <p className="text-white/60 mb-10 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                Skip the filters. Tell our AI what you&apos;re looking for — location, vibe, budget, group size — and get personalized recommendations instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                <Link
                  href="/ai-search"
                  className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  Try AI Search
                </Link>
                <Link
                  href="/properties"
                  className="flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-medium text-white/80 hover:bg-white/5 transition"
                >
                  Browse All Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HostCTA />
    </>
  );
}
