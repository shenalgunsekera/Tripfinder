import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import type { Booking, Property, User } from "./data";
import { PROPERTIES, SAMPLE_BOOKINGS, USERS } from "./data";
import { db } from "./firebase";

const KEYS = {
  currentUser: "tf_current_user",
  seeded: "tf_firestore_seeded",
};

const COLLECTIONS = {
  users: "users",
  bookings: "bookings",
  properties: "properties",
} as const;

let seedPromise: Promise<void> | null = null;

type WithId = { id: string };

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function collectionRef(name: keyof typeof COLLECTIONS) {
  return collection(db, COLLECTIONS[name]);
}

async function collectionHasData(name: keyof typeof COLLECTIONS) {
  const snapshot = await getDocs(query(collectionRef(name), limit(1)));
  return !snapshot.empty;
}

async function getExistingIds(name: keyof typeof COLLECTIONS) {
  const snapshot = await getDocs(collectionRef(name));
  return new Set(snapshot.docs.map((item) => item.id));
}

async function replaceCollection<T extends WithId>(name: keyof typeof COLLECTIONS, items: T[]) {
  const ref = collectionRef(name);
  const existing = await getDocs(ref);
  const existingIds = new Set(existing.docs.map((item) => item.id));
  const nextIds = new Set(items.map((item) => item.id));
  const batch = writeBatch(db);

  for (const item of items) {
    batch.set(doc(db, COLLECTIONS[name], item.id), item);
  }

  for (const existingId of existingIds) {
    if (!nextIds.has(existingId)) {
      batch.delete(doc(db, COLLECTIONS[name], existingId));
    }
  }

  await batch.commit();
}

async function ensureSeeded() {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const [hasUsers, hasBookings, hasProperties] = await Promise.all([
      collectionHasData("users"),
      collectionHasData("bookings"),
      collectionHasData("properties"),
    ]);

    const batch = writeBatch(db);
    let shouldCommit = false;

    if (!hasUsers) {
      for (const user of USERS) {
        batch.set(doc(db, COLLECTIONS.users, user.id), user);
      }
      shouldCommit = true;
    }

    if (!hasBookings) {
      for (const booking of SAMPLE_BOOKINGS) {
        batch.set(doc(db, COLLECTIONS.bookings, booking.id), booking);
      }
      shouldCommit = true;
    }

    if (!hasProperties) {
      for (const property of PROPERTIES) {
        batch.set(doc(db, COLLECTIONS.properties, property.id), property);
      }
      shouldCommit = true;
    } else {
      const existingPropertyIds = await getExistingIds("properties");

      for (const property of PROPERTIES) {
        if (!existingPropertyIds.has(property.id)) {
          batch.set(doc(db, COLLECTIONS.properties, property.id), property);
          shouldCommit = true;
        }
      }
    }

    if (shouldCommit) {
      await batch.commit();
    }

    if (canUseBrowserStorage()) {
      localStorage.setItem(KEYS.seeded, "true");
    }
  })();

  return seedPromise;
}

async function getCollectionItems<T>(name: keyof typeof COLLECTIONS) {
  await ensureSeeded();
  const snapshot = await getDocs(collectionRef(name));
  return snapshot.docs.map((item) => item.data() as T);
}

export async function getUsers(): Promise<User[]> {
  return getCollectionItems<User>("users");
}

export async function saveUsers(users: User[]) {
  await ensureSeeded();
  await replaceCollection("users", users);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  if (!email?.trim()) return undefined;
  await ensureSeeded();
  const snapshot = await getDocs(query(collectionRef("users"), where("email", "==", email.trim().toLowerCase())));
  return snapshot.docs[0]?.data() as User | undefined;
}

export async function getUserById(userId: string): Promise<User | null> {
  if (!userId?.trim()) return null;
  await ensureSeeded();
  const snapshot = await getDocs(query(collectionRef("users"), where("id", "==", userId), limit(1)));
  return (snapshot.docs[0]?.data() as User | undefined) ?? null;
}

