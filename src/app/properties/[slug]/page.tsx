import {
  Wifi,
  Waves,
  Utensils,
  Car,
  Snowflake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

interface PropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Amenity {
  label: string;
  icon: LucideIcon;
}

const amenities: Amenity[] = [
  { label: "WiFi", icon: Wifi },
  { label: "Beach Access", icon: ShieldCheck },
  { label: "Kitchen", icon: Utensils },
  { label: "Pool", icon: Waves },
  { label: "Air Conditioning", icon: Snowflake },
  { label: "Parking", icon: Car },
];

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold capitalize">
          {slug.replaceAll("-", " ")}
        </h1>
        <p className="text-gray-500 mt-2">
          ⭐ 4.9 (124 reviews) · Bentota Beach, Sri Lanka
        </p>
      </div>

      {/* Layout Grid */}
      <div className="grid lg:grid-cols-3 gap-12">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-10">

          {/* Gallery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 h-96 bg-gray-200 rounded-xl" />
            <div className="h-48 bg-gray-200 rounded-xl" />
            <div className="h-48 bg-gray-200 rounded-xl" />
          </div>

          {/* Property Info */}
          <div className="border-b pb-8">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
              Villa
            </span>

            <div className="flex gap-6 mt-4 text-gray-600">
              <span>8 guests</span>
              <span>4 bedrooms</span>
              <span>3 bathrooms</span>
            </div>
          </div>

          {/* About */}
          <div className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-4">
              About this property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Experience ultimate luxury in this stunning beachfront villa
              with private pool and direct beach access.
            </p>
          </div>

          {/* Amenities */}
          <div className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-6">
              Amenities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {amenities.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 group"
                  >
                    <Icon className="w-5 h-5 text-red-600 group-hover:scale-110 transition" />
                    <span className="text-gray-700 group-hover:text-black transition">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Host Section */}
          <div className="pt-8">
            <h2 className="text-xl font-semibold mb-6">
              Hosted by Saman Perera
            </h2>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  S
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    Saman Perera
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Joined in 2020
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span>⭐ 4.9 Host Rating</span>
                    <span>💬 Responds within 1 hour</span>
                    <span>🏅 Superhost</span>
                  </div>
                </div>
              </div>

              <button className="px-6 py-3 border border-red-600 text-red-600 rounded-xl font-medium hover:bg-red-600 hover:text-white transition">
                Contact Host
              </button>
            </div>

            <div className="mt-8 text-gray-600 leading-relaxed max-w-3xl">
              <p>
                Hi, I'm Saman! I’ve been hosting guests from around the world for over 5 years.
                I’m passionate about hospitality and making sure every stay feels like home.
                Whether you need local recommendations or special arrangements,
                I’m always happy to help.
              </p>
            </div>
          </div>

        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">

            <div className="bg-white border rounded-2xl shadow-lg p-6 space-y-6">

              <div className="text-2xl font-bold">
                LKR 25,000
                <span className="text-gray-500 text-base font-normal">
                  {" "} / night
                </span>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Check-in"
                  className="w-full border rounded-lg px-4 py-3"
                />
                <input
                  type="text"
                  placeholder="Check-out"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition">
                Book Now
              </button>

              <p className="text-center text-sm text-gray-400">
                You won't be charged yet
              </p>

            </div>

          </div>
        </div>

      </div>

    </main>
  );
}
