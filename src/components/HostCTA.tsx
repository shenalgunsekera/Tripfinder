"use client";

import Link from "next/link";
import { TrendingUp, Shield, MessageSquare, Home, MapPin, DollarSign, Star } from "lucide-react";

const STATS = [
  { Icon: Home, label: "Active Hosts", value: "500+" },
  { Icon: MapPin, label: "Cities Covered", value: "25+" },
  { Icon: DollarSign, label: "Avg. Monthly Earnings", value: "LKR 85K" },
  { Icon: Star, label: "Guest Satisfaction", value: "4.8 / 5" },
];

const BENEFITS = [
  { Icon: TrendingUp, text: "Earn LKR 50,000 – 200,000 per month from your property" },
  { Icon: Shield, text: "Full booking protection and secure payment processing" },
  { Icon: MessageSquare, text: "24/7 dedicated host support from the TripFinder team" },
];

export default function HostCTA() {
  return (
    <section id="become-a-host" className="w-full bg-gray-900 py-20 md:py-28 scroll-mt-20">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-4">
              For Property Owners
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl leading-tight mb-5">
              Share your property,<br />earn on your terms.
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              Join hundreds of hosts across Sri Lanka earning steady income from their properties while giving travellers a genuine local experience.
            </p>

            <ul className="space-y-4 mb-10">
              {BENEFITS.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <Icon className="h-4 w-4 text-red-400" />
                  </div>
                  <span className="text-sm text-gray-300 leading-relaxed pt-1">{text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup?role=host"
                className="inline-flex items-center justify-center bg-primary text-white font-semibold px-7 py-3 rounded-xl hover:opacity-90 transition text-sm"
              >
                Start Hosting Today
              </Link>
              <Link
                href="/host/dashboard"
                className="inline-flex items-center justify-center border border-white/15 text-white/80 font-medium px-7 py-3 rounded-xl hover:bg-white/5 transition text-sm"
              >
                Host Dashboard
              </Link>
            </div>
          </div>

          {/* Right — Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-900/40 mb-4">
                  <Icon className="h-4 w-4 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
