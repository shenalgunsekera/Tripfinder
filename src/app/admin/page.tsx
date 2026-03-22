"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, Building2, Calendar, TrendingUp, CheckCircle2,
  Clock, XCircle, ArrowUpRight, Star, MapPin,
} from "lucide-react";
import { getPlatformStats, getUsers, getProperties } from "@/lib/storage";
import type { Property, User } from "@/lib/data";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getPlatformStats>> | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [topProperties, setTopProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const [platformStats, users, properties] = await Promise.all([
        getPlatformStats(),
        getUsers(),
        getProperties(),
      ]);

      setStats(platformStats);
      setRecentUsers(users.slice(-5).reverse());
      setTopProperties(
        properties
          .filter((p) => p.isActive)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5),
      );
    }

    void loadDashboard();
  }, []);

  if (!stats) return null;

  const STATUS_ICON: Record<string, React.ElementType> = {
    confirmed: CheckCircle2,
    pending: Clock,
    cancelled: XCircle,
    completed: CheckCircle2,
  };
  const STATUS_COLOR: Record<string, string> = {
    confirmed: "text-green-700 bg-green-100",
    pending: "text-amber-700 bg-amber-100",
    cancelled: "text-red-700 bg-red-100",
    completed: "text-gray-700 bg-gray-100",
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening on TripFinder.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Travelers", value: stats.totalUsers, Icon: Users, color: "bg-blue-50 text-blue-600", link: "/admin/users" },
          { label: "Total Hosts", value: stats.totalHosts, Icon: Users, color: "bg-purple-50 text-purple-600", link: "/admin/users" },
          { label: "Active Properties", value: stats.totalProperties, Icon: Building2, color: "bg-green-50 text-green-600", link: "/admin/properties" },
          { label: "Total Bookings", value: stats.totalBookings, Icon: Calendar, color: "bg-amber-50 text-amber-600", link: "/admin/bookings" },
        ].map((s) => (
          <Link key={s.label} href={s.link} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md transition group">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.Icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Revenue & Pending */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-red-700 text-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Total Platform Revenue</span>
          </div>
          <p className="text-3xl font-bold">LKR {stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-red-200 mt-1">from {stats.totalBookings} bookings</p>
        </div>

        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Pending Bookings</span>
          </div>
          <p className="text-3xl font-bold text-amber-700">{stats.pendingBookings}</p>
          <Link href="/admin/bookings" className="text-sm text-amber-600 hover:underline mt-1 inline-block">
            Review pending →
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
          <p className="font-semibold text-gray-900 mb-4">Quick Actions</p>
          <div className="space-y-2">
            {[
              { href: "/admin/users", label: "Manage Users" },
              { href: "/admin/properties", label: "Review Properties" },
              { href: "/admin/bookings", label: "View All Bookings" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <span>{a.label}</span>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings & Top Properties */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {stats.recentBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No bookings yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentBookings.map((b) => {
                const cfg = STATUS_COLOR[b.status];
                const Icon = STATUS_ICON[b.status];
                return (
                  <div key={b.id} className="flex items-center gap-3 p-4">
                    <img src={b.propertyImage} alt="" className="h-10 w-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{b.guestName}</p>
                      <p className="text-xs text-gray-500 truncate">{b.propertyTitle}</p>
                      <p className="text-xs text-gray-400">{formatDate(b.checkIn)} – {formatDate(b.checkOut)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg}`}>
                        <Icon className="h-3 w-3" />
                        {b.status}
                      </span>
                      <p className="text-xs font-bold text-gray-900 mt-0.5">LKR {b.total.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Properties */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Top Rated Properties</h2>
            <Link href="/admin/properties" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {topProperties.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-4">
                <span className="text-sm font-bold text-gray-400 w-5 flex-shrink-0">#{i + 1}</span>
                <img src={p.images[0]} alt="" className="h-10 w-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {p.city}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-3.5 w-3.5 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-800">{p.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{p.reviewCount} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
