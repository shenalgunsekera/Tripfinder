"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, Lock, Building2, UserRound } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";

type Role = "traveler" | "host";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialRole = useMemo<Role>(() => {
    return searchParams.get("role") === "host" ? "host" : "traveler";
  }, [searchParams]);

  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Logged in:", userCredential.user);

      toast("Welcome back", {
        description: "Login successful. Preparing your dashboard.",
        style: {
          background: "linear-gradient(135deg,#22c55e,#16a34a)",
          color: "white",
          borderRadius: "16px",
          padding: "16px 20px",
        },
      });

      setTimeout(() => {
        router.push(role === "host" ? "/host-dashboard" : "/dashboard");
      }, 1200);

    } catch (error: any) {
      toast("Login failed", {
        description: error.message,
        style: {
          background: "#1f2937",
          color: "white",
          borderRadius: "16px",
        },
      });
    } finally {
      setLoading(false);
    }
  };

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

          {/* Role Switch */}
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setRole("traveler")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                role === "traveler"
                  ? "bg-white shadow-sm"
                  : "text-gray-600"
              }`}
            >
              <UserRound className="h-4 w-4" />
              Traveler
            </button>

            <button
              onClick={() => setRole("host")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                role === "host"
                  ? "bg-white shadow-sm"
                  : "text-gray-600"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Host
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <Mail className="h-4 w-4 text-gray-500" />

                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3">
                <Lock className="h-4 w-4 text-gray-500" />

                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
            >
              {loading
                ? "Logging in..."
                : `Login as ${role === "host" ? "Host" : "Traveler"}`}
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