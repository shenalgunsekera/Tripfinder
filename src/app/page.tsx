import { Sparkles, Zap, Shield, Heart } from "lucide-react";
import Hero from "@/components/Hero";
import Image from "next/image";
import HostCTA from "@/components/HostCTA";
import FeaturedProperties from "@/components/FeaturedProperties";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1 */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                AI Recommendations
              </h3>
              <p className="text-sm text-gray-600">
                Search with natural language and get personalized suggestions
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                Instant Booking
              </h3>
              <p className="text-sm text-gray-600">
                Book instantly without waiting for host approval
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                Secure Payments
              </h3>
              <p className="text-sm text-gray-600">
                Safe and encrypted payment processing
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                Verified Hosts
              </h3>
              <p className="text-sm text-gray-600">
                All properties verified for quality and safety
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Destinations */}
<section className="bg-white py-20">
  <div className="container">
    
    {/* Section Heading */}
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900">
        Popular Destinations
      </h2>
      <p className="mt-2 text-gray-600">
        Explore the most loved locations in Sri Lanka
      </p>
    </div>

    {/* Grid */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      
      {/* Card */}
      {[
        { name: "Colombo", properties: 45, image: "/images/colombo.jfif" },
        { name: "Galle", properties: 32, image: "/images/galle.jfif" },
        { name: "Ella", properties: 28, image: "/images/ella.jfif" },
        { name: "Bentota", properties: 38, image: "/images/bentota.jfif" },
      ].map((place, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl"
        >
          <div className="relative h-56 w-full">
            <Image
              src={place.image}
              alt={place.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Text */}
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-semibold">
              {place.name}
            </h3>
            <p className="text-sm text-gray-200">
              {place.properties} properties
            </p>
          </div>
        </div>
      ))}

    </div>
  </div>
</section>

<FeaturedProperties />
<HostCTA />
    </>
  );
}
