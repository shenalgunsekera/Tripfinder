"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, MapPin, Star, Zap, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getProperties } from "@/lib/storage";
import type { Property, PropertyType } from "@/lib/data";
import { CITIES, PROPERTY_TYPES } from "@/lib/data";

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under LKR 10,000", min: 0, max: 10000 },
  { label: "LKR 10,000 – 20,000", min: 10000, max: 20000 },
  { label: "LKR 20,000+", min: 20000, max: Infinity },
];

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedCity, setSelectedCity] = useState(() => {
    const city = searchParams.get("city");
    return city && CITIES.includes(city) ? city : "All Locations";
  });
  const [selectedType, setSelectedType] = useState<PropertyType | "All">("All");
  const [priceIdx, setPriceIdx] = useState(0);
  const [instantOnly, setInstantOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc" | "newest">("rating");
  const [filtersOpen, setFiltersOpen] = useState(() => !!searchParams.get("city"));
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    async function loadProperties() {
      setProperties(await getProperties());
    }

    void loadProperties();
  }, []);

  const filtered = useMemo(() => {
    let result = properties.filter((p) => p.isActive);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }

    if (selectedCity !== "All Locations") {
      result = result.filter((p) => p.city === selectedCity);
    }

    if (selectedType !== "All") {
      result = result.filter((p) => p.type === selectedType);
    }

    const pr = PRICE_RANGES[priceIdx];
    result = result.filter((p) => p.price >= pr.min && p.price <= pr.max);

    if (instantOnly) {
      result = result.filter((p) => p.instantBook);
    }

    if (guests > 1) {
      result = result.filter((p) => p.guests >= guests);
    }

    switch (sortBy) {
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "price_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [properties, search, selectedCity, selectedType, priceIdx, instantOnly, sortBy, guests]);

  function clearFilters() {
    setSearch("");
    setSelectedCity("All Locations");
    setSelectedType("All");
    setPriceIdx(0);
    setInstantOnly(false);
    setGuests(1);
  }

  const hasActiveFilters =
    search || selectedCity !== "All Locations" || selectedType !== "All" || priceIdx !== 0 || instantOnly || guests > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <h1 className="text-xl font-bold text-gray-900">Properties in Sri Lanka</h1>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-primary font-medium hover:underline self-start sm:self-auto">
                Clear filters
              </button>
            )}
          </div>

          {/* Main Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100 transition">
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="City, property type, or amenities..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                filtersOpen
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                  •
                </span>
              )}
            </button>
          </div>

          {/* Expandable Filters */}
          {filtersOpen && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* City */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">Location</label>
                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-8 text-sm text-gray-700 focus:border-primary focus:outline-none"
                    >
                      {CITIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">Property Type</label>
                  <div className="relative">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value as PropertyType | "All")}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-8 text-sm text-gray-700 focus:border-primary focus:outline-none"
                    >
                      <option value="All">All Types</option>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">Price Range</label>
                  <div className="relative">
                    <select
                      value={priceIdx}
                      onChange={(e) => setPriceIdx(Number(e.target.value))}
                      className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-8 text-sm text-gray-700 focus:border-primary focus:outline-none"
                    >
                      {PRICE_RANGES.map((r, i) => (
                        <option key={i} value={i}>{r.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600 uppercase tracking-wide">Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={instantOnly}
                    onChange={(e) => setInstantOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-primary"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-yellow-500" /> Instant Book only
                  </span>
                </label>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sort Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filtered.length}</span> properties found
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none rounded-lg border border-gray-300 bg-white pl-3 pr-8 py-2 text-sm text-gray-700 focus:border-primary focus:outline-none"
              >
                <option value="rating">Top Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <Search className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">No properties found</h3>
            <p className="text-gray-500 mt-2 text-sm">Try adjusting your filters or search term.</p>
            <button
              onClick={clearFilters}
              className="mt-5 text-sm font-medium text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <div className="rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {property.instantBook && (
            <span className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <Zap className="h-3 w-3 text-amber-500" /> Instant
            </span>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 rounded-full px-2.5 py-1 shadow-sm">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-gray-900">{property.rating}</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 mb-1">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <span className="font-bold text-gray-900">LKR {property.price.toLocaleString()}</span>
              <span className="text-gray-400 text-xs"> / night</span>
            </div>
            <span className="text-xs text-gray-400">{property.reviewCount} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
