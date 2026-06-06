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

const STATUS_CONFIG: Record<
  string,
  {
    bg: string;
    text: string;
    dot: string;
    label: string;
  }
> = {
  verifikasi: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
    label: "Menunggu",
  },

  proses: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    label: "Diproses",
  },

  selesai: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Selesai",
  },

  ditolak: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    label: "Ditolak",
  },
};

const AVATAR_COLORS = [
  "from-yellow-300 to-amber-400",
  "from-emerald-300 to-teal-400",
  "from-blue-300 to-blue-500",
  "from-pink-300 to-rose-400",
  "from-violet-300 to-purple-400",
  "from-orange-300 to-orange-500",
];

function getAvatarGradient(name: string) {
  return AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
}

export default function LaporanCard({ laporan }: Props) {
  const status = STATUS_CONFIG[laporan.status] ?? STATUS_CONFIG.verifikasi;

  const formattedDate = laporan.created_at
    ? new Date(laporan.created_at).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(laporan.user_name)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
            {laporan.user_name?.charAt(0)?.toUpperCase()}
          </div>

          {/* Name + meta */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-bold text-gray-900 leading-none">
              {laporan.user_name}
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate max-w-[240px]">
                <MapPin size={10} strokeWidth={2} className="shrink-0" />
                {laporan.lokasi}
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1 text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                  <span className="text-gray-200">·</span>
                  <Calendar size={10} strokeWidth={2} className="shrink-0" />
                  {formattedDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <span className={`flex items-center gap-1.5 ${status.bg} ${status.text} px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap shrink-0 ml-4`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* ── IMAGE: full bleed, object-contain, tidak dipotong ── */}
      {laporan.gambar?.length > 0 && (
        <div className="w-full bg-gray-50 border-y border-gray-100">
          <img
            src={laporan.gambar[0]}
            alt={laporan.judul_laporan}
            className="w-full max-h-[320px] object-contain block"
            onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.png"; }}
          />
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="px-5 pt-4 pb-3">
        <h2 className="text-[15px] font-bold text-gray-900 leading-snug mb-1.5">
          {laporan.judul_laporan}
        </h2>
        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">
          {laporan.isi_laporan}
        </p>
      </div>

      {/* ── DIVIDER ── */}
      <div className="border-t border-gray-100 mx-5" />

      {/* ── COMMENT SECTION ── */}
      <div className="px-5 py-4">
        <CommentSection laporanId={laporan.id} />
      </div>

    </div>
  );
}