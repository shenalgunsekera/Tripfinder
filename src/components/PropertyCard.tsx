"use client";

import Link from "next/link";

interface PropertyCardProps {
  title: string;
  location: string;
  type: string;
  guests: number;
  price: number;
  rating: number;
  reviews: number;
  slug: string; // ✅ ADDED
  image?: string;
  instantBook?: boolean;
}

export default function PropertyCard({
  title,
  location,
  type,
  guests,
  price,
  rating,
  reviews,
  slug, // ✅ ADDED
  image,
  instantBook = false,
}: PropertyCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border">

      {/* Image Section */}
      <div className="relative h-56 bg-gray-200 flex items-center justify-center">

        {instantBook && (
          <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Instant Book
          </span>
        )}

        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">Image</span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">

        {/* Title + Rating */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-900">
            {title}
          </h3>
          <span className="text-sm font-medium text-yellow-500">
            ⭐ {rating}
          </span>
        </div>

        {/* Location */}
        <p className="text-sm text-gray-500 mt-1">
          {location}
        </p>

        {/* Type & Guests */}
        <div className="flex items-center gap-4 mt-3 text-sm">
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
            {type}
          </span>
          <span className="text-gray-500">
            {guests} guests
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex justify-between items-center border-t pt-4">
          <div>
            <span className="font-bold text-lg">
              LKR {price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          <span className="text-sm text-gray-400">
            {reviews} reviews
          </span>
        </div>

        {/* View Details Button */}
        <Link
          href={`/properties/${slug}`}
          className="mt-4 inline-block bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}
