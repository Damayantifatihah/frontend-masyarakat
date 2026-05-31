"use client";

import { MapPin, Calendar } from "lucide-react";
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

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  selesai:  { bg: "#DCFCE7", text: "#15803D", label: "Selesai" },
  diproses: { bg: "#FEF3C7", text: "#B45309", label: "Diproses" },
  ditolak:  { bg: "#FEE2E2", text: "#B91C1C", label: "Ditolak" },
};

const DEFAULT_STATUS = { bg: "#DBEAFE", text: "#1D4ED8", label: "Menunggu" };

function avatarColor(name: string) {
  const colors = [
    ["#FDE68A", "#F59E0B"],
    ["#BFDBFE", "#3B82F6"],
    ["#BBF7D0", "#10B981"],
    ["#FBCFE8", "#EC4899"],
    ["#DDD6FE", "#8B5CF6"],
    ["#FED7AA", "#F97316"],
  ];
  const idx = (name?.charCodeAt(0) ?? 0) % colors.length;
  return colors[idx];
}

export default function LaporanCard({ laporan }: Props) {
  const status = STATUS_CONFIG[laporan.status] ?? DEFAULT_STATUS;

  const formattedDate = laporan.created_at
    ? new Date(laporan.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const [bgColor, textColor] = avatarColor(laporan.user_name);

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid #F0F0F0",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${bgColor}, ${textColor})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {laporan.user_name?.charAt(0)?.toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", lineHeight: 1 }}>
              {laporan.user_name}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", color: "#9CA3AF" }}>
                <MapPin size={10} strokeWidth={2} />
                {laporan.lokasi}
              </span>
              {formattedDate && (
                <>
                  <span style={{ color: "#E5E7EB" }}>·</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", color: "#9CA3AF" }}>
                    <Calendar size={10} strokeWidth={2} />
                    {formattedDate}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <span
          style={{
            background: status.bg,
            color: status.text,
            padding: "4px 12px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {status.label}
        </span>
      </div>

      {/* IMAGE — full bleed, no margin */}
      {laporan.gambar?.length > 0 && (
        <img
          src={laporan.gambar[0]}
          alt={laporan.judul_laporan}
          style={{
            width: "100%",
            height: "260px",
            objectFit: "contain",
            display: "block",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/placeholder.png";
          }}
        />
      )}

      {/* CONTENT */}
      <div style={{ padding: "14px 16px 0" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: "#1F2937", lineHeight: 1.4 }}>
          {laporan.judul_laporan}
        </h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#6B7280", lineHeight: 1.6 }}>
          {laporan.isi_laporan}
        </p>
      </div>

      {/* COMMENT SECTION — separated with bg */}
      <div
        style={{
          margin: "14px 16px 16px",
          background: "#F9FAFB",
          borderRadius: "14px",
          padding: "12px",
        }}
      >
        <CommentSection laporanId={laporan.id} />
      </div>
    </div>
  );
}