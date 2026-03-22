"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Zap, ArrowRight } from "lucide-react";
import { getProperties } from "@/lib/storage";
import type { Property } from "@/lib/data";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadProperties() {
      const all = await getProperties();
      const featured = all
        .filter((p) => p.isActive && p.isVerified)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      setProperties(featured);
    }

    void loadProperties();
  }, []);

  return (
    <section id="explore" className="bg-white py-20 md:py-28 scroll-mt-20">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Top Rated</p>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Featured Properties</h2>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
          >
            View all properties
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <FeaturedPropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedPropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-0.5 transition-all duration-300">
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {property.instantBook && (
            <span className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <Zap className="h-3 w-3 text-amber-500" /> Instant Book
            </span>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 rounded-full px-2.5 py-1 shadow-sm">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-gray-900">{property.rating}</span>
          </div>
        </div>

        <div className="p-5">
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
