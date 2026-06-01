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
  const [error, setError]     = useState(false);

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

  useEffect(() => { fetchLaporan(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-gray-400 text-[13px]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Memuat laporan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <p className="text-[13px] text-gray-500">Gagal memuat laporan.</p>
        <button
          onClick={fetchLaporan}
          className="px-5 py-2 rounded-lg border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors font-[inherit]"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (laporan.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
        </svg>
        <p className="text-[13px] text-gray-400">Belum ada laporan.</p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* ── SECTION HEADER ── */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 rounded-full bg-[#B45743]" />
          <span className="text-sm font-bold text-gray-700 tracking-wide">
            Laporan Terbaru
          </span>
        </div>
        <span className="text-xs font-semibold text-[#B45743] bg-[#F9EAE7] border border-[#F0D0C8] px-2.5 py-1 rounded-full">
          {laporan.length} laporan
        </span>
      </div>

      {/* ── CARDS ── */}
      <div className="flex flex-col gap-4 w-full">
        {laporan.map((item) => (
          <LaporanCard key={item.id} laporan={item} />
        ))}
      </div>

    </div>
  );
}