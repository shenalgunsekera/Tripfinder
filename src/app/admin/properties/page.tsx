"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, Star, MapPin, Zap, Eye, Trash2,
  CheckCircle2, XCircle, Shield, AlertTriangle,
} from "lucide-react";
import { getProperties, saveProperties } from "@/lib/storage";
import type { Property } from "@/lib/data";
import { CITIES, PROPERTY_TYPES } from "@/lib/data";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All Locations");
  const [typeFilter, setTypeFilter] = useState("All");
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "pending">("all");

  useEffect(() => {
    async function loadProperties() {
      setProperties(await getProperties());
    }

    void loadProperties();
  }, []);

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(q) || p.hostName.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
    const matchesCity = cityFilter === "All Locations" || p.city === cityFilter;
    const matchesType = typeFilter === "All" || p.type === typeFilter;
    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && p.isVerified) ||
      (verifiedFilter === "pending" && !p.isVerified);
    return matchesSearch && matchesCity && matchesType && matchesVerified;
  });

  async function approveProperty(propertyId: string) {
    const updated = properties.map((p) =>
      p.id === propertyId ? { ...p, isVerified: true } : p
    );
    await saveProperties(updated);
    setProperties(updated);
  }

  async function toggleActive(propertyId: string) {
    const updated = properties.map((p) =>
      p.id === propertyId ? { ...p, isActive: !p.isActive } : p
    );
    await saveProperties(updated);
    setProperties(updated);
  }

  async function removeProperty(propertyId: string) {
    if (!confirm("Remove this property from the platform?")) return;
    const updated = properties.filter((p) => p.id !== propertyId);
    await saveProperties(updated);
    setProperties(updated);
  }

  const pendingCount = properties.filter((p) => !p.isVerified).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
        <p className="text-sm text-gray-500 mt-1">Review, approve and manage all property listings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Listings", value: properties.length, color: "text-blue-700" },
          { label: "Active", value: properties.filter((p) => p.isActive).length, color: "text-green-700" },
          { label: "Pending Review", value: pendingCount, color: "text-amber-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {pendingCount > 0 && (
        <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2 text-sm text-amber-700">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span><strong>{pendingCount}</strong> propert{pendingCount === 1 ? "y" : "ies"} awaiting verification. Review and approve below.</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 min-w-48 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties or hosts..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="All">All Types</option>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>

        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value as typeof verifiedFilter)}
          className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Properties List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm">No properties match your filters.</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                <img src={p.images[0]} alt={p.title} className="h-24 w-32 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{p.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {p.address}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!p.isVerified && (
                        <span className="flex items-center gap-1 bg-amber-100 text-amber-700 rounded-full px-2.5 py-1 text-xs font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                      {p.isVerified && (
                        <span className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded-full px-2.5 py-1 text-xs font-medium">
                          <Shield className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {p.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2 text-sm">
                    <span className="text-xs font-medium bg-red-100 text-primary rounded-full px-2 py-0.5">{p.type}</span>
                    <span className="text-gray-600 text-xs">Host: <strong>{p.hostName}</strong></span>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-gray-700">{p.rating}</span>
                      <span className="text-gray-500">({p.reviewCount})</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900">LKR {p.price.toLocaleString()}/night</span>
                    {p.instantBook && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <Zap className="h-3 w-3" />
                        Instant
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
                <Link
                  href={`/properties/${p.slug}`}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Link>

                {!p.isVerified && (
                  <button
                    onClick={() => approveProperty(p.id)}
                    className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve
                  </button>
                )}

                <button
                  onClick={() => toggleActive(p.id)}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    p.isActive
                      ? "border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "border border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {p.isActive ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {p.isActive ? "Pause" : "Activate"}
                </button>

                <button
                  onClick={() => removeProperty(p.id)}
                  className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>

                <span className="ml-auto text-xs text-gray-400">
                  Added {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Showing {filtered.length} of {properties.length} properties
      </div>
    </div>
  );
}
