"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

interface WelcomeSectionProps {
  totalLaporan?: number;
  diproses?: number;
  selesai?: number;
  ditolak?: number;
}

export default function WelcomeSection({
  totalLaporan = 12,
  diproses = 2,
  selesai = 7,
  ditolak = 1,
}: WelcomeSectionProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";

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
      iconBg: "#EFF6FF",
      iconColor: "#3B82F6",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      ),
    },
    {
      label: "Laporan Selesai",
      value: selesai,
      iconBg: "#F0FDF4",
      iconColor: "#22C55E",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
    {
      label: "Sedang Diproses",
      value: diproses,
      iconBg: "#FFFBEB",
      iconColor: "#F59E0B",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Ditolak",
      value: ditolak,
      iconBg: "#FEF2F2",
      iconColor: "#EF4444",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "28px 32px",
        boxSizing: "border-box",
      }}
    >
      {/* HERO */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "160px",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "24px 28px",
          boxSizing: "border-box",
          background: "linear-gradient(135deg, #FFF0E8 0%, #FDDCC8 50%, #FDC9AA 100%)",
          border: "1px solid #FDDCC8",
        }}
      >
        <Image
          src="/images/welcome.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(255,244,238,0.97) 0%, rgba(255,244,238,0.80) 45%, rgba(255,244,238,0.15) 100%)",
            zIndex: 1,
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8B3A2A",
              marginBottom: "6px",
            }}
          >
            {today}
          </p>
          <p style={{ fontSize: "13px", color: "#8B5E3C", marginBottom: "2px" }}>
            Selamat datang,
          </p>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "#8B3A2A",
              lineHeight: 1.2,
              marginBottom: "6px",
            }}
          >
            {userName}
          </h1>
          <p style={{ fontSize: "13px", color: "#A06040", maxWidth: "380px", lineHeight: 1.6 }}>
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
        {stats.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              border: "1px solid #F3F4F6",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: item.iconBg,
                color: item.iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                {item.value}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#6B7280" }}>
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TIPS */}
      <div
        style={{
          background: "#006D62",
          borderRadius: "12px",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          💡
        </div>
        <div>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#FFFFFF", marginBottom: "2px" }}>
            Tips: Pastikan foto laporan jelas &amp; terang
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
            Sertakan foto dan titik lokasi yang jelas agar laporan kamu diproses lebih cepat oleh petugas.
          </p>
        </div>
      </div>
    </div>
  );
}