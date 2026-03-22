"use client";

import { useState } from "react";
import { Search, Sparkles, MapPin, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "ai">("search");
  const heroVideo =
    "https://player.vimeo.com/external/434045526.sd.mp4?s=bc380b538f1f7f9ec96f3f1220b4035a4f7d1824&profile_id=139&oauth2_token_id=57447761";

  function handleSearch() {
    if (!query.trim()) {
      router.push("/properties");
      return;
    }
    if (activeTab === "ai") {
      router.push(`/ai-search?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/properties?search=${encodeURIComponent(query)}`);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-banner.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.78]"
        />
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-banner.jpg"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container pt-32 pb-16 md:pt-36 md:pb-20">
          <div className="mx-auto max-w-2xl text-center">


          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
            Discover Your Perfect Stay{" "}
            <span className="text-red-400">in Sri Lanka</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base text-white/75 md:text-lg leading-relaxed">
            Villas, apartments, and homestays across the island — booked instantly or on request.
          </p>

          {/* Search Card */}
          <div className="mt-10 rounded-2xl bg-white shadow-2xl shadow-black/30 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("search")}
                className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                  activeTab === "search"
                    ? "bg-white text-gray-900 border-b-2 border-primary"
                    : "bg-gray-50 text-gray-500 hover:text-gray-700"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                Standard Search
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                  activeTab === "ai"
                    ? "bg-white text-gray-900 border-b-2 border-primary"
                    : "bg-gray-50 text-gray-500 hover:text-gray-700"
                }`}
              >
                <Sparkles className={`h-3.5 w-3.5 ${activeTab === "ai" ? "text-primary" : ""}`} />
                AI Search
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-3.5">
              {activeTab === "ai" ? (
                <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
              ) : (
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  activeTab === "ai"
                    ? "e.g. Luxury beachfront villa for 6 in Bentota with a pool..."
                    : "City, property type, or features..."
                }
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                onClick={handleSearch}
                className="flex-shrink-0 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Search
              </button>
            </div>

            {activeTab === "ai" && (
              <div className="px-4 pb-3 text-xs text-gray-400">
                Describe your ideal stay in plain English — location, vibe, budget, group size.
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
            {[
              { icon: MapPin, text: "12 Cities" },
              { icon: Users, text: "500+ Hosts" },
              { icon: Calendar, text: "Instant Booking Available" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
