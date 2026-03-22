import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalSplashLoader from "@/components/GlobalSplashLoader";
import { AuthProvider } from "@/context/AuthContext";


export const metadata: Metadata = {
  title: "TripFinder – AI-Powered Short Stay Booking in Sri Lanka",
  description:
    "Discover and book unique short-stay accommodations across Sri Lanka. AI-powered recommendations, instant booking, and verified hosts.",
  icons: {
    icon: "/tripfinder-logo.svg",
    shortcut: "/tripfinder-logo.svg",
    apple: "/tripfinder-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <AuthProvider>
          <GlobalSplashLoader />

          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <Navbar />
          </header>

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </AuthProvider>
      </body>

    </html>
  );
}
