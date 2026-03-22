"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, X, AlertCircle, CheckCircle2, Upload, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addProperty } from "@/lib/storage";
import type { Property, PropertyType } from "@/lib/data";
import { PROPERTY_TYPES, CITIES, AMENITY_LIST } from "@/lib/data";

const STEPS = ["Basic Info", "Details", "Amenities", "Pricing", "Review"] as const;

export default function NewPropertyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PropertyType>("Villa");
  const [city, setCity] = useState(CITIES[1]);
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [minNights, setMinNights] = useState(1);
  const [price, setPrice] = useState(10000);
  const [instantBook, setInstantBook] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(["WiFi", "Air Conditioning"]);
  const [checkIn, setCheckIn] = useState("2:00 PM");
  const [checkOut, setCheckOut] = useState("11:00 AM");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && user.role !== "host" && user.role !== "admin") router.push("/dashboard");
  }, [user, loading, router]);

  if (loading || !user) return null;

  function toggleAmenity(a: string) {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  function addImage() {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl("");
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  function validateStep(): boolean {
    setError("");
    if (step === 0) {
      if (!title.trim()) { setError("Please enter a property title."); return false; }
      if (!description.trim() || description.length < 50) { setError("Please write a description of at least 50 characters."); return false; }
      if (!address.trim()) { setError("Please enter the property address."); return false; }
    }
    if (step === 3) {
      if (price < 1000) { setError("Minimum price is LKR 1,000 per night."); return false; }
    }
    return true;
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setSubmitting(true);

    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50) + "-" + Date.now();

    const defaultImages = [
      `https://picsum.photos/seed/${slug}/800/600`,
      `https://picsum.photos/seed/${slug}2/800/600`,
    ];

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      slug,
      title: title.trim(),
      description: description.trim(),
      type,
      location: city,
      city,
      address: address.trim(),
      price,
      guests,
      bedrooms,
      bathrooms,
      rating: 0,
      reviewCount: 0,
      instantBook,
      hostId: user!.id,
      hostName: user!.name,
      hostAvatar: user!.avatar,
      hostJoined: new Date().getFullYear().toString(),
      hostRating: 5.0,
      hostResponseTime: "within 1 hour",
      isSuperhost: false,
      images: images.length > 0 ? images : defaultImages,
      amenities: selectedAmenities,
      rules: ["No smoking", "No parties or events"],
      checkIn,
      checkOut,
      minNights,
      isActive: true,
      isVerified: false,
      coordinates: { lat: 7.8731, lng: 80.7718 },
      reviews: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    await addProperty(newProperty);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    router.push("/host/dashboard?tab=properties");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/host/dashboard" className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition mb-4">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">List Your Property</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to get your property listed on TripFinder.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                    i < step ? "bg-green-500 text-white" :
                    i === step ? "bg-primary text-white" :
                    "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-1 font-medium hidden sm:block ${i === step ? "text-primary" : "text-gray-400"}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-green-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 0 — Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-900 text-lg">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Luxury Beach Villa – Bentota"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  maxLength={80}
                />
                <p className="text-xs text-gray-400 mt-1">{title.length}/80 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property, its unique features, what guests can expect, nearby attractions..."
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">{description.length} characters (min 50)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  >
                    {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  >
                    {CITIES.slice(1).map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, District, Sri Lanka"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 1 — Details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-900 text-lg">Property Details</h2>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Bedrooms", value: bedrooms, set: setBedrooms, min: 1, max: 20 },
                  { label: "Bathrooms", value: bathrooms, set: setBathrooms, min: 1, max: 20 },
                  { label: "Max Guests", value: guests, set: setGuests, min: 1, max: 30 },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => f.value > f.min && f.set(f.value - 1)}
                        className="px-3 py-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 transition text-lg font-bold"
                      >
                        –
                      </button>
                      <span className="flex-1 text-center text-sm font-semibold">{f.value}</span>
                      <button
                        type="button"
                        onClick={() => f.value < f.max && f.set(f.value + 1)}
                        className="px-3 py-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 transition text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                  <select
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  >
                    {["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "Flexible"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                  <select
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  >
                    {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "Flexible"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stay (nights)</label>
                <input
                  type="number"
                  value={minNights}
                  min={1}
                  max={30}
                  onChange={(e) => setMinNights(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Images</label>
                <p className="text-xs text-gray-500 mb-2">Add image URLs (e.g., from your own hosting or picsum.photos). Leave empty to use placeholder images.</p>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt={`Image ${i + 1}`} className="h-20 w-28 rounded-lg object-cover border border-gray-200" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2 — Amenities */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-900 text-lg">Amenities</h2>
              <p className="text-sm text-gray-500">Select all amenities your property offers.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AMENITY_LIST.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium text-left transition ${
                      selectedAmenities.includes(a)
                        ? "border-primary bg-red-50 text-primary"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded flex items-center justify-center flex-shrink-0 ${
                      selectedAmenities.includes(a) ? "bg-primary" : "border border-gray-300"
                    }`}>
                      {selectedAmenities.includes(a) && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                    </div>
                    {a}
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-400">{selectedAmenities.length} amenities selected</p>
            </div>
          )}

          {/* Step 3 — Pricing */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-900 text-lg">Pricing & Booking</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night (LKR)</label>
                <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition">
                  <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm font-medium border-r border-gray-300">LKR</span>
                  <input
                    type="number"
                    value={price}
                    min={1000}
                    step={500}
                    onChange={(e) => setPrice(Math.max(1000, Number(e.target.value)))}
                    className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none font-semibold"
                  />
                  <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-l border-gray-300">/night</span>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[5000, 10000, 15000, 25000].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrice(p)}
                      className={`rounded-lg border py-1.5 text-xs font-medium transition ${
                        price === p ? "border-primary bg-red-50 text-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Booking Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInstantBook(true)}
                    className={`rounded-xl border p-4 text-left transition ${
                      instantBook ? "border-primary bg-red-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className={`h-4 w-4 ${instantBook ? "text-primary" : "text-gray-400"}`} />
                      <span className={`font-semibold text-sm ${instantBook ? "text-primary" : "text-gray-700"}`}>
                        Instant Book
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Guests can book immediately without waiting for your approval.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstantBook(false)}
                    className={`rounded-xl border p-4 text-left transition ${
                      !instantBook ? "border-primary bg-red-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className={`h-4 w-4 ${!instantBook ? "text-primary" : "text-gray-400"}`} />
                      <span className={`font-semibold text-sm ${!instantBook ? "text-primary" : "text-gray-700"}`}>
                        Request Only
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">You review and approve every booking request manually.</p>
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                <p className="font-semibold mb-1">Estimated Earnings</p>
                <p>At LKR {price.toLocaleString()}/night with 15 nights booked monthly:</p>
                <p className="text-lg font-bold mt-1 text-blue-800">
                  LKR {(price * 15 * 0.925).toLocaleString()}/month
                </p>
                <p className="text-xs text-blue-500 mt-0.5">(after 7.5% platform fee)</p>
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-bold text-gray-900 text-lg">Review Your Listing</h2>
              <p className="text-sm text-gray-500">Please review your property details before submitting.</p>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <img
                  src={images[0] || `https://picsum.photos/seed/${Date.now()}/600/300`}
                  alt="Property preview"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{title || "Untitled Property"}</p>
                    <p className="text-sm text-gray-500">{city} · {address}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-red-100 text-primary px-2 py-0.5 rounded-full text-xs font-medium">{type}</span>
                    <span className="text-gray-600">{guests} guests · {bedrooms} bed · {bathrooms} bath</span>
                    {instantBook && (
                      <span className="flex items-center gap-1 text-green-700 text-xs">
                        <Zap className="h-3 w-3" /> Instant Book
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">LKR {price.toLocaleString()}<span className="text-gray-500 text-sm font-normal">/night</span></p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Amenities</p>
                    <p className="text-sm text-gray-600">{selectedAmenities.join(", ")}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                ⚠ Your listing will be reviewed by our team before going live. This usually takes 1-2 business days.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => { setError(""); setStep(step - 1); }}
                className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => { if (validateStep()) setStep(step + 1); }}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : "Submit Listing"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
