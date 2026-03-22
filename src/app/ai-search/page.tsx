"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, Send, MapPin, Star, Zap, ArrowRight, MessageSquare, Cpu, Home, AlertCircle,
} from "lucide-react";
import type { Property } from "@/lib/data";
import { getProperties } from "@/lib/storage";

const EXAMPLE_PROMPTS = [
  "Luxury beachfront villa in Bentota for 6 people with a pool",
  "Budget-friendly room near Colombo for 2 nights",
  "Romantic couples retreat with mountain views in Ella",
  "Unique stay with adventure activities near Sigiriya",
  "Family-friendly property in Galle Fort",
  "Surf cottage in Arugam Bay for a week",
];

export default function AISearchPage() {
  const heroVideo =
    "https://player.vimeo.com/external/434045526.sd.mp4?s=bc380b538f1f7f9ec96f3f1220b4035a4f7d1824&profile_id=139&oauth2_token_id=57447761";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [matchReasons, setMatchReasons] = useState<Record<string, string>>({});
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadProperties() {
      setAllProperties(await getProperties());
    }

    void loadProperties();
  }, []);

  // Pre-fill query from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(q: string = query) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setQuery(q);

    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, properties: allProperties }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.properties || []);
      setMatchReasons(data.matchReasons || {});
      setExplanation(data.explanation || "");
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Please try again.");
      setHasSearched(true);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-center">
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_26%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/68 via-slate-950/58 to-slate-950/78" />
        </div>

        <div className="relative z-10 w-full px-4 pt-32 pb-16 md:pt-36 md:pb-20">
          <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-red-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-white/60">AI-Powered Search</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3 leading-tight md:text-4xl">
            Find Your Perfect Stay —<br />
            <span className="text-red-400">Just Describe It</span>
          </h1>

          <p className="text-white/50 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
            Tell our AI what you&apos;re looking for in plain English — location, vibe, budget, group size,
            and any special requirements.
          </p>

          {/* Search Box */}
          <div className="rounded-2xl bg-white shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="e.g. Luxury beachfront villa in Bentota for 8 people with a pool and ocean view..."
                rows={3}
                className="flex-1 bg-transparent text-sm text-gray-900 resize-none outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
              <span className="text-xs text-gray-400 hidden sm:block">Press Enter to search</span>
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="ml-auto flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          {!hasSearched && (
            <div className="mt-7">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Try an example</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSearch(prompt)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:bg-white/10 hover:text-white/80 hover:border-white/20 transition text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </section>

      {/* Results */}
      {hasSearched && (
        <div className="bg-gray-50 min-h-[60vh] px-4 py-10">
          <div className="max-w-6xl mx-auto">

            {/* Error */}
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-5 mb-8 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 text-sm">Search Error</p>
                  <p className="text-red-700 text-sm mt-0.5">{error}</p>
                  {error.includes("ANTHROPIC_API_KEY") && (
                    <p className="text-red-600 text-xs mt-2">
                      Add your API key to <code className="bg-red-100 px-1 rounded">.env.local</code> and restart the dev server.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* AI Explanation */}
            {!error && explanation && (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 mb-8 flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">AI Search Results</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Your query:</span>{" "}
                    <span className="italic text-gray-500">&ldquo;{query}&rdquo;</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{explanation}</p>
                </div>
              </div>
            )}

            {/* Search Again */}
            <div className="mb-8">
              <div className="flex items-center gap-3 rounded-xl bg-white border border-gray-200 px-4 py-3 shadow-sm">
                <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Refine your search..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-60"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Search
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-900 text-lg">
                {results.length} {results.length === 1 ? "Property" : "Properties"} Found
              </h2>
              <Link href="/properties" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all properties
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {results.length === 0 && !error ? (
              <div className="text-center py-16">
                <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-700">No matches found</h3>
                <p className="text-gray-500 text-sm mt-1">Try a different search query.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((property, i) => (
                  <AIPropertyCard
                    key={property.id}
                    property={property}
                    rank={i + 1}
                    matchReason={matchReasons[property.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* How It Works */}
      {!hasSearched && (
        <div className="bg-gray-50 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">How It Works</p>
              <h2 className="text-2xl font-bold text-gray-900">Three steps to your perfect stay</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Describe Your Stay", desc: "Use natural language to describe exactly what you want — location, type, budget, group size, amenities, vibe.", Icon: MessageSquare },
                { step: "02", title: "AI Matches Properties", desc: "Claude AI understands your intent, extracts key preferences, and matches them against all available properties.", Icon: Cpu },
                { step: "03", title: "Book Instantly", desc: "Properties are ranked by how well they match your needs. Book instantly or send a reservation request.", Icon: Home },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                      <item.Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-gray-300 tracking-widest">{item.step}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AIPropertyCard({
  property,
  rank,
  matchReason,
}: {
  property: Property;
  rank: number;
  matchReason?: string;
}) {
  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden relative">
        {/* Rank Badge */}
        {rank <= 3 && (
          <div className="absolute top-3 left-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow">
            #{rank}
          </div>
        )}

        {/* Image */}
        <div className="relative h-52 bg-gray-200 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {property.instantBook && (
            <span className="absolute top-3 right-3 flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
              <Zap className="h-3 w-3" /> Instant
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{property.title}</h3>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{property.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="h-3 w-3" />
            {property.location}
          </div>

          {matchReason && (
            <p className="text-xs text-primary/80 mb-2 italic line-clamp-2">{matchReason}</p>
          )}

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">{property.type}</span>
            <span className="text-gray-500">Up to {property.guests} guests</span>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-900">LKR {property.price.toLocaleString()}</span>
              <span className="text-gray-400 text-xs"> /night</span>
            </div>
            <span className="text-xs text-gray-400">{property.reviewCount} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
