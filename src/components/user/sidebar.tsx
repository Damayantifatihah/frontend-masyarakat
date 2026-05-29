"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import Image from "next/image";

import {
  Home,
  FileText,
  BarChart2,
  LogOut,
} from "lucide-react";

import {
  useSession,
  signOut,
} from "next-auth/react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const BRAND = "#B45743";

const BRAND_DARK = "#8B3A2A";

const BRAND_LIGHT = "#F9EAE7";

const navItems = [
  {
    label: "Beranda",
    href: "/user",
    icon: Home,
  },

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
  const name =
    base.name || "User";

  const initials = name
    .split(" ")
    .map(
      (w: string) => w[0]
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    name,

    bio: base.bio || "",

    initials,

    photo:
      base.photo || null,
  };
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function Sidebar() {
  const pathname =
    usePathname();

  const {
    data: session,
  } = useSession();

  const [hovered, setHovered] =
    useState<string | null>(
      null
    );

  const [scrolled, setScrolled] =
    useState(false);

  const [bio, setBio] =
    useState("");

  const [photo, setPhoto] =
    useState<string | null>(
      null
    );

  // ─────────────────────────────
  // LOAD BIO + PHOTO
  // ─────────────────────────────

 useEffect(() => {
  if (!session?.user?.email)
    return;

  const loadProfile = () => {
    const savedBio =
      localStorage.getItem(
        `bio_${session.user.email}`
      ) || "";

    const savedPhoto =
      localStorage.getItem(
        `profilePhoto_${session.user.email}`
      );

    setBio(savedBio);

    setPhoto(savedPhoto);
  };

  loadProfile();

  window.addEventListener(
    "profileUpdated",
    loadProfile
  );

  return () => {
    window.removeEventListener(
      "profileUpdated",
      loadProfile
    );
  };
}, [session]);

  // ─────────────────────────────
  // SCROLL EFFECT
  // ─────────────────────────────

  useEffect(() => {
    const onScroll = () => {
      setScrolled(
        window.scrollY > 40
      );
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

  // ─────────────────────────────
  // USER
  // ─────────────────────────────

  const user =
    buildUserState({
      name:
        session?.user?.name ||
        "User",

      bio,

      photo,
    });

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
        transition:
          "all 0.35s ease",
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",

        boxShadow: scrolled
          ? "4px 0 24px rgba(180, 87, 67, 0.10), 2px 0 8px rgba(0,0,0,0.06)"
          : "none",
      }}
    >
      {/* LOGO */}
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
        }}
      >
        <Image
          src="/images/logo.png"
          alt="LaporinAja"
          width={150}
          height={38}
        />
      </div>

      {/* PROFILE */}
      <div
        style={{
          padding:
            "16px 16px 12px",
        }}
      >
        <Link
          href="/user/profile"
          style={{
            textDecoration:
              "none",
          }}
        >
          <div
            style={{
              backgroundColor:
                hovered ===
                "profile"
                  ? BRAND_DARK
                  : BRAND,

              borderRadius:
                "14px",

              padding:
                "13px 14px",

              display: "flex",

              alignItems:
                "center",

              gap: "12px",

              cursor: "pointer",
            }}
            onMouseEnter={() =>
              setHovered(
                "profile"
              )
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
                borderRadius:
                  "50%",
                overflow:
                  "hidden",
                backgroundColor:
                  "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize: "14px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {user.photo ? (
                <img
                  src={user.photo}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height:
                      "100%",
                    objectFit:
                      "cover",
                  }}
                />
              ) : (
                user.initials
              )}
            </div>

            {/* USER */}
            <div
              style={{
                overflow:
                  "hidden",
                flex: 1,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize:
                    "14px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {user.name}
              </p>

              {user.bio && (
                <p
                  style={{
                    margin:
                      "3px 0 0",
                    fontSize:
                      "11px",
                    color:
                      "rgba(255,255,255,0.75)",
                  }}
                >
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
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

            return (
              <button
                key={href}
                onClick={() =>
                  (window.location.href =
                    href)
                }
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                  padding:
                    "11px 14px",
                  borderRadius:
                    "10px",
                  marginBottom:
                    "4px",
                  width: "100%",
                  border: "none",

                  backgroundColor:
                    isActive
                      ? BRAND
                      : "transparent",

                  cursor: "pointer",
                }}
              >
                <Icon
                  size={20}
                  color={
                    isActive
                      ? "#fff"
                      : "#6B7280"
                  }
                />

                <span
                  style={{
                    color:
                      isActive
                        ? "#fff"
                        : "#374151",
                  }}
                >
                  {label}
                </span>
              </button>
            );
          }
        )}
      </nav>

      {/* LOGOUT */}
      <div
        style={{
          padding:
            "0 12px 24px",
        }}
      >
        <button
          onClick={() =>
            signOut({
              callbackUrl:
                "/auth/login",
            })
          }
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: "12px",
            padding:
              "11px 14px",
            borderRadius:
              "10px",
            width: "100%",
            border: "none",
            cursor: "pointer",
          }}
        >
          <LogOut size={20} />

          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}