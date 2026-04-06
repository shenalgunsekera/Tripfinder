import Link from "next/link";
import { MapPin, Sparkles, Users, Building2, Star, Heart, Shield, Zap } from "lucide-react";

const STATS = [
  { value: "500+", label: "Properties listed" },
  { value: "12+", label: "Cities across Sri Lanka" },
  { value: "2,000+", label: "Happy travellers" },
  { value: "4.9", label: "Average host rating" },
];

const VALUES = [
  {
    Icon: Heart,
    title: "Local first",
    desc: "We champion Sri Lankan hosts and help them share their culture, homes, and stories with the world.",
  },
  {
    Icon: Shield,
    title: "Trust & safety",
    desc: "Every listing is reviewed and verified. Guests and hosts can book with complete confidence.",
  },
  {
    Icon: Sparkles,
    title: "AI-powered discovery",
    desc: "Our AI understands natural language so travellers find exactly what they are looking for — faster.",
  },
  {
    Icon: Zap,
    title: "Effortless booking",
    desc: "From instant booking to flexible reservations, we make the process smooth for everyone.",
  },
];

const FOUNDERS = [
  {
    name: "S.A.DeS Gunasekera",
    role: "Co-Founder & CEO",
    bio: "Passionate about connecting travellers with authentic Sri Lankan experiences. Leads product vision, growth strategy, and host partnerships across the island.",
    location: "Colombo, Sri Lanka",
  },
  {
    name: "A.K.D. Sihilel Abhishek",
    role: "Co-Founder & CTO",
    bio: "Engineer and innovator behind TripFinder's AI search engine and platform infrastructure. Believes technology should make travel feel personal, not transactional.",
    location: "Colombo, Sri Lanka",
  },
];


export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-24 pt-32 text-white md:px-6 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.12),_transparent_30%)]" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              <MapPin className="h-3.5 w-3.5 text-red-400" />
              About TripFinder
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
              We are making Sri Lanka easier to explore, one stay at a time.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              TripFinder was built by two Sri Lankans who wanted a smarter, more personal way to discover the island&apos;s most remarkable places to stay. No noise — just the right home for every journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/properties"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Explore properties
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-10 px-4 md:px-6">
        <div className="container relative z-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] text-center"
              >
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white px-4 py-20 md:px-6 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our mission</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Unlock Sri Lanka&apos;s hidden gems for every traveller.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-500">
              Sri Lanka is one of the world&apos;s most diverse destinations — pristine beaches, misty highlands, ancient cities, and vibrant culture all within a few hours of each other. Yet finding the perfect, authentic place to stay has always been harder than it should be.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-500">
              TripFinder changes that. We combine verified local listings with AI-powered search so every traveller — whether discovering Ella&apos;s tea valleys or Galle&apos;s colonial fort — lands exactly where they belong.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5 hover:border-slate-200 hover:shadow-md transition-all"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <Icon className="h-4.5 w-4.5 text-primary h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="bg-white px-4 py-20 md:px-6 md:py-28">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">The team</p>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Meet the founders</h2>
            <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Two builders from Sri Lanka who turned a simple idea — travel should feel personal — into a platform used by thousands.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
            {FOUNDERS.map(({ name, role, bio, location }) => (
              <div
                key={name}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] transition-all"
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                  <span className="mt-1 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-primary">
                    {role}
                  </span>
                  <p className="mt-4 text-sm leading-6 text-slate-500">{bio}</p>
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 px-4 py-20 md:px-6 md:py-28">
        <div className="container">
          <div className="relative overflow-hidden mx-auto max-w-4xl rounded-3xl bg-slate-900 px-8 py-16 md:px-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-slate-900 to-slate-900 pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-6">
                <Star className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs font-medium uppercase tracking-wider text-white/70">Start exploring</span>
              </div>
              <h2 className="text-2xl font-bold text-white md:text-3xl mb-4">
                Your perfect Sri Lanka stay is waiting.
              </h2>
              <p className="text-white/60 mb-10 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                Browse hundreds of verified properties or let our AI find the right one for you in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                <Link
                  href="/ai-search"
                  className="flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  Try AI Search
                </Link>
                <Link
                  href="/properties"
                  className="flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-medium text-white/80 hover:bg-white/5 transition"
                >
                  <Building2 className="h-4 w-4" />
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
