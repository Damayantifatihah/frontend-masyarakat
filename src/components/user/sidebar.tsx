"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, FileText, BarChart2, LogOut } from "lucide-react";

import { getUser, logout } from "@/lib/auth";

const navItems = [
  { label: "Beranda", href: "/user", icon: Home },
  { label: "Buat Laporan", href: "/user/buatlaporan", icon: BarChart2 },
  { label: "Laporan Saya", href: "/user/laporan-saya", icon: FileText },
];

const defaultUser = {
  name: "User",
  bio: "",
  initials: "U",
};

function buildUserState(base: { name?: string; bio?: string }) {
  const name = base.name || "User";
  const bio = base.bio || "";
  const initials = name
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase();
  return { name, bio, initials };
}

export default function Sidebar() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [user, setUser] = useState(defaultUser);

  // Baca data user: gabungkan getUser() + override dari localStorage "userProfile"
  const loadUser = () => {
    const currentUser = getUser();
    const base = currentUser ? { name: currentUser.name, bio: currentUser.bio } : {};

    // Ambil bio dari hasil edit profil — nama TIDAK di-override, selalu dari auth
    try {
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        const parsed = JSON.parse(saved);
        base.bio = parsed.bio ?? base.bio;
      }
    } catch {
      // ignore parse error
    }

    setUser(buildUserState(base));
  };

  useEffect(() => {
    loadUser();

    // Update sidebar setiap kali ProfilePage dispatch event "storage"
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  return (
    <aside
      style={{
        width: "280px",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #F0EFEF",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid #F5F5F5",
        }}
      >
        <Image
          src="/images/logo.png"
          alt="LaporinAja"
          width={160}
          height={40}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* User Profile */}
      <div style={{ padding: "20px 20px 16px" }}>
        <Link href="/user/profile" style={{ textDecoration: "none" }}>
          <div
            style={{
              backgroundColor: hovered === "profile" ? "#D96A30" : "#E8763A",
              borderRadius: "14px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={() => setHovered("profile")}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Avatar */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {user.initials}
            </div>

            {/* User Info */}
            <div style={{ overflow: "hidden", flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </p>

              {/* FIX: bio sekarang muncul karena loadUser() baca dari localStorage "userProfile" */}
              {user.bio && (
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.75)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.bio}
                </p>
              )}
            </div>

            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "18px" }}>
              ›
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "8px 16px", flex: 1 }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          const isHovered = hovered === href;

          return (
            <button
              key={href}
              onClick={() => (window.location.href = href)}
              onMouseEnter={() => setHovered(href)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "10px",
                marginBottom: "4px",
                width: "100%",
                border: "none",
                backgroundColor: isActive
                  ? "#E8763A"
                  : isHovered
                  ? "#FEF0E8"
                  : "transparent",
                borderLeft: isActive
                  ? "3px solid #C95E24"
                  : "3px solid transparent",
                transition: "all 0.15s ease",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Icon
                size={20}
                color={isActive ? "#fff" : isHovered ? "#E8763A" : "#6B7280"}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#fff" : isHovered ? "#E8763A" : "#374151",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0 16px 24px" }}>
        <div
          style={{
            height: "1px",
            backgroundColor: "#F0EFEF",
            marginBottom: "12px",
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
              hovered === "logout" ? "#FEF0E8" : "transparent",
            cursor: "pointer",
            transition: "background-color 0.15s",
          }}
          onMouseEnter={() => setHovered("logout")}
          onMouseLeave={() => setHovered(null)}
          onClick={logout}
        >
          <LogOut
            size={20}
            color={hovered === "logout" ? "#E8763A" : "#6B7280"}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: hovered === "logout" ? "#E8763A" : "#6B7280",
            }}
          >
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}