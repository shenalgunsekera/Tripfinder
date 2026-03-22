// ─── Types ────────────────────────────────────────────────────────────────────

export type PropertyType = "Villa" | "Apartment" | "Room" | "Homestay" | "Cottage" | "Cabin";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type BookingType = "instant" | "reservation";
export type UserRole = "traveler" | "host" | "admin";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  location: string;
  city: string;
  address: string;
  price: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  reviewCount: number;
  instantBook: boolean;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostJoined: string;
  hostRating: number;
  hostResponseTime: string;
  isSuperhost: boolean;
  images: string[];
  amenities: string[];
  rules: string[];
  checkIn: string;
  checkOut: string;
  minNights: number;
  isActive: boolean;
  isVerified: boolean;
  coordinates: { lat: number; lng: number };
  reviews: Review[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  phone: string;
  joinedDate: string;
  isVerified: boolean;
  totalBookings?: number;
  totalProperties?: number;
  totalEarnings?: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  hostId: string;
  hostName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  status: BookingStatus;
  type: BookingType;
  paymentMethod: string;
  createdAt: string;
  specialRequests?: string;
}

// ─── Properties Data ───────────────────────────────────────────────────────────

export const PROPERTIES: Property[] = [
  {
    id: "prop-001",
    slug: "luxury-beach-villa-bentota",
    title: "Luxury Beach Villa – Bentota",
    description:
      "Experience ultimate luxury in this stunning beachfront villa with a private infinity pool overlooking the Indian Ocean. This exclusive 4-bedroom retreat sits directly on Bentota's pristine white-sand beach, offering unmatched privacy and world-class amenities. Ideal for families and groups seeking a premium Sri Lanka holiday.",
    type: "Villa",
    location: "Bentota Beach",
    city: "Bentota",
    address: "12 Beach Road, Bentota, Sri Lanka",
    price: 25000,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    rating: 4.9,
    reviewCount: 124,
    instantBook: true,
    hostId: "host-001",
    hostName: "Saman Perera",
    hostAvatar: "https://picsum.photos/seed/host1/80/80",
    hostJoined: "2020",
    hostRating: 4.9,
    hostResponseTime: "within 1 hour",
    isSuperhost: true,
    images: [
      "https://picsum.photos/seed/villa1/800/600",
      "https://picsum.photos/seed/villa2/800/600",
      "https://picsum.photos/seed/villa3/800/600",
      "https://picsum.photos/seed/villa4/800/600",
    ],
    amenities: [
      "WiFi", "Private Pool", "Beach Access", "Kitchen", "Air Conditioning",
      "Parking", "BBQ", "Ocean View", "Washer", "TV", "Security",
    ],
    rules: ["No smoking", "No parties", "Check-in after 3 PM", "Check-out before 11 AM"],
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    minNights: 2,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 6.4414, lng: 79.9948 },
    reviews: [
      {
        id: "rev-001",
        userId: "user-003",
        userName: "Amal Fernando",
        userAvatar: "https://picsum.photos/seed/amal/40/40",
        rating: 5,
        comment: "Absolutely stunning villa! The beach access and pool were incredible. Saman was a wonderful host — very responsive and helpful. Highly recommend!",
        date: "2026-02-15",
      },
      {
        id: "rev-002",
        userId: "user-004",
        userName: "Priya Wickramasinghe",
        userAvatar: "https://picsum.photos/seed/priya/40/40",
        rating: 5,
        comment: "Perfect getaway for our family of 6. The villa exceeded all expectations. Clean, spacious, and the ocean view from the pool is breathtaking.",
        date: "2026-01-28",
      },
    ],
    createdAt: "2024-06-15",
  },
  {
    id: "prop-002",
    slug: "cozy-apartment-colombo-7",
    title: "Cozy Modern Apartment – Colombo 7",
    description:
      "A stylishly furnished 2-bedroom apartment in the heart of Colombo's upscale Cinnamon Gardens neighbourhood. Walking distance to fine dining, galleries, and Viharamahadevi Park. Perfect for business travellers and couples exploring the city.",
    type: "Apartment",
    location: "Cinnamon Gardens",
    city: "Colombo",
    address: "45 Park Road, Colombo 07, Sri Lanka",
    price: 8500,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.7,
    reviewCount: 89,
    instantBook: true,
    hostId: "host-002",
    hostName: "Dilshan Rathnayake",
    hostAvatar: "https://picsum.photos/seed/host2/80/80",
    hostJoined: "2021",
    hostRating: 4.8,
    hostResponseTime: "within 2 hours",
    isSuperhost: false,
    images: [
      "https://picsum.photos/seed/apt1/800/600",
      "https://picsum.photos/seed/apt2/800/600",
      "https://picsum.photos/seed/apt3/800/600",
    ],
    amenities: [
      "WiFi", "Air Conditioning", "Kitchen", "TV", "Washer", "Parking",
      "Gym Access", "24/7 Security",
    ],
    rules: ["No smoking", "No pets", "Check-in after 2 PM", "Check-out before 12 PM"],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    minNights: 1,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 6.9017, lng: 79.8614 },
    reviews: [
      {
        id: "rev-003",
        userId: "user-005",
        userName: "Kasun Silva",
        userAvatar: "https://picsum.photos/seed/kasun/40/40",
        rating: 5,
        comment: "Great location, spotlessly clean apartment. Dilshan was very helpful with restaurant recommendations. Perfect for a business trip.",
        date: "2026-02-20",
      },
    ],
    createdAt: "2024-08-10",
  },
  {
    id: "prop-003",
    slug: "hill-country-retreat-ella",
    title: "Hilltop Retreat – Ella",
    description:
      "Nestled among lush tea plantations, this charming 3-bedroom villa offers spectacular views of Ella Rock and the surrounding mountains. Wake up to misty mornings, explore the Nine Arch Bridge, and enjoy home-cooked Sri Lankan meals. An authentic highland escape.",
    type: "Villa",
    location: "Ella Town",
    city: "Ella",
    address: "Ella-Passara Road, Ella, Sri Lanka",
    price: 15000,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.8,
    reviewCount: 156,
    instantBook: false,
    hostId: "host-003",
    hostName: "Chamara Bandara",
    hostAvatar: "https://picsum.photos/seed/host3/80/80",
    hostJoined: "2019",
    hostRating: 4.9,
    hostResponseTime: "within 3 hours",
    isSuperhost: true,
    images: [
      "https://picsum.photos/seed/ella1/800/600",
      "https://picsum.photos/seed/ella2/800/600",
      "https://picsum.photos/seed/ella3/800/600",
    ],
    amenities: [
      "WiFi", "Mountain View", "Kitchen", "Breakfast Included", "Fireplace",
      "Garden", "Hiking Access", "Hot Water",
    ],
    rules: ["No smoking indoors", "Quiet hours after 10 PM", "Check-in 3–8 PM", "Check-out before 11 AM"],
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    minNights: 2,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 6.8667, lng: 81.0466 },
    reviews: [
      {
        id: "rev-004",
        userId: "user-006",
        userName: "Natasha De Silva",
        userAvatar: "https://picsum.photos/seed/natasha/40/40",
        rating: 5,
        comment: "One of the best stays of my life! The views are incredible, and Chamara made us feel like family. The homemade Sri Lankan breakfast was divine.",
        date: "2026-01-10",
      },
      {
        id: "rev-005",
        userId: "user-007",
        userName: "Roshan Mendis",
        userAvatar: "https://picsum.photos/seed/roshan/40/40",
        rating: 4,
        comment: "Beautiful property with stunning views. Slightly difficult road to access but worth it! Chamara was very accommodating.",
        date: "2025-12-22",
      },
    ],
    createdAt: "2024-03-01",
  },
  {
    id: "prop-004",
    slug: "beachfront-suite-mirissa",
    title: "Beachfront Suite – Mirissa",
    description:
      "Fall asleep to the sound of waves in this gorgeous beachfront suite steps from Mirissa's famous surf beach. Features a private terrace, modern interiors, and direct beach access. Ideal for couples, surfers, and whale-watching enthusiasts.",
    type: "Room",
    location: "Mirissa Beach",
    city: "Mirissa",
    address: "Mirissa Beach Road, Mirissa, Sri Lanka",
    price: 12000,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    rating: 4.6,
    reviewCount: 78,
    instantBook: true,
    hostId: "host-001",
    hostName: "Saman Perera",
    hostAvatar: "https://picsum.photos/seed/host1/80/80",
    hostJoined: "2020",
    hostRating: 4.9,
    hostResponseTime: "within 1 hour",
    isSuperhost: true,
    images: [
      "https://picsum.photos/seed/mir1/800/600",
      "https://picsum.photos/seed/mir2/800/600",
      "https://picsum.photos/seed/mir3/800/600",
    ],
    amenities: [
      "WiFi", "Beach Access", "Air Conditioning", "Private Terrace",
      "Surfboard Storage", "Outdoor Shower", "Fan",
    ],
    rules: ["No smoking", "No parties or events", "Check-in after 2 PM"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    minNights: 2,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 5.9447, lng: 80.4620 },
    reviews: [],
    createdAt: "2024-09-15",
  },
  {
    id: "prop-005",
    slug: "galle-fort-heritage-home",
    title: "Heritage Home – Galle Fort",
    description:
      "Live like a local inside the UNESCO-listed Galle Fort in this beautifully restored Dutch colonial home. Original stone walls meet contemporary comforts. Explore cobblestone streets, boutique shops, and fine restaurants on foot.",
    type: "Homestay",
    location: "Galle Fort",
    city: "Galle",
    address: "Church Street, Galle Fort, Sri Lanka",
    price: 18000,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.9,
    reviewCount: 203,
    instantBook: true,
    hostId: "host-004",
    hostName: "Nirosha Jayawardena",
    hostAvatar: "https://picsum.photos/seed/host4/80/80",
    hostJoined: "2018",
    hostRating: 5.0,
    hostResponseTime: "within 30 minutes",
    isSuperhost: true,
    images: [
      "https://picsum.photos/seed/galle1/800/600",
      "https://picsum.photos/seed/galle2/800/600",
      "https://picsum.photos/seed/galle3/800/600",
    ],
    amenities: [
      "WiFi", "Air Conditioning", "Heritage Architecture", "Kitchen",
      "Courtyard", "TV", "Walking Distance to Attractions",
    ],
    rules: ["No smoking", "Respectful of heritage property", "Quiet hours after 11 PM"],
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    minNights: 2,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 6.0267, lng: 80.2170 },
    reviews: [
      {
        id: "rev-006",
        userId: "user-008",
        userName: "Tharushi Gunawardena",
        userAvatar: "https://picsum.photos/seed/tharushi/40/40",
        rating: 5,
        comment: "Staying inside the Galle Fort was a dream come true! Nirosha's heritage home is absolutely stunning. The location can't be beaten.",
        date: "2026-02-01",
      },
    ],
    createdAt: "2024-01-20",
  },
  {
    id: "prop-006",
    slug: "jungle-treehouse-sigiriya",
    title: "Jungle Treehouse – Sigiriya",
    description:
      "A one-of-a-kind treehouse experience surrounded by jungle, just 2km from Sigiriya Rock Fortress. Wake up to birdsong, spot wildlife from your private deck, and stargaze from the rooftop. Perfect for adventurers and nature lovers.",
    type: "Cabin",
    location: "Sigiriya Village",
    city: "Sigiriya",
    address: "Sigiriya–Inamaluwa Road, Sigiriya, Sri Lanka",
    price: 22000,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    rating: 4.8,
    reviewCount: 91,
    instantBook: true,
    hostId: "host-005",
    hostName: "Ruwantha Pathirana",
    hostAvatar: "https://picsum.photos/seed/host5/80/80",
    hostJoined: "2022",
    hostRating: 4.7,
    hostResponseTime: "within 2 hours",
    isSuperhost: false,
    images: [
      "https://picsum.photos/seed/tree1/800/600",
      "https://picsum.photos/seed/tree2/800/600",
      "https://picsum.photos/seed/tree3/800/600",
    ],
    amenities: [
      "WiFi", "Jungle View", "Private Deck", "Outdoor Bathroom",
      "Mosquito Nets", "Solar Power", "Bird Watching", "Nature Walks",
    ],
    rules: ["No smoking", "Eco-friendly stay", "Wildlife protection rules apply"],
    checkIn: "3:00 PM",
    checkOut: "10:00 AM",
    minNights: 2,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 7.9570, lng: 80.7603 },
    reviews: [],
    createdAt: "2024-11-01",
  },
  {
    id: "prop-007",
    slug: "city-center-loft-colombo",
    title: "Modern Loft – Colombo 3",
    description:
      "Stylish studio loft in the heart of Colombo's business and entertainment district. High ceilings, exposed brick, and floor-to-ceiling windows offer stunning city views. Walking distance to Galle Face Green, Pettah market, and top restaurants.",
    type: "Apartment",
    location: "Colombo 3",
    city: "Colombo",
    address: "Union Place, Colombo 03, Sri Lanka",
    price: 7500,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    rating: 4.5,
    reviewCount: 62,
    instantBook: true,
    hostId: "host-002",
    hostName: "Dilshan Rathnayake",
    hostAvatar: "https://picsum.photos/seed/host2/80/80",
    hostJoined: "2021",
    hostRating: 4.8,
    hostResponseTime: "within 2 hours",
    isSuperhost: false,
    images: [
      "https://picsum.photos/seed/loft1/800/600",
      "https://picsum.photos/seed/loft2/800/600",
    ],
    amenities: [
      "WiFi", "Air Conditioning", "City View", "Kitchen", "TV",
      "Washer", "Gym Access", "Rooftop",
    ],
    rules: ["No smoking", "No parties", "Check-in after 2 PM"],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    minNights: 1,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 6.9087, lng: 79.8488 },
    reviews: [],
    createdAt: "2024-07-20",
  },
  {
    id: "prop-008",
    slug: "tea-plantation-homestay-nuwara-eliya",
    title: "Tea Plantation Homestay – Nuwara Eliya",
    description:
      "Stay with a local family on a working tea estate high in the misty hills of Nuwara Eliya. Enjoy guided tea factory tours, sunrise walks through the plantation, and hearty home-cooked meals. A genuinely authentic Sri Lankan experience.",
    type: "Homestay",
    location: "Nuwara Eliya Town",
    city: "Nuwara Eliya",
    address: "St Andrews Drive, Nuwara Eliya, Sri Lanka",
    price: 9000,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    rating: 4.7,
    reviewCount: 114,
    instantBook: false,
    hostId: "host-006",
    hostName: "Kumari Dissanayake",
    hostAvatar: "https://picsum.photos/seed/host6/80/80",
    hostJoined: "2019",
    hostRating: 4.8,
    hostResponseTime: "within 4 hours",
    isSuperhost: true,
    images: [
      "https://picsum.photos/seed/tea1/800/600",
      "https://picsum.photos/seed/tea2/800/600",
      "https://picsum.photos/seed/tea3/800/600",
    ],
    amenities: [
      "WiFi", "Breakfast Included", "Tea Tour", "Mountain View",
      "Fireplace", "Garden", "Home-cooked Meals", "Local Guide",
    ],
    rules: ["Family-friendly property", "No alcohol", "Respect local customs"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    minNights: 2,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 6.9497, lng: 80.7891 },
    reviews: [],
    createdAt: "2024-04-05",
  },
  {
    id: "prop-009",
    slug: "arugam-bay-surf-cottage",
    title: "Surf Cottage – Arugam Bay",
    description:
      "Laid-back surf cottage just steps from Arugam Bay's world-famous point break. Perfect for surfers and beach lovers, with a hammock garden, outdoor kitchen, and relaxed beach vibes. Surf lessons can be arranged on request.",
    type: "Cottage",
    location: "Arugam Bay Beach",
    city: "Arugam Bay",
    address: "Main Street, Arugam Bay, Sri Lanka",
    price: 11000,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    rating: 4.6,
    reviewCount: 47,
    instantBook: true,
    hostId: "host-005",
    hostName: "Ruwantha Pathirana",
    hostAvatar: "https://picsum.photos/seed/host5/80/80",
    hostJoined: "2022",
    hostRating: 4.7,
    hostResponseTime: "within 2 hours",
    isSuperhost: false,
    images: [
      "https://picsum.photos/seed/surf1/800/600",
      "https://picsum.photos/seed/surf2/800/600",
    ],
    amenities: [
      "WiFi", "Beach Access", "Surfboard Rental", "Hammock Garden",
      "Outdoor Kitchen", "Bicycle Rental", "Fan",
    ],
    rules: ["No smoking indoors", "Respectful of surf culture", "Check-in after 2 PM"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    minNights: 3,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 6.8408, lng: 81.8368 },
    reviews: [],
    createdAt: "2024-10-10",
  },
  {
    id: "prop-010",
    slug: "lake-view-bungalow-kandy",
    title: "Lake View Bungalow – Kandy",
    description:
      "Charming colonial bungalow with breathtaking views over Kandy Lake and the surrounding hills. Centrally located near the Temple of the Tooth, Royal Botanical Gardens, and cultural shows. A romantic and culturally rich escape.",
    type: "Villa",
    location: "Kandy Lake Side",
    city: "Kandy",
    address: "Rajapihilla Mawatha, Kandy, Sri Lanka",
    price: 14000,
    guests: 5,
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.8,
    reviewCount: 88,
    instantBook: false,
    hostId: "host-004",
    hostName: "Nirosha Jayawardena",
    hostAvatar: "https://picsum.photos/seed/host4/80/80",
    hostJoined: "2018",
    hostRating: 5.0,
    hostResponseTime: "within 30 minutes",
    isSuperhost: true,
    images: [
      "https://picsum.photos/seed/kandy1/800/600",
      "https://picsum.photos/seed/kandy2/800/600",
      "https://picsum.photos/seed/kandy3/800/600",
    ],
    amenities: [
      "WiFi", "Lake View", "Air Conditioning", "Kitchen",
      "Garden", "TV", "Parking", "Hot Water",
    ],
    rules: ["No smoking", "No loud music after 10 PM", "Check-in after 3 PM"],
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    minNights: 2,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 7.2906, lng: 80.6337 },
    reviews: [],
    createdAt: "2024-05-12",
  },
  {
    id: "prop-011",
    slug: "negombo-lagoon-villa",
    title: "Lagoon Villa – Negombo",
    description:
      "Spectacular villa on the edge of Negombo Lagoon, just 10 minutes from Bandaranaike International Airport. Perfect for arrivals, departures, and longer stays. Watch flamingos from your private dock and enjoy fresh seafood from the lagoon.",
    type: "Villa",
    location: "Negombo Lagoon",
    city: "Negombo",
    address: "Lagoon Road, Negombo, Sri Lanka",
    price: 16000,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.7,
    reviewCount: 66,
    instantBook: true,
    hostId: "host-003",
    hostName: "Chamara Bandara",
    hostAvatar: "https://picsum.photos/seed/host3/80/80",
    hostJoined: "2019",
    hostRating: 4.9,
    hostResponseTime: "within 3 hours",
    isSuperhost: true,
    images: [
      "https://picsum.photos/seed/neg1/800/600",
      "https://picsum.photos/seed/neg2/800/600",
    ],
    amenities: [
      "WiFi", "Lagoon View", "Private Dock", "Kitchen", "Air Conditioning",
      "Parking", "BBQ", "Bird Watching",
    ],
    rules: ["No smoking", "No parties", "Fishing permitted from dock only"],
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    minNights: 1,
    isActive: true,
    isVerified: true,
    coordinates: { lat: 7.2095, lng: 79.8373 },
    reviews: [],
    createdAt: "2024-06-30",
  },
  {
    id: "prop-012",
    slug: "trinco-beach-cabana",
    title: "Beach Cabana – Trincomalee",
    description:
      "Rustic yet luxurious beach cabana on the shores of Trincomalee's pristine Nilaveli Beach, one of Sri Lanka's most beautiful stretches of coastline. Snorkel with whale sharks, explore Pigeon Island, and relax on powder-white sands.",
    type: "Cabin",
    location: "Nilaveli Beach",
    city: "Trincomalee",
    address: "Nilaveli, Trincomalee, Sri Lanka",
    price: 13500,
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    rating: 4.5,
    reviewCount: 39,
    instantBook: true,
    hostId: "host-006",
    hostName: "Kumari Dissanayake",
    hostAvatar: "https://picsum.photos/seed/host6/80/80",
    hostJoined: "2019",
    hostRating: 4.8,
    hostResponseTime: "within 4 hours",
    isSuperhost: false,
    images: [
      "https://picsum.photos/seed/trinco1/800/600",
      "https://picsum.photos/seed/trinco2/800/600",
    ],
    amenities: [
      "Beach Access", "WiFi", "Snorkeling Equipment", "Fan",
      "Outdoor Shower", "Hammock", "Breakfast Included",
    ],
    rules: ["No smoking", "Environmental conservation rules apply", "Check-in after 2 PM"],
    checkIn: "2:00 PM",
    checkOut: "10:00 AM",
    minNights: 2,
    isActive: true,
    isVerified: false,
    coordinates: { lat: 8.6981, lng: 81.1993 },
    reviews: [],
    createdAt: "2024-12-01",
  },
];

