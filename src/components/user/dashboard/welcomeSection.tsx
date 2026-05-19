"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getUser } from "@/lib/auth";

interface WelcomeSectionProps {
  totalLaporan?: number;
  diproses?: number;
  selesai?: number;
  ditolak?: number;
}

export default function WelcomeSection({
  totalLaporan = 12,
  diproses = 4,
  selesai = 7,
  ditolak = 1,
}: WelcomeSectionProps) {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = getUser();

    if (user) {
      setUserName(user.name);
    }
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      label: "Total Laporan",
      value: totalLaporan,
      color: "#E8763A",
      bg: "#FEF0E8",
      icon: "📋",
    },
    {
      label: "Diproses",
      value: diproses,
      color: "#D97706",
      bg: "#FEF3C7",
      icon: "⏳",
    },
    {
      label: "Selesai",
      value: selesai,
      color: "#16A34A",
      bg: "#DCFCE7",
      icon: "✅",
    },
    {
      label: "Ditolak",
      value: ditolak,
      color: "#DC2626",
      bg: "#FEE2E2",
      icon: "✗",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        width: "100%",
      }}
    >
      {/* HERO SECTION */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "210px",
          borderRadius: "24px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "36px",
          boxSizing: "border-box",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* BACKGROUND IMAGE */}
        <Image
          src="/images/welcome.png"
          alt="Background"
          fill
          style={{
            objectFit: "cover",
          }}
        />

        {/* OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(255,244,238,0.95) 0%, rgba(255,244,238,0.75) 45%, rgba(255,244,238,0.2) 100%)",
            zIndex: 1,
          }}
        />

        {/* CONTENT */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#C95E24",
              marginBottom: "8px",
            }}
          >
            {today}
          </p>

          <p
            style={{
              fontSize: "18px",
              color: "#7C4A1E",
              marginBottom: "4px",
            }}
          >
            Selamat datang,
          </p>

          <h1
            style={{
              fontSize: "42px",
              fontWeight: 800,
              color: "#C95E24",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            {userName}
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#8B5E3C",
              maxWidth: "480px",
              lineHeight: 1.7,
            }}
          >
            Kelola laporan kamu dengan mudah dan cepat.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #F1F1F1",
              borderRadius: "18px",
              padding: "18px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 800,
                  color: s.color,
                }}
              >
                {s.value}
              </p>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "#9CA3AF",
                }}
              >
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TIPS */}
      <div
        style={{
          borderRadius: "16px",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "#FEF0E8",
          border: "1px solid #FDDCCA",
        }}
      >
        <span style={{ fontSize: "18px" }}>💡</span>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#92400E",
            lineHeight: 1.7,
          }}
        >
          <strong>Tips:</strong> Sertakan foto dan titik lokasi yang jelas
          agar laporan kamu diproses lebih cepat oleh petugas.
        </p>
      </div>
    </div>
  );
}