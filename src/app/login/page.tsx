"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Building2, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Role = "traveler" | "host";

const DEMO_CREDENTIALS = {
  traveler: { email: "traveler@tripfinder.lk", password: "Travel@2026" },
  host: { email: "saman@tripfinder.lk", password: "Host@2026" },
  admin: { email: "admin@tripfinder.lk", password: "Admin@2026" },
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  const initialRole = useMemo<Role>(() => {
    return searchParams.get("role") === "host" ? "host" : "traveler";
  }, [searchParams]);

  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "host") {
        router.push("/host/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to your TripFinder account</p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => {
                setRole("traveler");
                setError("");
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                role === "traveler" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UserRound className="h-4 w-4" />
              Traveler
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("host");
                setError("");
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                role === "host" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Host / Admin
            </button>
          </div>


          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 transition focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full bg-transparent text-sm outline-none"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 transition focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <Lock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 w-full bg-transparent text-sm outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : `Sign in as ${role === "host" ? "Host / Admin" : "Traveler"}`}
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