// ─── Users Data ────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: "admin-001",
    name: "Admin User",
    email: "admin@tripfinder.lk",
    password: "Admin@2026",
    role: "admin",
    avatar: "https://picsum.photos/seed/admin/80/80",
    phone: "+94 11 234 5678",
    joinedDate: "2024-01-01",
    isVerified: true,
  },
  {
    id: "host-001",
    name: "Saman Perera",
    email: "saman@tripfinder.lk",
    password: "Host@2026",
    role: "host",
    avatar: "https://picsum.photos/seed/host1/80/80",
    phone: "+94 71 234 5678",
    joinedDate: "2020-03-15",
    isVerified: true,
    totalProperties: 2,
    totalEarnings: 450000,
  },
  {
    id: "host-002",
    name: "Dilshan Rathnayake",
    email: "dilshan@tripfinder.lk",
    password: "Host@2026",
    role: "host",
    avatar: "https://picsum.photos/seed/host2/80/80",
    phone: "+94 77 345 6789",
    joinedDate: "2021-06-20",
    isVerified: true,
    totalProperties: 2,
    totalEarnings: 280000,
  },
  {
    id: "host-003",
    name: "Chamara Bandara",
    email: "chamara@tripfinder.lk",
    password: "Host@2026",
    role: "host",
    avatar: "https://picsum.photos/seed/host3/80/80",
    phone: "+94 76 456 7890",
    joinedDate: "2019-09-10",
    isVerified: true,
    totalProperties: 2,
    totalEarnings: 620000,
  },
  {
    id: "host-004",
    name: "Nirosha Jayawardena",
    email: "nirosha@tripfinder.lk",
    password: "Host@2026",
    role: "host",
    avatar: "https://picsum.photos/seed/host4/80/80",
    phone: "+94 70 567 8901",
    joinedDate: "2018-11-05",
    isVerified: true,
    totalProperties: 2,
    totalEarnings: 890000,
  },
  {
    id: "host-005",
    name: "Ruwantha Pathirana",
    email: "ruwantha@tripfinder.lk",
    password: "Host@2026",
    role: "host",
    avatar: "https://picsum.photos/seed/host5/80/80",
    phone: "+94 72 678 9012",
    joinedDate: "2022-02-14",
    isVerified: true,
    totalProperties: 2,
    totalEarnings: 310000,
  },
  {
    id: "host-006",
    name: "Kumari Dissanayake",
    email: "kumari@tripfinder.lk",
    password: "Host@2026",
    role: "host",
    avatar: "https://picsum.photos/seed/host6/80/80",
    phone: "+94 78 789 0123",
    joinedDate: "2019-07-22",
    isVerified: true,
    totalProperties: 2,
    totalEarnings: 195000,
  },
  {
    id: "user-001",
    name: "Amal Fernando",
    email: "traveler@tripfinder.lk",
    password: "Travel@2026",
    role: "traveler",
    avatar: "https://picsum.photos/seed/amal/80/80",
    phone: "+94 71 111 2222",
    joinedDate: "2025-01-10",
    isVerified: true,
    totalBookings: 5,
  },
];

