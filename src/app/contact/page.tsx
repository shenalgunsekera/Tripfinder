"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock3, Mail, MapPin, MessageSquare, Phone, ShieldCheck, Sparkles } from "lucide-react";

const CONTACT_CHANNELS = [
  {
    Icon: Mail,
    title: "Email support",
    value: "support@tripfinder.lk",
    detail: "Best for booking questions, account access, and host onboarding.",
    href: "mailto:support@tripfinder.lk",
  },
  {
    Icon: Phone,
    title: "Call our team",
    value: "+94 11 234 5678",
    detail: "Available for urgent booking help and same-day travel support.",
    href: "tel:+94112345678",
  },
  {
    Icon: MapPin,
    title: "Visit the office",
    value: "Level 12, Colombo Fort, Sri Lanka",
    detail: "For partnerships, business meetings, and scheduled consultations.",
    href: "https://maps.google.com/?q=Colombo+Fort+Sri+Lanka",
  },
];

const SUPPORT_POINTS = [
  {
    Icon: Clock3,
    title: "Fast replies",
    desc: "Most guest inquiries are answered within 2 hours during business hours.",
  },
  {
    Icon: ShieldCheck,
    title: "Trusted assistance",
    desc: "We help with cancellations, host disputes, and verified listing issues.",
  },
  {
    Icon: Sparkles,
    title: "Host growth help",
    desc: "Need help setting up a listing or improving visibility? We can guide you.",
  },
];

const FAQS = [
  {
    question: "How quickly will TripFinder respond?",
    answer: "General inquiries are usually answered the same day. Urgent booking issues are prioritized for the fastest possible follow-up.",
  },
  {
    question: "Can hosts contact support about new listings?",
    answer: "Yes. We support onboarding, listing approval questions, pricing strategy, and photo or content guidance for hosts.",
  },
  {
    question: "Do you offer help with booking changes?",
    answer: "Yes. If your plans changed, contact us with your booking details and we will help coordinate the next steps.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "Booking support",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setForm({
      name: "",
      email: "",
      topic: "Booking support",
      message: "",
    });
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-32 text-white md:px-6 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.18),_transparent_30%)]" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              <MessageSquare className="h-3.5 w-3.5 text-red-400" />
              Contact TripFinder
            </div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
              Friendly support for guests, hosts, and travel partners.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Whether you need booking help, listing guidance, or a quick answer before your next trip, our team is here to keep things moving.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="mailto:support@tripfinder.lk"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Email support
              </Link>
              <Link
                href="/properties"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-medium text-white/85 transition hover:bg-white/5"
              >
                Explore stays
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-10 px-4 md:px-6">
        <div className="container relative z-20">
          <div className="grid gap-5 lg:grid-cols-3">
            {CONTACT_CHANNELS.map(({ Icon, title, value, detail, href }) => (
              <Link
                key={title}
                href={href}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm font-medium text-slate-700">{value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 md:px-6">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Send a message</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Tell us what you need.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
              Share a few details and our team will point you to the right person as quickly as possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-red-100"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-red-100"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Topic</span>
                <select
                  value={form.topic}
                  onChange={(event) => updateField("topic", event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-red-100"
                >
                  <option>Booking support</option>
                  <option>Host onboarding</option>
                  <option>Payment question</option>
                  <option>Partnership inquiry</option>
                  <option>General feedback</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Message</span>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-red-100"
                  placeholder="Tell us how we can help."
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Send inquiry
                </button>
                <p className="text-sm text-slate-500">Average reply time: within 2 business hours.</p>
              </div>

              {submitted && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Thanks for reaching out. Your message has been captured locally for this demo and the form is ready for backend wiring whenever you want.
                </div>
              )}
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">Why contact us</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Real support, not a maze.</h2>
              <div className="mt-8 space-y-5">
                {SUPPORT_POINTS.map(({ Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="h-5 w-5 text-red-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Common questions</p>
              <div className="mt-6 space-y-5">
                {FAQS.map(({ question, answer }) => (
                  <div key={question} className="rounded-2xl bg-slate-50 p-5">
                    <h3 className="text-sm font-semibold text-slate-900">{question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
