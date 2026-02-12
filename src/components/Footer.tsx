"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container py-16">
        
        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-sm font-bold text-primary-foreground">📍</span>
              </div>
              <span className="text-lg font-semibold text-primary">
                TripFinder
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Your trusted platform for discovering and booking unique short-stay
              accommodations across Sri Lanka.
            </p>

            <div className="flex items-center gap-4 text-gray-500">
              <Facebook className="h-5 w-5 hover:text-primary transition cursor-pointer" />
              <Instagram className="h-5 w-5 hover:text-primary transition cursor-pointer" />
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Become a Host</Link></li>
              <li><Link href="#" className="hover:text-primary">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary">Press</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary">Safety Information</Link></li>
              <li><Link href="#" className="hover:text-primary">Cancellation Options</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                info@tripfinder.lk
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +94 11 234 5678
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Colombo, Sri Lanka
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-gray-200" />

        {/* Bottom Row */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>© 2026 TripFinder. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
