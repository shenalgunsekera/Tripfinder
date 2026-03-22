"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Shield, Star, CreditCard, Smartphone,
  Building, AlertCircle, Check, Lock,
} from "lucide-react";
import { getPropertyBySlug, addBooking } from "@/lib/storage";
import type { Property, Booking } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import InitialAvatar from "@/components/InitialAvatar";

const PAYMENT_METHODS = [
  { id: "visa", label: "Visa / Mastercard", icon: CreditCard },
  { id: "mobile", label: "Dialog / Mobitel (Mobile Pay)", icon: Smartphone },
  { id: "bank", label: "Bank Transfer", icon: Building },
];

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = Number(searchParams.get("guests") || 1);
  const nights = Number(searchParams.get("nights") || 1);

  useEffect(() => {
    async function loadProperty() {
      if (!user) {
        router.push("/login");
        return;
      }

      const foundProperty = await getPropertyBySlug(slug);
      if (!foundProperty) {
        router.push("/properties");
        return;
      }

      setProperty(foundProperty);
    }

    void loadProperty();
  }, [slug, user, router]);

  if (!property || !user) return null;

  const subtotal = nights * property.price;
  const serviceFee = Math.round(subtotal * 0.075);
  const total = subtotal + serviceFee;

  function formatCardNumber(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(val: string) {
    return val.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");
  }

  async function handleConfirm() {
    setError("");
    if (!agreed) { setError("Please accept the terms and conditions."); return; }

    if (paymentMethod === "visa") {
      if (cardNumber.replace(/\s/g, "").length < 16) { setError("Please enter a valid 16-digit card number."); return; }
      if (!cardName.trim()) { setError("Please enter the name on card."); return; }
      if (cardExpiry.replace("/", "").length < 4) { setError("Please enter a valid expiry date."); return; }
      if (cardCvv.length < 3) { setError("Please enter a valid CVV."); return; }
    }

    setLoading(true);
    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 1800));

    const p = property!;
    const u = user!;
    const booking: Booking = {
      id: `book-${Date.now()}`,
      propertyId: p.id,
      propertySlug: p.slug,
      propertyTitle: p.title,
      propertyImage: p.images[0],
      propertyLocation: p.location,
      guestId: u.id,
      guestName: u.name,
      guestEmail: u.email,
      hostId: p.hostId,
      hostName: p.hostName,
      checkIn,
      checkOut,
      guests,
      nights,
      pricePerNight: p.price,
      subtotal,
      serviceFee,
      total,
      status: p.instantBook ? "confirmed" : "pending",
      type: p.instantBook ? "instant" : "reservation",
      paymentMethod: paymentMethod === "visa" ? "Visa Card" : paymentMethod === "mobile" ? "Mobile Pay" : "Bank Transfer",
      createdAt: new Date().toISOString().split("T")[0],
      specialRequests: specialRequests.trim(),
    };

    await addBooking(booking);
    setLoading(false);

    const params = new URLSearchParams({
      bookingId: booking.id,
      status: booking.status,
    });
    router.push(`/booking/confirmation?${params.toString()}`);
  }

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/properties/${slug}`}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to property
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {property.instantBook ? "Confirm Booking" : "Request to Book"}
          </h1>
          {!property.instantBook && (
            <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              This property requires host approval. You won&apos;t be charged until approved.
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* LEFT — Payment & Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Trip Details Summary */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Your trip</h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Check-in</p>
                  <p className="font-semibold text-gray-900">{formatDate(checkIn)}</p>
                  <p className="text-gray-500">{property.checkIn}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Check-out</p>
                  <p className="font-semibold text-gray-900">{formatDate(checkOut)}</p>
                  <p className="text-gray-500">{property.checkOut}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Guests</p>
                  <p className="font-semibold text-gray-900">{guests} guest{guests > 1 ? "s" : ""}</p>
                  <p className="text-gray-500">{nights} night{nights > 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Guest Information</h2>
              <div className="flex items-center gap-3">
                <InitialAvatar name={user.name} className="h-12 w-12" textClassName="text-base" />
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-2">Special Requests</h2>
              <p className="text-sm text-gray-500 mb-3">Let the host know if you have any special needs (optional)</p>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Late check-in, airport pick-up, dietary requirements..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>

              <div className="space-y-3 mb-5">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                        paymentMethod === m.id ? "border-primary bg-red-50" : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                        className="accent-primary"
                      />
                      <Icon className={`h-5 w-5 ${paymentMethod === m.id ? "text-primary" : "text-gray-500"}`} />
                      <span className={`text-sm font-medium ${paymentMethod === m.id ? "text-primary" : "text-gray-700"}`}>
                        {m.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {paymentMethod === "visa" && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono"
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Full name as on card"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "mobile" && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                  After confirming, you will receive an SMS to your registered mobile number to complete the payment via Dialog/Mobitel pay.
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 space-y-1">
                  <p className="font-semibold">Bank Transfer Details:</p>
                  <p>Bank: Commercial Bank of Ceylon</p>
                  <p>Account Name: TripFinder (Pvt) Ltd</p>
                  <p>Account No: 1234567890</p>
                  <p>Branch: Colombo Fort</p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary flex-shrink-0"
              />
              <span className="text-sm text-gray-600">
                I agree to TripFinder&apos;s{" "}
                <Link href="#" className="text-primary hover:underline">Terms of Service</Link>,{" "}
                <Link href="#" className="text-primary hover:underline">Cancellation Policy</Link>, and{" "}
                <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            {/* Submit */}
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full rounded-xl bg-primary py-4 text-base font-bold text-white hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing payment…
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  {property.instantBook ? `Pay LKR ${total.toLocaleString()}` : "Request Booking"}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              256-bit SSL encryption · Payments secured by TripFinder
            </div>
          </div>

          {/* RIGHT — Property Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <span className="text-xs font-semibold bg-red-100 text-primary px-2 py-0.5 rounded-full">
                    {property.type}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-2 leading-snug">{property.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{property.location}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{property.rating}</span>
                    <span className="text-sm text-gray-400">({property.reviewCount})</span>
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4 space-y-2.5 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>LKR {property.price.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                      <span>LKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service fee</span>
                      <span>LKR {serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                      <span>Total (LKR)</span>
                      <span>LKR {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                    <Check className="h-3.5 w-3.5 flex-shrink-0" />
                    {property.instantBook ? "Instant confirmation upon payment" : "Awaiting host approval after request"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
