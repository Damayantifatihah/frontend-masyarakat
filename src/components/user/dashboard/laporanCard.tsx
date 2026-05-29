
"use client";

import {
  MapPin,
  MessageCircle,
} from "lucide-react";

import CommentSection from "./commentsSection";

interface Props {
  laporan: {
    id: number;
    judul_laporan: string;
    isi_laporan: string;
    lokasi: string;
    status: string;
    gambar: string[];
    user_name: string;
    created_at?: string;
  };
}

export default function LaporanCard({
  laporan,
}: Props) {
  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "selesai":
        return "#16A34A";

      case "diproses":
        return "#D97706";

      case "ditolak":
        return "#DC2626";

      default:
        return "#2563EB";
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "24px",
        border: "1px solid #eee",
        overflow: "hidden",
        boxShadow:
          "0 6px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* AVATAR */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "999px",
              background:
                "linear-gradient(135deg,#F59E0B,#EF4444)",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            {laporan.user_name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          {/* USER */}
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {laporan.user_name}
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginTop: "4px",
                color: "#6B7280",
                fontSize: "12px",
              }}
            >
              <MapPin size={13} />

              {laporan.lokasi}
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div
          style={{
            background:
              getStatusColor(
                laporan.status
              ),
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600,
            textTransform:
              "capitalize",
          }}
        >
          {laporan.status}
        </div>
      </div>

      {/* IMAGE */}
     ```tsx
{/* IMAGE */}
{laporan.gambar?.length > 0 && (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: "420px",
    }}
  >
    <img
      src={laporan.gambar[0]}
      alt="gambar"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      onError={(e) => {
        (
          e.target as HTMLImageElement
        ).src =
          "/images/placeholder.png";
      }}
    />
  </div>
)}



      {/* CONTENT */}
      <div
        style={{
          padding: "20px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          {laporan.judul_laporan}
        </h2>

        <p
          style={{
            color: "#4B5563",
            lineHeight: 1.8,
            fontSize: "14px",
          }}
        >
          {laporan.isi_laporan}
        </p>

        {/* ACTION */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "18px",
            paddingTop: "18px",
            borderTop:
              "1px solid #f3f4f6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            <MessageCircle
              size={18}
            />

            Komentar
          </div>
        </div>

        {/* COMMENT */}
        <CommentSection
          laporanId={laporan.id}
        />
      </div>
    </div>
  );
}