// ─── Sample Bookings ───────────────────────────────────────────────────────────

export const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "book-001",
    propertyId: "prop-001",
    propertySlug: "luxury-beach-villa-bentota",
    propertyTitle: "Luxury Beach Villa – Bentota",
    propertyImage: "https://picsum.photos/seed/villa1/400/300",
    propertyLocation: "Bentota Beach",
    guestId: "user-001",
    guestName: "Amal Fernando",
    guestEmail: "traveler@tripfinder.lk",
    hostId: "host-001",
    hostName: "Saman Perera",
    checkIn: "2026-04-10",
    checkOut: "2026-04-14",
    guests: 4,
    nights: 4,
    pricePerNight: 25000,
    subtotal: 100000,
    serviceFee: 7500,
    total: 107500,
    status: "confirmed",
    type: "instant",
    paymentMethod: "Visa Card",
    createdAt: "2026-03-15",
    specialRequests: "Late check-in at 7 PM, please.",
  },
  {
    id: "book-002",
    propertyId: "prop-005",
    propertySlug: "heritage-home-galle-fort",
    propertyTitle: "Heritage Home – Galle Fort",
    propertyImage: "https://picsum.photos/seed/galle1/400/300",
    propertyLocation: "Galle Fort",
    guestId: "user-001",
    guestName: "Amal Fernando",
    guestEmail: "traveler@tripfinder.lk",
    hostId: "host-004",
    hostName: "Nirosha Jayawardena",
    checkIn: "2026-05-20",
    checkOut: "2026-05-23",
    guests: 2,
    nights: 3,
    pricePerNight: 18000,
    subtotal: 54000,
    serviceFee: 4050,
    total: 58050,
    status: "pending",
    type: "reservation",
    paymentMethod: "Bank Transfer",
    createdAt: "2026-03-16",
  },
];

