"use client";

import { useEffect, useState } from "react";
import { Search, UserCheck, UserX, Shield, Building2, UserRound, Trash2, ChevronDown } from "lucide-react";
import { getUsers, saveUsers } from "@/lib/storage";
import type { User } from "@/lib/data";
import InitialAvatar from "@/components/InitialAvatar";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "traveler" | "host" | "admin">("all");

  useEffect(() => {
    async function loadUsers() {
      setUsers(await getUsers());
    }

    void loadUsers();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  async function toggleVerification(userId: string) {
    const updated = users.map((u) =>
      u.id === userId ? { ...u, isVerified: !u.isVerified } : u
    );
    await saveUsers(updated);
    setUsers(updated);
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure you want to remove this user?")) return;
    const updated = users.filter((u) => u.id !== userId);
    await saveUsers(updated);
    setUsers(updated);
  }

  const ROLE_ICONS: Record<string, React.ElementType> = {
    admin: Shield,
    host: Building2,
    traveler: UserRound,
  };
  const ROLE_COLORS: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    host: "bg-blue-100 text-blue-700",
    traveler: "bg-green-100 text-green-700",
  };

  const counts = {
    all: users.length,
    traveler: users.filter((u) => u.role === "traveler").length,
    host: users.filter((u) => u.role === "host").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage platform users, roles, and verification status.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["all", "traveler", "host", "admin"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`rounded-xl border p-3 text-left transition ${
              roleFilter === r ? "border-primary bg-red-50" : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <p className={`text-xl font-bold ${roleFilter === r ? "text-primary" : "text-gray-900"}`}>
              {counts[r]}
            </p>
            <p className={`text-xs font-medium capitalize ${roleFilter === r ? "text-primary" : "text-gray-500"}`}>
              {r === "all" ? "All Users" : r + "s"}
            </p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const RoleIcon = ROLE_ICONS[u.role];
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <InitialAvatar name={u.name} className="h-9 w-9 flex-shrink-0" textClassName="text-sm" />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                            <p className="text-xs text-gray-500 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                          <RoleIcon className="h-3.5 w-3.5" />
                          <span className="capitalize">{u.role}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{u.phone || "—"}</td>
                      <td className="px-5 py-4 text-gray-600">
                        {new Date(u.joinedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.isVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {u.isVerified ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                          {u.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleVerification(u.id)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                              u.isVerified
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                            }`}
                          >
                            {u.isVerified ? "Unverify" : "Verify"}
                          </button>
                          {u.role !== "admin" && (
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
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
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
