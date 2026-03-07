"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Building2, UserRound, User } from "lucide-react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

type Role = "traveler" | "host";

export default function SignupPage() {
  const searchParams = useSearchParams();

  const initialRole = useMemo<Role>(() => {
    return searchParams.get("role") === "host" ? "host" : "traveler";
  }, [searchParams]);

  const [role, setRole] = useState<Role>(initialRole);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("User created:", userCredential.user);

      alert("Account created successfully!");

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign up as a traveler or host.
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

          {/* FORM */}
          <form onSubmit={handleSignup} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <User className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <Lock className="h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* HOST OPTION */}
            {role === "host" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Hosting type
                </label>
                <select className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-700 outline-none">
                  <option>Individual Host</option>
                  <option>Property Manager</option>
                  <option>Company</option>
                </select>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {loading
                ? "Creating account..."
                : `Sign up as ${role === "host" ? "Host" : "Traveler"}`}
            </button>

          </form>

          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href={role === "host" ? "/login?role=host" : "/login"}
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}