"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Building2, Lock, Mail, Phone, User, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Role = "traveler" | "host";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signup } = useAuth();

  const initialRole = useMemo<Role>(() => {
    return searchParams.get("role") === "host" ? "host" : "traveler";
  }, [searchParams]);

  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        role,
      });

      router.push(role === "host" ? "/host/dashboard" : "/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-1 text-sm text-gray-500">Join TripFinder today and start planning your next stay.</p>
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
              Host
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
              <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <User className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="h-11 w-full bg-transparent text-sm outline-none"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <Mail className="h-4 w-4 text-gray-500" />
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
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone number</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 71 234 5678"
                  className="h-11 w-full bg-transparent text-sm outline-none"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <Lock className="h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="h-11 w-full bg-transparent text-sm outline-none"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : `Sign up as ${role === "host" ? "Host" : "Traveler"}`}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href={role === "host" ? "/login?role=host" : "/login"}
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
