"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 h-[76px] flex items-center justify-between">

        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="LaporinAja Logo"
          className="w-[160px] h-auto object-contain"
        />

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-9">
          {[
            { label: "Beranda", active: true },
            { label: "Layanan", active: false },
            { label: "Cara Kerja", active: false },
            { label: "Testimoni", active: false },
          ].map(({ label, active }) => (
            <li key={label}>
              <Link
                href={`#${label.toLowerCase().replace(" ", "-")}`}
                className={`text-[15px] font-semibold transition-colors ${
                  active
                    ? "text-[#E8734A] border-b-2 border-[#E8734A] pb-0.5"
                    : "text-gray-700 hover:text-[#E8734A]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-[15px] font-semibold text-gray-500 hover:text-[#E8734A] px-3 py-2 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/auth/register"
            className="text-[15px] font-bold text-white bg-[#C1522A] hover:bg-[#a8421e] px-7 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Daftar
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {["Beranda", "Cara Kerja", "Layanan", "Testimoni"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-gray-700 hover:text-[#E8734A]"
            >
              {item}
            </Link>
          ))}
       <div className="flex gap-3 pt-1">
        <Link
            href="/auth/login"
            className="text-sm font-semibold text-gray-600 border border-gray-300 px-4 py-2 rounded-lg"
            >
            Login
        </Link>

        <Link
            href="/auth/register"
            className="text-sm font-bold text-white bg-[#C1522A] px-4 py-2 rounded-lg"
        >
            Register
        </Link>
        </div>
                </div>
            )}
            </nav>
        );
        }