// ─── Helper: Cities ────────────────────────────────────────────────────────────

export const CITIES = [
  "All Locations",
  "Colombo",
  "Galle",
  "Ella",
  "Bentota",
  "Mirissa",
  "Sigiriya",
  "Kandy",
  "Negombo",
  "Nuwara Eliya",
  "Arugam Bay",
  "Trincomalee",
];

export const PROPERTY_TYPES: PropertyType[] = [
  "Villa", "Apartment", "Room", "Homestay", "Cottage", "Cabin",
];

export const AMENITY_LIST = [
  "WiFi", "Pool", "Beach Access", "Kitchen", "Air Conditioning",
  "Parking", "Breakfast Included", "Mountain View", "Ocean View",
  "Fireplace", "Garden", "Washer", "TV", "BBQ",
];

// ─── AI Search helper ──────────────────────────────────────────────────────────

export function aiSearchProperties(query: string, allProperties?: Property[]): { properties: Property[]; explanation: string } {
  const q = query.toLowerCase();
  const pool = (allProperties ?? PROPERTIES).filter((p) => p.isActive);

  // Extract intent signals
  const cityMatch = CITIES.slice(1).find((c) => q.includes(c.toLowerCase()));
  const wantsBeach = /beach|coast|ocean|sea|surf|wave/i.test(q);
  const wantsMountain = /mountain|hill|tea|plantation|nature|jungle|forest/i.test(q);
  const wantsCity = /city|urban|downtown|business|colombo/i.test(q);
  const wantsBudget = /budget|cheap|affordable|low cost/i.test(q);
  const wantsLuxury = /luxury|premium|villa|exclusive|pool/i.test(q);
  const wantsFamily = /family|kids|children|group/i.test(q);
  const wantsRomantic = /romantic|couple|honeymoon|anniversary/i.test(q);
  const wantsAdventure = /adventure|hike|trek|surf|dive|snorkel|wild/i.test(q);

  let scored = pool.map((p) => {
    let score = 0;
    const reasons: string[] = [];

    if (cityMatch && p.city.toLowerCase().includes(cityMatch.toLowerCase())) {
      score += 10;
      reasons.push(`in ${cityMatch}`);
    }

    if (wantsBeach && (p.amenities.includes("Beach Access") || p.location.toLowerCase().includes("beach"))) {
      score += 5;
      reasons.push("has beach access");
    }
    if (wantsMountain && (p.amenities.includes("Mountain View") || ["Ella", "Nuwara Eliya", "Kandy", "Sigiriya"].includes(p.city))) {
      score += 5;
      reasons.push("mountain/nature setting");
    }
    if (wantsCity && ["Colombo"].includes(p.city)) {
      score += 5;
      reasons.push("city location");
    }
    if (wantsBudget && p.price <= 10000) {
      score += 4;
      reasons.push("budget-friendly");
    }
    if (wantsLuxury && (p.type === "Villa" || p.amenities.includes("Private Pool") || p.price >= 15000)) {
      score += 4;
      reasons.push("luxury property");
    }
    if (wantsFamily && p.guests >= 5) {
      score += 3;
      reasons.push("great for groups/families");
    }
    if (wantsRomantic && p.guests <= 2) {
      score += 3;
      reasons.push("ideal for couples");
    }
    if (wantsAdventure && ["Ella", "Sigiriya", "Arugam Bay", "Trincomalee"].includes(p.city)) {
      score += 3;
      reasons.push("adventure location");
    }

    // Boost by rating
    score += p.rating - 4;

    return { property: p, score, reasons };
  });

  scored = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    // Return all sorted by rating
    return {
      properties: [...pool].sort((a, b) => b.rating - a.rating),
      explanation: "Here are our top-rated properties across Sri Lanka based on your search.",
    };
  }

  const topReasons = scored[0]?.reasons ?? [];
  const explanation = `Found ${scored.length} properties matching your request. Top results are ${topReasons.length > 0 ? topReasons.join(", ") : "highly rated"}.`;

  return {
    properties: scored.map((s) => s.property),
    explanation,
  };
}