export async function registerUser(data: Omit<User, "id" | "joinedDate" | "isVerified" | "avatar">): Promise<User> {
  await ensureSeeded();
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const newUser: User = {
    ...data,
    email: data.email.trim().toLowerCase(),
    id: `user-${Date.now()}`,
    joinedDate: new Date().toISOString().split("T")[0],
    isVerified: false,
    avatar: `https://picsum.photos/seed/${Date.now()}/80/80`,
    totalBookings: 0,
    totalProperties: 0,
    totalEarnings: 0,
  };

  await setDoc(doc(db, COLLECTIONS.users, newUser.id), newUser);
  return newUser;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  await ensureSeeded();
  await updateDoc(doc(db, COLLECTIONS.users, userId), updates);
  return getUserById(userId);
}

export function getCurrentUser(): User | null {
  if (!canUseBrowserStorage()) return null;

  try {
    const raw = localStorage.getItem(KEYS.currentUser);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (!canUseBrowserStorage()) return;

  if (user) {
    localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.currentUser);
  }
}

export async function getBookings(): Promise<Booking[]> {
  return getCollectionItems<Booking>("bookings");
}

export async function saveBookings(bookings: Booking[]) {
  await ensureSeeded();
  await replaceCollection("bookings", bookings);
}

export async function addBooking(booking: Booking) {
  await ensureSeeded();
  await setDoc(doc(db, COLLECTIONS.bookings, booking.id), booking);
}

export async function updateBookingStatus(bookingId: string, status: Booking["status"]) {
  await ensureSeeded();
  await updateDoc(doc(db, COLLECTIONS.bookings, bookingId), { status });
}

export async function getBookingsByGuest(guestId: string): Promise<Booking[]> {
  if (!guestId?.trim()) return [];
  await ensureSeeded();
  const snapshot = await getDocs(query(collectionRef("bookings"), where("guestId", "==", guestId)));
  return snapshot.docs.map((item) => item.data() as Booking);
}

export async function getBookingsByHost(hostId: string): Promise<Booking[]> {
  if (!hostId?.trim()) return [];
  await ensureSeeded();
  const snapshot = await getDocs(query(collectionRef("bookings"), where("hostId", "==", hostId)));
  return snapshot.docs.map((item) => item.data() as Booking);
}

export async function getBookingsByProperty(propertyId: string): Promise<Booking[]> {
  if (!propertyId?.trim()) return [];
  await ensureSeeded();
  const snapshot = await getDocs(query(collectionRef("bookings"), where("propertyId", "==", propertyId)));
  return snapshot.docs.map((item) => item.data() as Booking);
}

export async function getProperties(): Promise<Property[]> {
  return getCollectionItems<Property>("properties");
}

export async function saveProperties(properties: Property[]) {
  await ensureSeeded();
  await replaceCollection("properties", properties);
}

export async function addProperty(property: Property) {
  await ensureSeeded();
  await setDoc(doc(db, COLLECTIONS.properties, property.id), property);
}

export async function updateProperty(propertyId: string, updates: Partial<Property>) {
  await ensureSeeded();
  await updateDoc(doc(db, COLLECTIONS.properties, propertyId), updates);
}

export async function deleteProperty(propertyId: string) {
  await ensureSeeded();
  const properties = await getProperties();
  await replaceCollection(
    "properties",
    properties.filter((item) => item.id !== propertyId),
  );
}

export async function getPropertiesByHost(hostId: string): Promise<Property[]> {
  if (!hostId?.trim()) return [];
  await ensureSeeded();
  const snapshot = await getDocs(query(collectionRef("properties"), where("hostId", "==", hostId)));
  return snapshot.docs.map((item) => item.data() as Property);
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  if (!slug?.trim()) return undefined;
  await ensureSeeded();
  const snapshot = await getDocs(query(collectionRef("properties"), where("slug", "==", slug), limit(1)));
  return snapshot.docs[0]?.data() as Property | undefined;
}

export async function getPlatformStats() {
  const [users, bookings, properties] = await Promise.all([getUsers(), getBookings(), getProperties()]);

  const totalRevenue = bookings
    .filter((booking) => booking.status === "confirmed" || booking.status === "completed")
    .reduce((sum, booking) => sum + booking.total, 0);

  return {
    totalUsers: users.filter((user) => user.role === "traveler").length,
    totalHosts: users.filter((user) => user.role === "host").length,
    totalProperties: properties.filter((property) => property.isActive).length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
    totalRevenue,
    recentBookings: [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
  };
}
