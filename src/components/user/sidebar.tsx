"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  Home,
  FileText,
  BarChart2,
  LogOut,
} from "lucide-react";

import { getUser, logout } from "@/lib/auth";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const BRAND = "#B45743";
const BRAND_DARK = "#8B3A2A";
const BRAND_LIGHT = "#F9EAE7";

const navItems = [
  { label: "Beranda", href: "/user", icon: Home },
  {
    label: "Buat Laporan",
    href: "/user/buatlaporan",
    icon: BarChart2,
  },
  {
    label: "Laporan Saya",
    href: "/user/laporan-saya",
    icon: FileText,
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function buildUserState(base: {
  name?: string;
  bio?: string;
  photo?: string | null;
}) {
  const name = base.name || "User";

  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    name,
    bio: base.bio || "",
    initials,
    photo: base.photo || null,
  };
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();

  const [hovered, setHovered] = useState<string | null>(null);

  const [scrolled, setScrolled] =
    useState(false);

  const [user, setUser] = useState({
    name: "User",
    bio: "",
    initials: "U",
    photo: null as string | null,
  });

  // ─────────────────────────────
  // LOAD USER
  // ─────────────────────────────

  const loadUser = () => {
    const currentUser = getUser();

    if (!currentUser) return;

    // AMBIL SEMUA USERS
    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    // CARI USER TERBARU
    const latestUser =
      users.find(
        (u: any) =>
          u.email === currentUser.email
      ) || currentUser;

    // AMBIL FOTO
    const savedPhoto = localStorage.getItem(
      `profilePhoto_${latestUser.email}`
    );

    // UPDATE STATE
    setUser(
      buildUserState({
        name: latestUser.name,
        bio: latestUser.bio,
        photo: savedPhoto,
      })
    );
  };

  // ─────────────────────────────
  // LOAD + REALTIME UPDATE
  // ─────────────────────────────

  useEffect(() => {
    loadUser();

    const handler = () => {
      loadUser();
    };

    window.addEventListener(
      "storage",
      handler
    );

    window.addEventListener(
      "profileUpdated",
      handler
    );

    return () => {
      window.removeEventListener(
        "storage",
        handler
      );

      window.removeEventListener(
        "profileUpdated",
        handler
      );
    };
  }, []);

  // ─────────────────────────────
  // SCROLL EFFECT
  // ─────────────────────────────

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);

  return (
    <aside
      style={{
        width: "264px",
        minHeight: "100vh",

        backgroundColor: "#ffffff",

        borderRight:
          "1px solid #F0EFEF",

        display: "flex",
        flexDirection: "column",

        fontFamily:
          "'Plus Jakarta Sans', 'Segoe UI', sans-serif",

        transition: "all 0.35s ease",

        position: "relative",

        flexShrink: 0,

        overflow: "hidden",

        boxShadow: scrolled
          ? "4px 0 24px rgba(180, 87, 67, 0.10), 2px 0 8px rgba(0,0,0,0.06)"
          : "none",
      }}
    >
      {/* ───────────────── LOGO ───────────────── */}
      <div
        style={{
          padding: scrolled
            ? "14px 24px 12px"
            : "22px 24px 18px",

          borderBottom:
            "1px solid #F5F5F5",

          display: "flex",

          alignItems: "center",

          minHeight: scrolled
            ? "64px"
            : "78px",

          overflow: "hidden",

          transition:
            "padding 0.35s cubic-bezier(.4,0,.2,1), min-height 0.35s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div
          style={{
            overflow: "hidden",

            transition:
              "height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s",

            height: scrolled
              ? "30px"
              : "38px",

            opacity: scrolled
              ? 0.88
              : 1,
          }}
        >
          <Image
            src="/images/logo.png"
            alt="LaporinAja"
            width={150}
            height={38}
            style={{
              objectFit: "contain",

              objectPosition:
                "left center",

              width: scrolled
                ? "126px"
                : "150px",

              height: scrolled
                ? "30px"
                : "38px",

              transition:
                "width 0.35s cubic-bezier(.4,0,.2,1), height 0.35s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </div>
      </div>

      {/* ───────────────── PROFILE ───────────────── */}
      <div
        style={{
          padding: "16px 16px 12px",

          transition: "padding 0.25s",
        }}
      >
        <Link
          href="/user/profile"
          style={{
            textDecoration: "none",
          }}
        >
          <div
            style={{
              backgroundColor:
                hovered === "profile"
                  ? BRAND_DARK
                  : BRAND,

              borderRadius: "14px",

              padding: "13px 14px",

              display: "flex",

              alignItems: "center",

              gap: "12px",

              cursor: "pointer",

              transition:
                "background-color 0.2s ease, transform 0.2s ease",

              overflow: "hidden",
            }}
            onMouseEnter={() =>
              setHovered("profile")
            }
            onMouseLeave={() =>
              setHovered(null)
            }
          >
            {/* AVATAR */}
            <div
              style={{
                width: "40px",
                height: "40px",

                borderRadius: "50%",

                overflow: "hidden",

                backgroundColor:
                  "rgba(255,255,255,0.25)",

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                fontSize: "14px",

                fontWeight: 700,

                color: "#fff",

                flexShrink: 0,
              }}
            >
              {user.photo ? (
                <img
                  src={user.photo}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",

                    objectFit: "cover",
                  }}
                />
              ) : (
                user.initials
              )}
            </div>

            {/* USER INFO */}
            <div
              style={{
                overflow: "hidden",

                flex: 1,
              }}
            >
              <p
                style={{
                  margin: 0,

                  fontSize: "14px",

                  fontWeight: 700,

                  color: "#fff",

                  whiteSpace: "nowrap",

                  overflow: "hidden",

                  textOverflow:
                    "ellipsis",
                }}
              >
                {user.name}
              </p>

              {user.bio && (
                <p
                  style={{
                    margin: "3px 0 0",

                    fontSize: "11px",

                    color:
                      "rgba(255,255,255,0.75)",

                    whiteSpace:
                      "nowrap",

                    overflow: "hidden",

                    textOverflow:
                      "ellipsis",
                  }}
                >
                  {user.bio}
                </p>
              )}
            </div>

            <span
              style={{
                color:
                  "rgba(255,255,255,0.7)",

                fontSize: "18px",

                flexShrink: 0,
              }}
            >
              ›
            </span>
          </div>
        </Link>
      </div>

      {/* ───────────────── NAVIGATION ───────────────── */}
      <nav
        style={{
          padding: "8px 12px",

          flex: 1,
        }}
      >
        {navItems.map(
          ({
            label,
            href,
            icon: Icon,
          }) => {
            const isActive =
              pathname === href;

            const isHov =
              hovered === href;

            return (
              <button
                key={href}
                onClick={() =>
                  (window.location.href =
                    href)
                }
                onMouseEnter={() =>
                  setHovered(href)
                }
                onMouseLeave={() =>
                  setHovered(null)
                }
                style={{
                  display: "flex",

                  alignItems: "center",

                  gap: "12px",

                  padding: "11px 14px",

                  borderRadius: "10px",

                  marginBottom: "4px",

                  width: "100%",

                  border: "none",

                  backgroundColor:
                    isActive
                      ? BRAND
                      : isHov
                      ? BRAND_LIGHT
                      : "transparent",

                  borderLeft: isActive
                    ? `3px solid ${BRAND_DARK}`
                    : "3px solid transparent",

                  transition:
                    "all 0.2s ease",

                  cursor: "pointer",

                  textAlign: "left",

                  overflow: "hidden",
                }}
              >
                <Icon
                  size={20}
                  color={
                    isActive
                      ? "#fff"
                      : isHov
                      ? BRAND
                      : "#6B7280"
                  }
                  style={{
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    fontSize: "14px",

                    fontWeight:
                      isActive
                        ? 700
                        : 500,

                    color: isActive
                      ? "#fff"
                      : isHov
                      ? BRAND
                      : "#374151",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {label}
                </span>
              </button>
            );
          }
        )}
      </nav>

      {/* ───────────────── LOGOUT ───────────────── */}
      <div
        style={{
          padding: "0 12px 24px",
        }}
      >
        <div
          style={{
            height: "1px",

            backgroundColor:
              "#F0EFEF",

            marginBottom: "10px",
          }}
        />

        <button
          style={{
            display: "flex",

            alignItems: "center",

            gap: "12px",

            padding: "11px 14px",

            borderRadius: "10px",

            width: "100%",

            border: "none",

            backgroundColor:
              hovered === "logout"
                ? BRAND_LIGHT
                : "transparent",

            cursor: "pointer",

            transition:
              "background-color 0.15s",

            overflow: "hidden",
          }}
          onMouseEnter={() =>
            setHovered("logout")
          }
          onMouseLeave={() =>
            setHovered(null)
          }
          onClick={logout}
        >
          <LogOut
            size={20}
            color={
              hovered === "logout"
                ? BRAND
                : "#6B7280"
            }
            style={{
              flexShrink: 0,
            }}
          />

          <span
            style={{
              fontSize: "14px",

              fontWeight: 500,

              color:
                hovered === "logout"
                  ? BRAND
                  : "#6B7280",

              whiteSpace: "nowrap",
            }}
          >
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}