import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalSplashLoader from "@/components/GlobalSplashLoader";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TripFinder",
  description: "Discover and book unique travel experiences worldwide.",
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
        
        <GlobalSplashLoader />

        
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />

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