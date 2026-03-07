"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Building2, UserRound } from "lucide-react";

type Role = "traveler" | "host";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const initialRole = useMemo<Role>(() => {
    return searchParams.get("role") === "host" ? "host" : "traveler";
  }, [searchParams]);

  const [role, setRole] = useState<Role>(initialRole);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-600">
              Login as a traveler or host.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setRole("traveler")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                role === "traveler"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UserRound className="h-4 w-4" />
              Traveler
            </button>
            <button
              type="button"
              onClick={() => setRole("host")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                role === "host"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Host
            </button>
          </div>

          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <Lock className="h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Login as {role === "host" ? "Host" : "Traveler"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href={role === "host" ? "/signup?role=host" : "/signup"}
              className="font-semibold text-primary hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
