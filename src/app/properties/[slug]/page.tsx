"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star, MapPin, Users, Bed, Bath, Wifi, Check, ChevronLeft,
  Zap, Calendar, Shield, Award, MessageSquare, Heart,
  Share2, AlertCircle, Home, Clock,
} from "lucide-react";
import { getPropertyBySlug } from "@/lib/storage";
import type { Property } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import InitialAvatar from "@/components/InitialAvatar";

export default function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      const foundProperty = await getPropertyBySlug(slug);
      if (foundProperty) {
        setProperty(foundProperty);
      }
    }

    void loadProperty();
  }, [slug]);

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Home className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Property not found</h2>
          <p className="text-sm text-gray-500 mt-1">This listing may have been removed or is unavailable.</p>
          <Link href="/properties" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  // Calculate nights & cost
  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
      : 0;
  const subtotal = nights * property.price;
  const serviceFee = Math.round(subtotal * 0.075);
  const total = subtotal + serviceFee;

  function handleBook() {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    const effectiveMin = property!.instantBook ? 1 : property!.minNights;
    if (nights < effectiveMin) {
      alert(`Minimum stay is ${effectiveMin} night(s).`);
      return;
    }
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guestCount),
      nights: String(nights),
    });
    router.push(`/booking/${property!.slug}?${params.toString()}`);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/properties" className="flex items-center gap-1 hover:text-primary transition">
          <ChevronLeft className="h-4 w-4" />
          Back to listings
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{property.city}</span>
      </div>

      {/* Title Row */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-900">{property.rating}</span>
              <span>({property.reviewCount} reviews)</span>
            </div>
            {property.isSuperhost && (
              <span className="flex items-center gap-1 text-gray-700">
                <Award className="h-4 w-4 text-primary" /> Superhost
              </span>
            )}
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{property.address}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              saved ? "border-primary bg-red-50 text-primary" : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
            {saved ? "Saved" : "Save"}
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-10">
        <div
          className="col-span-4 md:col-span-2 row-span-2 h-72 md:h-96 cursor-pointer"
          onClick={() => setActiveImage(0)}
        >
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover hover:brightness-95 transition"
          />
        </div>
        {property.images.slice(1, 4).map((img, i) => (
          <div
            key={i}
            className="hidden md:block h-48 cursor-pointer"
            onClick={() => setActiveImage(i + 1)}
          >
            <img
              src={img}
              alt={`${property.title} ${i + 2}`}
              className="w-full h-full object-cover hover:brightness-95 transition"
            />
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-10">

          {/* Property Info */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-red-100 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {property.type}
              </span>
              {property.instantBook && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Zap className="h-3.5 w-3.5" /> Instant Book
                </span>
              )}
              {property.isVerified && (
                <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Shield className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-6 text-gray-700">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>{property.guests} guests max</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-primary" />
                <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-primary" />
                <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Min {property.minNights} night{property.minNights !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">House Rules</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {property.rules.map((rule) => (
                <div key={rule} className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  {rule}
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                Check-in: {property.checkIn}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                Check-out: {property.checkOut}
              </div>
            </div>
          </div>

          {/* Host */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Hosted by {property.hostName}
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <InitialAvatar name={property.hostName} className="h-16 w-16 border-2 border-primary" textClassName="text-xl" />
                <div>
                  <p className="font-semibold text-gray-900">{property.hostName}</p>
                  <p className="text-sm text-gray-500">Host since {property.hostJoined}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      {property.hostRating} rating
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Responds {property.hostResponseTime}
                    </span>
                    {property.isSuperhost && (
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-yellow-500" />
                        Superhost
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-xl border border-primary px-5 py-2.5 text-sm font-medium text-primary hover:bg-red-50 transition">
                <MessageSquare className="h-4 w-4" />
                Contact Host
              </button>
            </div>
          </div>

          {/* Reviews */}
          {property.reviews.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Guest Reviews</h2>
                <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-sm">{property.rating}</span>
                  <span className="text-gray-500 text-sm">({property.reviewCount})</span>
                </div>
              </div>
              <div className="space-y-6">
                {property.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex items-start gap-3 mb-3">
                      <InitialAvatar name={review.userName} className="h-10 w-10" textClassName="text-sm" />
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{review.userName}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-6">
              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  LKR {property.price.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm">/ night</span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 rounded-xl border border-gray-300 overflow-hidden mb-3">
                <div className="border-r border-gray-300 p-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value >= checkOut) setCheckOut("");
                    }}
                    className="w-full text-sm text-gray-900 bg-transparent outline-none cursor-pointer"
                  />
                </div>
                <div className="p-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-sm text-gray-900 bg-transparent outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="rounded-xl border border-gray-300 p-3 mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Guests</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full text-sm text-gray-900 bg-transparent outline-none cursor-pointer"
                >
                  {Array.from({ length: property.guests }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} guest{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Breakdown */}
              {nights > 0 && (
                <div className="border-t border-gray-100 pt-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>LKR {property.price.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                    <span>LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Service fee (7.5%)</span>
                    <span>LKR {serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <span>LKR {total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBook}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:opacity-90 active:opacity-80 transition"
              >
                {property.instantBook ? "Reserve Instantly" : "Request to Book"}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                {property.instantBook ? "You won't be charged yet" : "Booking requires host approval"}
              </p>

              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
                <Shield className="h-3.5 w-3.5 text-green-500" />
                Secure & encrypted payments
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
