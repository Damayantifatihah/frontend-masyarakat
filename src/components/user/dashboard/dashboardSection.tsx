"use client";

import Image from "next/image";

import {
  useSession,
} from "next-auth/react";

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
  // =========================
  // SESSION
  // =========================

  const {
    data: session,
  } = useSession();

  const userName =
    session?.user?.name ||
    "User";

  // =========================
  // DATE
  // =========================

  const today =
    new Date().toLocaleDateString(
      "id-ID",
      {
        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric",
      }
    );

  // =========================
  // STATS
  // =========================

  const stats = [
    {
      label: "Total Laporan",

      value: totalLaporan,

      iconBg: "#EFF6FF",

      iconColor: "#3B82F6",

      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />

          <rect
            x="9"
            y="3"
            width="6"
            height="4"
            rx="1"
          />

          <line
            x1="9"
            y1="12"
            x2="15"
            y2="12"
          />

          <line
            x1="9"
            y1="16"
            x2="13"
            y2="16"
          />
        </svg>
      ),
    },

    {
      label: "Laporan Selesai",

      value: selesai,

      iconBg: "#F0FDF4",

      iconColor: "#22C55E",

      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />

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
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />

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
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />

          <line
            x1="15"
            y1="9"
            x2="9"
            y2="15"
          />

          <line
            x1="9"
            y1="9"
            x2="15"
            y2="15"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        fontFamily:
          "'Plus Jakarta Sans', sans-serif",

        display: "flex",

        flexDirection:
          "column",

        gap: "18px",

        width: "100%",
      }}
    >
      {/* HERO SECTION */}
      <div
        style={{
          position: "relative",

          width: "100%",

          minHeight: "200px",

          borderRadius: "20px",

          overflow: "hidden",

          display: "flex",

          alignItems: "center",

          padding: "36px",

          boxSizing:
            "border-box",

          background:
            "linear-gradient(135deg, #FFF0E8 0%, #FDDCC8 50%, #FDC9AA 100%)",
        }}
      >
        {/* BACKGROUND */}
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
            position:
              "absolute",

            inset: 0,

            background:
              "linear-gradient(90deg, rgba(255,244,238,0.97) 0%, rgba(255,244,238,0.80) 45%, rgba(255,244,238,0.15) 100%)",

            zIndex: 1,
          }}
        />

        {/* CONTENT */}
        <div
          style={{
            position:
              "relative",

            zIndex: 2,
          }}
        >
          <p
            style={{
              fontSize: "11px",

              fontWeight: 700,

              letterSpacing:
                "0.1em",

              textTransform:
                "uppercase",

              color: "#8B3A2A",

              marginBottom:
                "10px",
            }}
          >
            {today}
          </p>

          <p
            style={{
              fontSize: "15px",

              color: "#8B5E3C",

              marginBottom:
                "4px",
            }}
          >
            Selamat datang,
          </p>

          <h1
            style={{
              fontSize: "38px",

              fontWeight: 800,

              color: "#8B3A2A",

              lineHeight: 1.1,

              marginBottom:
                "12px",
            }}
          >
            {userName}
          </h1>

          <p
            style={{
              fontSize: "14px",

              color: "#A06040",

              maxWidth: "420px",

              lineHeight: 1.7,
            }}
          >
            Kelola laporan kamu
            dengan mudah dan
            cepat.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",

          gap: "16px",
        }}
      >
        {stats.map(
          (item, index) => (
            <div
              key={index}
              style={{
                background:
                  "#fff",

                borderRadius:
                  "18px",

                padding: "20px",

                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.05)",

                border:
                  "1px solid #f3f4f6",

                display: "flex",

                alignItems:
                  "center",

                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "52px",

                  height: "52px",

                  borderRadius:
                    "14px",

                  background:
                    item.iconBg,

                  color:
                    item.iconColor,

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>

              <div>
                <p
                  style={{
                    margin: 0,

                    fontSize:
                      "13px",

                    color:
                      "#6B7280",

                    marginBottom:
                      "4px",
                  }}
                >
                  {item.label}
                </p>

                <h3
                  style={{
                    margin: 0,

                    fontSize:
                      "28px",

                    fontWeight:
                      800,

                    color:
                      "#111827",
                  }}
                >
                  {item.value}
                </h3>
              </div>
            </div>
          )
        )}
      </div>

      {/* TIPS */}
      <div
        style={{
          display: "flex",

          alignItems:
            "flex-start",

          gap: "10px",

          background:
            "#FEF3C7",

          border:
            "1px solid #FCD34D",

          padding: "16px 18px",

          borderRadius:
            "16px",
        }}
      >
        <span
          style={{
            fontSize: "18px",

            marginTop: "1px",

            flexShrink: 0,
          }}
        >
          💡
        </span>

        <p
          style={{
            margin: 0,

            fontSize: "13px",

            color: "#92400E",

            lineHeight: 1.7,
          }}
        >
          <strong>Tips:</strong>{" "}
          Sertakan foto dan
          titik lokasi yang
          jelas agar laporan
          kamu diproses lebih
          cepat oleh petugas.
        </p>
      </div>
    </div>
  );
}