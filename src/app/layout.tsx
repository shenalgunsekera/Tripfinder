import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "TripFinder",
  description: "Discover and book unique travel experiences worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">

  <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
    <Navbar />
  </header>

  <main className="flex-1">
    {children}
  </main>

  <Footer />

</body>

    </html>
  );
}
