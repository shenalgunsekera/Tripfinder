import PropertyCard from "./PropertyCard";

export default function FeaturedProperties() {
  const properties = [
    {
      title: "Luxury Beach Villa - Bentota",
      location: "Bentota Beach",
      type: "Villa",
      guests: 8,
      price: 25000,
      rating: 4.9,
      reviews: 124,
      instantBook: true,
      slug: "luxury-beach-villa-bentota", 
    },
    {
      title: "Cozy Apartment - Colombo 7",
      location: "Cinnamon Gardens",
      type: "Apartment",
      guests: 4,
      price: 8500,
      rating: 4.7,
      reviews: 89,
      instantBook: true,
      slug: "cozy-apartment-colombo-7", 
    },
    {
      title: "Hill Country Retreat - Ella",
      location: "Ella Town",
      type: "Villa",
      guests: 6,
      price: 15000,
      rating: 4.8,
      reviews: 156,
      instantBook: false,
      slug: "hill-country-retreat-ella", 
    },
  ];

  return (
    <section id="explore" className="bg-gray-50 py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <p className="text-gray-500 mt-2">
              Hand-picked stays for your perfect getaway
            </p>
          </div>

          <button className="border px-5 py-2 rounded-xl hover:bg-gray-100 transition">
            View All
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.slug} // ✅ better than index
              {...property}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
