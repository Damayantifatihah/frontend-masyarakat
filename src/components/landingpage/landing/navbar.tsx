"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [activeMenu, setActiveMenu] =
  useState("Beranda");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-b border-white/20"
          : "bg-transparent"
      }`}
    >
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
          "Beranda",
          "Layanan",
          "Cara Kerja",
          "Testimoni",
        ].map((label) => (
            <li key={label}>
             <Link
                href={`#${label
                  .toLowerCase()
                  .replace(" ", "-")}`}
                onClick={() =>
                  setActiveMenu(label)
                }
                className={`text-[15px] font-semibold transition-all duration-300 ${
                  activeMenu === label
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
            className="text-[15px] font-bold text-white bg-[#C1522A] hover:bg-[#a8421e] px-7 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:scale-105"
          >
            Daftar
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-[300px] py-4" : "max-h-0"
        } bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 flex flex-col gap-4`}
      >
       {[
          "Beranda",
          "Layanan",
          "Cara Kerja",
          "Testimoni",
        ].map((item) => (
          <Link
            key={item}
            href={`#${item
              .toLowerCase()
              .replace(" ", "-")}`}
            onClick={() => {
              setMenuOpen(false);
              setActiveMenu(item);
            }}
            className={`text-sm font-semibold transition-colors ${
              activeMenu === item
                ? "text-[#E8734A]"
                : "text-gray-700 hover:text-[#E8734A]"
            }`}
          >
            {item}
          </Link>
        ))}

        <div className="flex gap-3 pt-1">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:border-[#E8734A] hover:text-[#E8734A] transition-all"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="text-sm font-bold text-white bg-[#C1522A] hover:bg-[#a8421e] px-4 py-2 rounded-lg transition-all"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}