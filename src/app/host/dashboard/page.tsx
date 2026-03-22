"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2, LayoutDashboard, Calendar, TrendingUp, User,
  Plus, Eye, Edit, Trash2, CheckCircle2, Clock, XCircle,
  Star, MapPin, Zap, ToggleLeft, ToggleRight, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import InitialAvatar from "@/components/InitialAvatar";
import {
  getPropertiesByHost, getBookingsByHost, updateBookingStatus,
  deleteProperty, updateProperty, saveProperties, getProperties, updateUser,
} from "@/lib/storage";
import type { Property, Booking } from "@/lib/data";

const TABS = ["overview", "properties", "bookings", "earnings", "profile"] as const;
type Tab = typeof TABS[number];

const STATUS_CFG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  confirmed: { label: "Confirmed", color: "text-green-700 bg-green-100", Icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-amber-700 bg-amber-100", Icon: Clock },
  cancelled: { label: "Cancelled", color: "text-red-700 bg-red-100", Icon: XCircle },
  completed: { label: "Completed", color: "text-gray-700 bg-gray-100", Icon: CheckCircle2 },
};

export default function HostDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [hostPhone, setHostPhone] = useState("");
  const [hostBio, setHostBio] = useState("I'm passionate about hospitality and making every guest feel welcome.");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.push("/login"); return; }
    if (!loading && user && user.role !== "host") { router.push("/dashboard"); return; }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadDashboard() {
      if (user) {
        const [hostProperties, hostBookings] = await Promise.all([
          getPropertiesByHost(user.id),
          getBookingsByHost(user.id),
        ]);
        setProperties(hostProperties);
        setBookings(hostBookings);
        setHostName(user.name);
        setHostEmail(user.email);
        setHostPhone(user.phone || "");
      }
    }

    void loadDashboard();
  }, [user]);

  async function handleSaveHostProfile() {
    if (!user) return;
    await updateUser(user.id, { name: hostName, email: hostEmail, phone: hostPhone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  if (loading || !user) return null;

  const totalEarnings = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((s, b) => s + b.total, 0);

  const pendingBookings = bookings.filter((b) => b.status === "pending");

  async function handleApprove(bookingId: string) {
    await updateBookingStatus(bookingId, "confirmed");
    setBookings(await getBookingsByHost(user!.id));
  }

  async function handleReject(bookingId: string) {
    await updateBookingStatus(bookingId, "cancelled");
    setBookings(await getBookingsByHost(user!.id));
  }

  async function togglePropertyStatus(propertyId: string, current: boolean) {
    await updateProperty(propertyId, { isActive: !current });
    setProperties(await getPropertiesByHost(user!.id));
  }

  async function handleDeleteProperty(propertyId: string) {
    if (!confirm("Are you sure you want to delete this property?")) return;
    await deleteProperty(propertyId);
    setProperties(await getPropertiesByHost(user!.id));
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // Monthly earnings (mock calculation)
  const monthlyData = [
    { month: "Oct", amount: 45000 },
    { month: "Nov", amount: 78000 },
    { month: "Dec", amount: 125000 },
    { month: "Jan", amount: 98000 },
    { month: "Feb", amount: 112000 },
    { month: "Mar", amount: totalEarnings > 0 ? totalEarnings : 60000 },
  ];
  const maxAmount = Math.max(...monthlyData.map((m) => m.amount));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <InitialAvatar name={user.name} className="h-14 w-14 border-2 border-primary" textClassName="text-lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Host Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
            </div>
          </div>
          <Link
            href="/host/properties/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", Icon: LayoutDashboard },
            { id: "properties", label: "Properties", Icon: Building2 },
            { id: "bookings", label: "Bookings", Icon: Calendar },
            { id: "earnings", label: "Earnings", Icon: TrendingUp },
            { id: "profile", label: "Profile", Icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 flex-1 justify-center rounded-lg px-3 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <tab.Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === "bookings" && pendingBookings.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                  {pendingBookings.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Active Listings", value: properties.filter((p) => p.isActive).length, color: "text-blue-700", bg: "bg-blue-50" },
                { label: "Total Bookings", value: bookings.length, color: "text-green-700", bg: "bg-green-50" },
                { label: "Pending Requests", value: pendingBookings.length, color: "text-amber-700", bg: "bg-amber-50" },
                { label: "Total Earnings", value: `LKR ${totalEarnings.toLocaleString()}`, color: "text-purple-700", bg: "bg-purple-50" },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl ${s.bg} border border-gray-200 p-5 shadow-sm`}>
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Pending Bookings Alert */}
            {pendingBookings.length > 0 && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-bold text-amber-800">
                    {pendingBookings.length} Booking Request{pendingBookings.length > 1 ? "s" : ""} Awaiting Your Response
                  </h3>
                </div>
                <div className="space-y-3">
                  {pendingBookings.slice(0, 3).map((b) => (
                    <div key={b.id} className="flex items-center justify-between gap-4 bg-white rounded-xl p-4 border border-amber-200">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{b.guestName}</p>
                        <p className="text-xs text-gray-500 truncate">{b.propertyTitle}</p>
                        <p className="text-xs text-gray-500">{formatDate(b.checkIn)} – {formatDate(b.checkOut)} · {b.guests} guest{b.guests > 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApprove(b.id)}
                          className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(b.id)}
                          className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {pendingBookings.length > 3 && (
                  <button onClick={() => setActiveTab("bookings")} className="mt-3 text-sm text-amber-700 font-medium hover:underline">
                    View all {pendingBookings.length} pending requests →
                  </button>
                )}
              </div>
            )}

            {/* Recent Properties */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">My Listings</h2>
                <button onClick={() => setActiveTab("properties")} className="text-sm text-primary hover:underline">View all</button>
              </div>
              {properties.length === 0 ? (
                <div className="p-8 text-center">
                  <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No properties yet.</p>
                  <Link href="/host/properties/new" className="mt-3 inline-block text-primary text-sm font-medium hover:underline">
                    Add your first property →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {properties.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex items-center gap-4 p-5">
                      <img src={p.images[0]} alt={p.title} className="h-16 w-20 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {p.location}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <span className="flex items-center gap-0.5 text-yellow-600">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {p.rating}
                          </span>
                          <span className="text-gray-500">LKR {p.price.toLocaleString()}/night</span>
                          {p.instantBook && (
                            <span className="flex items-center gap-0.5 text-green-600">
                              <Zap className="h-3 w-3" />
                              Instant
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PROPERTIES ── */}
        {activeTab === "properties" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">My Properties ({properties.length})</h2>
              <Link
                href="/host/properties/new"
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                <Plus className="h-4 w-4" />
                Add New
              </Link>
            </div>

            {properties.length === 0 ? (
              <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-700">No properties listed</h3>
                <Link href="/host/properties/new" className="mt-4 inline-block bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition">
                  Add Your First Property
                </Link>
              </div>
            ) : (
              properties.map((p) => (
                <div key={p.id} className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    <img src={p.images[0]} alt={p.title} className="h-28 w-36 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{p.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {p.address}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePropertyStatus(p.id, p.isActive)}
                            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              p.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {p.isActive ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                            {p.isActive ? "Active" : "Paused"}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{p.rating}</span>
                          <span className="text-gray-500">({p.reviewCount} reviews)</span>
                        </div>
                        <span className="text-gray-600">
                          <span className="font-semibold text-gray-900">LKR {p.price.toLocaleString()}</span>/night
                        </span>
                        <span className="text-gray-500">{p.type} · {p.guests} guests</span>
                        {p.instantBook && (
                          <span className="flex items-center gap-1 text-green-700">
                            <Zap className="h-3.5 w-3.5" />
                            Instant Book
                          </span>
                        )}
                        {!p.isVerified && (
                          <span className="text-amber-600">⚠ Pending Verification</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <Link
                      href={`/properties/${p.slug}`}
                      className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Link>
                    <button
                      className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(p.id)}
                      className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                    <span className="ml-auto text-xs text-gray-400">
                      {bookings.filter((b) => b.propertyId === p.id).length} total bookings
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">
              Booking Requests & History
              {pendingBookings.length > 0 && (
                <span className="ml-2 text-sm font-normal text-amber-600">
                  ({pendingBookings.length} pending)
                </span>
              )}
            </h2>

            {bookings.length === 0 ? (
              <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-700">No bookings yet</h3>
                <p className="text-gray-500 text-sm mt-1">Bookings for your properties will appear here.</p>
              </div>
            ) : (
              bookings.map((b) => {
                const cfg = STATUS_CFG[b.status];
                const StatusIcon = cfg.Icon;
                return (
                  <div key={b.id} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                          <span className="text-xs text-gray-400">#{b.id}</span>
                          <span className="text-xs font-medium text-gray-600 capitalize bg-gray-100 px-2 py-0.5 rounded-full">{b.type}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 truncate">{b.guestName}</h3>
                        <p className="text-sm text-gray-500 truncate">{b.propertyTitle}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-sm">
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Check-in</p>
                            <p className="font-semibold text-gray-700">{formatDate(b.checkIn)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Check-out</p>
                            <p className="font-semibold text-gray-700">{formatDate(b.checkOut)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Guests</p>
                            <p className="font-semibold text-gray-700">{b.guests}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-medium">Earnings</p>
                            <p className="font-bold text-green-700">LKR {(b.total - b.serviceFee).toLocaleString()}</p>
                          </div>
                        </div>
                        {b.specialRequests && (
                          <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                            <span className="font-medium">Guest note:</span> {b.specialRequests}
                          </p>
                        )}
                      </div>

                      {b.status === "pending" && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleApprove(b.id)}
                            className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(b.id)}
                            className="flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                          >
                            <XCircle className="h-4 w-4" />
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── EARNINGS ── */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Total Earnings", value: `LKR ${totalEarnings.toLocaleString()}`, color: "text-green-700", bg: "bg-green-50" },
                { label: "This Month", value: `LKR ${monthlyData[monthlyData.length - 1].amount.toLocaleString()}`, color: "text-blue-700", bg: "bg-blue-50" },
                { label: "Avg per Night", value: properties.length ? `LKR ${Math.round(properties.reduce((s, p) => s + p.price, 0) / properties.length).toLocaleString()}` : "LKR 0", color: "text-purple-700", bg: "bg-purple-50" },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl ${s.bg} border border-gray-200 p-6 shadow-sm`}>
                  <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-6">Monthly Earnings (LKR)</h3>
              <div className="flex items-end gap-3 h-40">
                {monthlyData.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-600 font-medium">
                      {(m.amount / 1000).toFixed(0)}k
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-primary transition-all"
                      style={{ height: `${Math.max(8, (m.amount / maxAmount) * 100)}%` }}
                    />
                    <span className="text-xs text-gray-500">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Per Property Earnings */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Earnings by Property</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {properties.map((p) => {
                  const propBookings = bookings.filter((b) => b.propertyId === p.id && (b.status === "confirmed" || b.status === "completed"));
                  const earned = propBookings.reduce((s, b) => s + (b.total - b.serviceFee), 0);
                  return (
                    <div key={p.id} className="flex items-center gap-4 p-5">
                      <img src={p.images[0]} alt={p.title} className="h-14 w-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                        <p className="text-xs text-gray-500">{propBookings.length} confirmed booking{propBookings.length !== 1 ? "s" : ""}</p>
                      </div>
                      <p className="font-bold text-green-700 text-sm flex-shrink-0">
                        LKR {earned.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {activeTab === "profile" && (
          <div className="max-w-2xl">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-6">Host Profile</h2>
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <InitialAvatar name={user.name} className="h-20 w-20 border-2 border-primary" textClassName="text-2xl" />
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                    Host
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={hostEmail}
                    onChange={(e) => setHostEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={hostPhone}
                    onChange={(e) => setHostPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={hostBio}
                    onChange={(e) => setHostBio(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              {profileSaved && (
                <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-700 font-medium">
                  Profile updated successfully!
                </div>
              )}
              <button
                onClick={handleSaveHostProfile}
                className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
