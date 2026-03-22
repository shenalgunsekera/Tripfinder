"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, Calendar, MapPin, Download, Share2, FileX } from "lucide-react";
import { getBookings } from "@/lib/storage";
import type { Booking } from "@/lib/data";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function loadBooking() {
      if (bookingId) {
        const all = await getBookings();
        const found = all.find((b) => b.id === bookingId);
        setBooking(found || null);
      }
    }

    void loadBooking();
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <FileX className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-800">Booking not found</h2>
          <p className="text-sm text-gray-500 mt-1">This booking may have expired or doesn't exist.</p>
          <Link href="/dashboard" className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-xl mx-auto px-4">
        {/* Status Banner */}
        <div className={`rounded-2xl p-8 text-center mb-6 ${isConfirmed ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
          <div className="flex justify-center mb-4">
            {isConfirmed ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            )}
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isConfirmed ? "text-green-800" : "text-amber-800"}`}>
            {isConfirmed ? "Booking Confirmed!" : "Request Sent!"}
          </h1>
          <p className={`text-sm ${isConfirmed ? "text-green-700" : "text-amber-700"}`}>
            {isConfirmed
              ? "Your reservation is confirmed. Get ready for an amazing stay!"
              : "Your booking request has been sent to the host. We'll notify you once approved."}
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden mb-6">
          {/* Property Image */}
          <img
            src={booking.propertyImage}
            alt={booking.propertyTitle}
            className="w-full h-48 object-cover"
          />

          <div className="p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{booking.propertyTitle}</h2>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {booking.propertyLocation}
                </div>
              </div>
              <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isConfirmed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>
                {booking.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm">
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold uppercase">Check-in</span>
                </div>
                <p className="font-semibold text-gray-900">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold uppercase">Check-out</span>
                </div>
                <p className="font-semibold text-gray-900">{formatDate(booking.checkOut)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Guests</p>
                <p className="font-semibold text-gray-900">{booking.guests} guest{booking.guests > 1 ? "s" : ""}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Duration</p>
                <p className="font-semibold text-gray-900">{booking.nights} night{booking.nights > 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>LKR {booking.pricePerNight.toLocaleString()} × {booking.nights} nights</span>
                <span>LKR {booking.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service fee</span>
                <span>LKR {booking.serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                <span>Total Paid</span>
                <span>LKR {booking.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Booking Meta */}
            <div className="border-t border-gray-100 mt-4 pt-4 grid grid-cols-2 gap-3 text-xs text-gray-500">
              <div>
                <span className="font-semibold text-gray-700">Booking ID:</span>
                <span className="ml-1 font-mono">{booking.id}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Payment:</span>
                <span className="ml-1">{booking.paymentMethod}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Host:</span>
                <span className="ml-1">{booking.hostName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Type:</span>
                <span className="ml-1 capitalize">{booking.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <Download className="h-4 w-4" />
            Download Receipt
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition"
          >
            View My Bookings
          </Link>
          <Link
            href="/properties"
            className="flex-1 rounded-xl border border-gray-300 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Explore More
          </Link>
        </div>

        {!isConfirmed && (
          <p className="text-center text-xs text-gray-500 mt-4">
            You will receive an email notification when the host responds to your request.
          </p>
        )}
      </div>
    </div>
  );
}
