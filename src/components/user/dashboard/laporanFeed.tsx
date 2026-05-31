"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import LaporanCard from "./laporanCard";

interface Laporan {
  id: number;
  judul_laporan: string;
  isi_laporan: string;
  lokasi: string;
  status: string;
  gambar: string[];
  user_name: string;
  created_at?: string;
}

export default function LaporanFeed() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchLaporan = async () => {
    try {
      setError(false);
      const res = await api.get("/laporan");
      setLaporan(res.data.data);
    } catch (err) {
      console.error("Gagal memuat laporan:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 0",
          color: "#9CA3AF",
          fontSize: "13px",
          gap: "8px",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: "spin 1s linear infinite" }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        Memuat laporan...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 0",
          gap: "12px",
        }}
      >
        <p style={{ margin: 0, fontSize: "13px", color: "#6B7280" }}>
          Gagal memuat laporan.
        </p>
        <button
          onClick={fetchLaporan}
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#fff",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            color: "#374151",
          }}
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (laporan.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 0",
          gap: "8px",
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
        </svg>
        <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF" }}>
          Belum ada laporan.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Section label */}
      <p
        style={{
          margin: "0 0 12px",
          fontSize: "11px",
          fontWeight: 700,
          color: "#9CA3AF",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        Laporan Terbaru
      </p>

      {/* Feed */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
        }}
      >
        {laporan.map((item) => (
          <LaporanCard key={item.id} laporan={item} />
        ))}
      </div>
    </div>
  );
}