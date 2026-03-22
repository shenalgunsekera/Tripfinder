"use client";

import { useEffect, useState } from "react";
import {
  Search, CheckCircle2, Clock, XCircle, Calendar, Download,
  ChevronDown, MapPin,
} from "lucide-react";
import { getBookings, updateBookingStatus } from "@/lib/storage";
import type { Booking } from "@/lib/data";

const STATUS_CFG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  confirmed: { label: "Confirmed", color: "text-green-700 bg-green-100", Icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-amber-700 bg-amber-100", Icon: Clock },
  cancelled: { label: "Cancelled", color: "text-red-700 bg-red-100", Icon: XCircle },
  completed: { label: "Completed", color: "text-gray-700 bg-gray-100", Icon: CheckCircle2 },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Booking["status"]>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "instant" | "reservation">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "amount_desc" | "amount_asc">("newest");

  useEffect(() => {
    void refreshBookings();
  }, []);

  async function refreshBookings() {
    setBookings(await getBookings());
  }

  async function handleStatusChange(bookingId: string, newStatus: Booking["status"]) {
    await updateBookingStatus(bookingId, newStatus);
    await refreshBookings();
  }

  const filtered = bookings
    .filter((b) => {
      const q = search.toLowerCase();
      const matchesSearch =
        b.guestName.toLowerCase().includes(q) ||
        b.propertyTitle.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesType = typeFilter === "all" || b.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount_desc": return b.total - a.total;
        case "amount_asc": return a.total - b.total;
      }
    });

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((s, b) => s + b.total, 0);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor and manage all platform bookings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(["all", "confirmed", "pending", "cancelled", "completed"] as const).map((s) => {
          const cfg = s !== "all" ? STATUS_CFG[s] : null;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-xl border p-3 text-left transition ${
                statusFilter === s ? "border-primary bg-red-50" : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <p className={`text-xl font-bold ${statusFilter === s ? "text-primary" : "text-gray-900"}`}>
                {counts[s]}
              </p>
              <p className={`text-xs capitalize ${statusFilter === s ? "text-primary" : "text-gray-500"}`}>
                {s === "all" ? "All Bookings" : s}
              </p>
            </button>
          );
        })}
      </div>

      {/* Revenue Summary */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-red-700 text-white p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-red-200 text-sm">Total Platform Revenue</p>
          <p className="text-2xl font-bold">LKR {totalRevenue.toLocaleString()}</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 min-w-48 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guest, property, or booking ID..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="appearance-none rounded-xl border border-gray-300 bg-white pl-3 pr-8 py-2.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="instant">Instant</option>
            <option value="reservation">Reservation</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="appearance-none rounded-xl border border-gray-300 bg-white pl-3 pr-8 py-2.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Booking</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Property</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Dates</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    No bookings found
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const cfg = STATUS_CFG[b.status];
                  const StatusIcon = cfg.Icon;
                  return (
                    <tr key={b.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{b.guestName}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">{b.guestEmail}</p>
                          <p className="text-xs text-gray-400 font-mono">{b.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <img src={b.propertyImage} alt="" className="h-9 w-11 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate max-w-[140px]">{b.propertyTitle}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {b.propertyLocation}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-700">{formatDate(b.checkIn)}</p>
                        <p className="text-xs text-gray-500">→ {formatDate(b.checkOut)}</p>
                        <p className="text-xs text-gray-400">{b.nights} night{b.nights > 1 ? "s" : ""} · {b.guests} guest{b.guests > 1 ? "s" : ""}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-gray-900">LKR {b.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{b.paymentMethod}</p>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize ${
                          b.type === "instant" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                        }`}>{b.type}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          {b.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStatusChange(b.id, "confirmed")}
                                className="rounded-lg bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleStatusChange(b.id, "cancelled")}
                                className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 transition"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {b.status === "confirmed" && (
                            <>
                              <button
                                onClick={() => handleStatusChange(b.id, "completed")}
                                className="rounded-lg bg-gray-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-gray-700 transition"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => handleStatusChange(b.id, "cancelled")}
                                className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {(b.status === "cancelled" || b.status === "completed") && (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {bookings.length} bookings · Total: LKR {filtered.reduce((s, b) => s + b.total, 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
