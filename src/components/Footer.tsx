"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container py-16">
        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <div className="mb-4">
              <Image
                src="/tripfinder-logo.svg"
                alt="TripFinder"
                width={500}
                height={500}
                className="h-16 w-16"
              />
            </div>

            <p className="mb-6 text-sm text-gray-600">
              Your trusted platform for discovering and booking unique short-stay
              accommodations across Sri Lanka.
            </p>

            <div className="flex items-center gap-4 text-gray-500">
              <Facebook className="h-5 w-5 cursor-pointer transition hover:text-primary" />
              <Instagram className="h-5 w-5 cursor-pointer transition hover:text-primary" />
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Support</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Safety Information
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Contact</h4>
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
          <p>&copy; 2026 TripFinder. All rights reserved.</p>

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
