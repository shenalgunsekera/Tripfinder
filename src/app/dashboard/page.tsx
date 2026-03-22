"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, User, MapPin,
  CheckCircle2, Clock, XCircle, ChevronRight, Search,
  Sparkles, Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import InitialAvatar from "@/components/InitialAvatar";
import { getBookingsByGuest, updateBookingStatus, updateUser } from "@/lib/storage";
import type { Booking } from "@/lib/data";

const TABS = ["overview", "bookings", "profile", "reviews"] as const;
type Tab = typeof TABS[number];

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  confirmed: { label: "Confirmed", color: "text-green-700 bg-green-100", Icon: CheckCircle2 },
  pending: { label: "Pending Approval", color: "text-amber-700 bg-amber-100", Icon: Clock },
  cancelled: { label: "Cancelled", color: "text-red-700 bg-red-100", Icon: XCircle },
  completed: { label: "Completed", color: "text-gray-700 bg-gray-100", Icon: CheckCircle2 },
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get("tab") as Tab) || "overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    async function loadDashboard() {
      if (user && user.role === "traveler") {
        setBookings(await getBookingsByGuest(user.id));
        setProfileName(user.name);
        setProfileEmail(user.email);
        setProfilePhone(user.phone || "");
      }
    }

    void loadDashboard();
  }, [user]);

  async function handleCancelBooking(bookingId: string) {
    await updateBookingStatus(bookingId, "cancelled");
    if (user) setBookings(await getBookingsByGuest(user.id));
  }

  async function handleSaveProfile() {
    if (!user) return;
    const updates: Record<string, string> = { name: profileName, email: profileEmail, phone: profilePhone };
    if (profilePassword.trim()) updates.password = profilePassword;
    await updateUser(user.id, updates);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
    setProfilePassword("");
  }

  if (loading || !user) return null;

  // Redirect host/admin
  if (user.role === "host") { router.push("/host/dashboard"); return null; }
  if (user.role === "admin") { router.push("/admin"); return null; }

  const stats = {
    totalBookings: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    totalSpent: bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((s, b) => s + b.total, 0),
  };

  const upcoming = bookings.filter((b) =>
    (b.status === "confirmed" || b.status === "pending") && new Date(b.checkIn) >= new Date()
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <InitialAvatar name={user.name} className="h-14 w-14 border-2 border-primary" textClassName="text-lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Welcome back, {user.name.split(" ")[0]}!</h1>
              <p className="text-sm text-gray-500">Traveler Dashboard</p>
            </div>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            <Search className="h-4 w-4" />
            Find a Stay
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", Icon: LayoutDashboard },
            { id: "bookings", label: "My Bookings", Icon: Calendar },
            { id: "profile", label: "Profile", Icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 flex-1 justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <tab.Icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Bookings", value: stats.totalBookings, color: "bg-blue-50 text-blue-700" },
                { label: "Confirmed", value: stats.confirmed, color: "bg-green-50 text-green-700" },
                { label: "Pending", value: stats.pending, color: "bg-amber-50 text-amber-700" },
                { label: "Total Spent", value: `LKR ${stats.totalSpent.toLocaleString()}`, color: "bg-purple-50 text-purple-700" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color.split(" ")[1]}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Upcoming Bookings */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Upcoming Stays</h2>
                <button onClick={() => setActiveTab("bookings")} className="text-sm text-primary hover:underline">
                  View all
                </button>
              </div>
              {upcoming.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No upcoming trips.</p>
                  <Link href="/properties" className="mt-3 inline-block text-primary text-sm font-medium hover:underline">
                    Find your next adventure →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {upcoming.map((b) => {
                    const cfg = STATUS_CONFIG[b.status];
                    const Icon = cfg.Icon;
                    return (
                      <div key={b.id} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition">
                        <img src={b.propertyImage} alt={b.propertyTitle} className="h-16 w-20 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{b.propertyTitle}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {b.propertyLocation}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</span>
                            <span>{b.guests} guest{b.guests > 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                          <p className="text-sm font-bold text-gray-900 mt-1">LKR {b.total.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: "/ai-search", label: "AI Property Search", desc: "Find stays with natural language", Icon: Sparkles },
                { href: "/properties", label: "Browse All Properties", desc: "Explore listings across Sri Lanka", Icon: Home },
                { href: "/dashboard?tab=profile", label: "Edit Profile", desc: "Update your personal information", Icon: User, tab: "profile" as const },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => item.tab && setActiveTab(item.tab)}
                  className="rounded-2xl bg-white border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all flex items-start gap-3"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-red-50">
                    <item.Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 mt-0.5" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">All Bookings</h2>
            {bookings.length === 0 ? (
              <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-700">No bookings yet</h3>
                <p className="text-gray-500 text-sm mt-1">Your booking history will appear here.</p>
                <Link href="/properties" className="mt-4 inline-block bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition">
                  Explore Properties
                </Link>
              </div>
            ) : (
              bookings.map((b) => {
                const cfg = STATUS_CONFIG[b.status];
                const Icon = cfg.Icon;
                return (
                  <div key={b.id} className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-start gap-4 p-5">
                      <img src={b.propertyImage} alt={b.propertyTitle} className="h-24 w-32 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-gray-900">{b.propertyTitle}</h3>
                          <span className={`flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.color}`}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {b.propertyLocation}
                        </div>
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
                            <p className="text-xs text-gray-400 uppercase font-medium">Total</p>
                            <p className="font-bold text-gray-900">LKR {b.total.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-5 py-3 bg-gray-50 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Booking #{b.id} · {b.paymentMethod}</span>
                      <div className="flex gap-2">
                        <Link
                          href={`/properties/${b.propertySlug}`}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          View Property
                        </Link>
                        {(b.status === "confirmed" || b.status === "pending") && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="text-xs font-medium text-gray-500 hover:text-red-600 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-6">Profile Settings</h2>

              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <InitialAvatar name={user.name} className="h-20 w-20 border-2 border-primary" textClassName="text-2xl" />
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {profileSaved && (
                <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-700 font-medium">
                  Profile updated successfully!
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => { setProfileName(user.name); setProfileEmail(user.email); setProfilePhone(user.phone || ""); setProfilePassword(""); }}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Reset
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Account Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700">Member since:</span>
                    <span className="ml-2">{user.joinedDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Verified:</span>
                    <span className={`ml-2 ${user.isVerified ? "text-green-600" : "text-amber-600"}`}>
                      {user.isVerified ? "Yes ✓" : "Pending"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total Bookings:</span>
                    <span className="ml-2">{stats.totalBookings}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
