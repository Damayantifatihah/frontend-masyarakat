"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Construction,
  Lightbulb,
  Recycle,
  TriangleAlert,
  Palette,
  FileX,
  MessageSquareMore,
  CalendarDays,
} from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const PRIMARY = "#B45743";
const PRIMARY_DARK = "#8B3A2A";
const PRIMARY_BG = "#F9EAE7";
const PRIMARY_BORDER = "#F0D0C8";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Laporan {
  id: number;
  user_id: number;
  judul_laporan: string;
  isi_laporan: string;
  lokasi: string;
  tanggal_kejadian: string;
  status: "verifikasi" | "proses" | "selesai" | "ditolak";
  gambar?: string[];
  category_name: string;
  tanggapan?: string | null;
}

type StatusKey = "Verifikasi" | "Diproses" | "Selesai" | "Ditolak";

// ─────────────────────────────────────────────
// CATEGORY CONFIG
// ─────────────────────────────────────────────

const catCfg: Record<
  string,
  {
    Icon: React.ElementType;
    barColor: string;
    iconBg: string;
    iconColor: string;
    tagBg: string;
    tagColor: string;
    tagBorder: string;
    leftBorder: string;
  }
> = {
  Infrastruktur: {
    Icon: Construction,
    barColor: "#F97316",
    iconBg: "#FFF7ED",
    iconColor: "#EA580C",
    tagBg: "#FFF7ED",
    tagColor: "#C2410C",
    tagBorder: "#FED7AA",
    leftBorder: "#FED7AA",
  },
  Penerangan: {
    Icon: Lightbulb,
    barColor: "#EAB308",
    iconBg: "#FEFCE8",
    iconColor: "#CA8A04",
    tagBg: "#FEFCE8",
    tagColor: "#92400E",
    tagBorder: "#FEF08A",
    leftBorder: "#FEF08A",
  },
  Kebersihan: {
    Icon: Recycle,
    barColor: "#22C55E",
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    tagBg: "#F0FDF4",
    tagColor: "#166534",
    tagBorder: "#BBF7D0",
    leftBorder: "#BBF7D0",
  },
  Kedaruratan: {
    Icon: TriangleAlert,
    barColor: "#EF4444",
    iconBg: "#FEF2F2",
    iconColor: "#DC2626",
    tagBg: "#FEF2F2",
    tagColor: "#991B1B",
    tagBorder: "#FECACA",
    leftBorder: "#FECACA",
  },
  Keindahan: {
    Icon: Palette,
    barColor: "#A855F7",
    iconBg: "#FAF5FF",
    iconColor: "#9333EA",
    tagBg: "#FAF5FF",
    tagColor: "#6B21A8",
    tagBorder: "#E9D5FF",
    leftBorder: "#E9D5FF",
  },
  Lingkungan: {
    Icon: Recycle,
    barColor: "#10B981",
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    tagBg: "#ECFDF5",
    tagColor: "#065F46",
    tagBorder: "#A7F3D0",
    leftBorder: "#A7F3D0",
  },
  "Lalu Lintas": {
    Icon: Construction,
    barColor: "#0EA5E9",
    iconBg: "#F0F9FF",
    iconColor: "#0284C7",
    tagBg: "#F0F9FF",
    tagColor: "#075985",
    tagBorder: "#BAE6FD",
    leftBorder: "#BAE6FD",
  },
  Pengaduan: {
    Icon: MessageSquareMore,
    barColor: "#F59E0B",
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    tagBg: "#FFFBEB",
    tagColor: "#92400E",
    tagBorder: "#FDE68A",
    leftBorder: "#FDE68A",
  },
};

const defaultCat = {
  Icon: MessageSquareMore,
  barColor: "#9CA3AF",
  iconBg: "#F9FAFB",
  iconColor: "#6B7280",
  tagBg: "#F3F4F6",
  tagColor: "#374151",
  tagBorder: "#E5E7EB",
  leftBorder: "#E5E7EB",
};

// ─────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────

const stCfg: Record<
  StatusKey,
  {
    Icon: React.ElementType;
    barColor: string;
    iconColor: string;
    bg: string;
    color: string;
    border: string;
    numColor: string;
    iconBg: string;
    label: string;
  }
> = {
  Verifikasi: {
    Icon: Clock,
    barColor: "#3B82F6",
    iconColor: "#3B82F6",
    bg: "#EFF6FF",
    color: "#1D4ED8",
    border: "#BFDBFE",
    numColor: "#2563EB",
    iconBg: "#DBEAFE",
    label: "Menunggu Verifikasi",
  },
  Diproses: {
    Icon: Clock,
    barColor: "#F59E0B",
    iconColor: "#D97706",
    bg: "#FFFBEB",
    color: "#92400E",
    border: "#FDE68A",
    numColor: "#D97706",
    iconBg: "#FEF3C7",
    label: "Sedang Diproses",
  },
  Selesai: {
    Icon: CheckCircle2,
    barColor: "#22C55E",
    iconColor: "#16A34A",
    bg: "#F0FDF4",
    color: "#166534",
    border: "#BBF7D0",
    numColor: "#16A34A",
    iconBg: "#DCFCE7",
    label: "Selesai",
  },
  Ditolak: {
    Icon: XCircle,
    barColor: "#EF4444",
    iconColor: "#DC2626",
    bg: "#FEF2F2",
    color: "#991B1B",
    border: "#FECACA",
    numColor: "#DC2626",
    iconBg: "#FEE2E2",
    label: "Ditolak",
  },
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const formatTanggal = (raw: string) => {
  if (!raw) return "-";
  try {
    return new Date(raw).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return raw;
  }
};

const formatStatus = (status: string): StatusKey => {
  switch (status?.toLowerCase()) {
    case "proses":
      return "Diproses";
    case "selesai":
      return "Selesai";
    case "ditolak":
      return "Ditolak";
    default:
      return "Verifikasi";
  }
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function LaporanSaya() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const statuses = ["Semua", "Verifikasi", "Diproses", "Selesai", "Ditolak"];

  // ─────────────────────────────────────────
  // FETCH
  // ─────────────────────────────────────────

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setLaporan([]);
          return;
        }

        const res = await api.get("/laporan/saya", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data || [];

        const formatted = data.map((item: any) => {
          let parsedGambar: string[] = [];

          if (Array.isArray(item.gambar)) {
            parsedGambar = item.gambar;
          } else if (typeof item.gambar === "string") {
            try {
              const parsed = JSON.parse(item.gambar);
              parsedGambar = Array.isArray(parsed) ? parsed : [item.gambar];
            } catch {
              parsedGambar = item.gambar.trim() ? [item.gambar] : [];
            }
          }

          let tanggapan = item.tanggapan;

          if (tanggapan && typeof tanggapan === "object") {
            tanggapan =
              tanggapan.tanggapan ||
              tanggapan.isi ||
              tanggapan.message ||
              "";
          }

          return { ...item, gambar: parsedGambar, tanggapan };
        });

        setLaporan(formatted);
      } catch (error) {
        console.error("ERROR FETCH LAPORAN:", error);
        setLaporan([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  // ─────────────────────────────────────────
  // COUNT & FILTER
  // ─────────────────────────────────────────

  const countOf = (s: string) =>
    laporan.filter((r) => formatStatus(r.status) === s).length;

  const filtered = laporan.filter((r) => {
    const sf = formatStatus(r.status);
    const matchStatus = filter === "Semua" || sf === filter;
    const matchSearch =
      !search ||
      r.judul_laporan?.toLowerCase().includes(search.toLowerCase()) ||
      r.lokasi?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F8F8] font-[Plus_Jakarta_Sans,sans-serif] px-4 md:px-9 py-8">
      <div className="max-w-[860px] mx-auto">

        {/* HEADER */}
        <div className="mb-7">
          <h1 className="text-[22px] font-extrabold text-gray-900">
            Laporan Saya
          </h1>
          <p className="mt-1 text-[13px] text-gray-400">
            Pantau semua status laporan yang telah Anda kirimkan
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[14px] mb-6">
          {(["Verifikasi", "Diproses", "Selesai", "Ditolak"] as StatusKey[]).map((s) => {
            const c = stCfg[s];
            return (
              <div
                key={s}
                className="bg-white rounded-[14px] px-[18px] py-4 border border-[#F0F0F0] overflow-hidden relative"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: c.barColor }}
                />
                <div className="flex justify-between items-start mb-2">
                  <div
                    className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center"
                    style={{ background: c.iconBg }}
                  >
                    <c.Icon size={18} color={c.iconColor} />
                  </div>
                  <span
                    className="text-[26px] font-extrabold leading-none"
                    style={{ color: c.numColor }}
                  >
                    {countOf(s)}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.06em]">
                  {s}
                </p>
              </div>
            );
          })}
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white rounded-[14px] border border-[#F0F0F0] p-4 mb-6">
          <div className="relative mb-[14px]">
            <Search
              size={16}
              color="#9CA3AF"
              className="absolute left-[14px] top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-[10px] pl-10 pr-[14px] rounded-[10px] border-[1.5px] border-gray-200 text-[13px] outline-none bg-gray-50 text-gray-900"
            />
          </div>

          <div className="flex gap-2 flex-wrap pt-3 border-t border-gray-100">
            {statuses.map((s) => {
              const active = filter === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className="py-[7px] px-4 rounded-full text-xs font-bold transition-all border"
                  style={{
                    border: `1.5px solid ${active ? PRIMARY : "#E5E7EB"}`,
                    background: active ? PRIMARY : "#fff",
                    color: active ? "#fff" : "#6B7280",
                  }}
                >
                  {s}
                  {s !== "Semua" && ` (${countOf(s)})`}
                </button>
              );
            })}
            <span className="ml-auto text-xs text-gray-400 self-center">
              {filtered.length} laporan
            </span>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-[60px] text-gray-400">
            <div
              className="w-8 h-8 rounded-full border-[3px] animate-spin mx-auto mb-3"
              style={{ borderColor: PRIMARY_BG, borderTopColor: PRIMARY }}
            />
            <p className="text-[13px] font-medium">Memuat laporan...</p>
          </div>

        ) : filtered.length === 0 ? (
          // EMPTY
          <div className="bg-white rounded-2xl border border-[#F0F0F0] py-[60px] px-6 text-center">
            <div className="w-14 h-14 rounded-[14px] bg-gray-100 flex items-center justify-center mx-auto mb-[14px]">
              <FileX size={28} color="#D1D5DB" />
            </div>
            <p className="text-[15px] font-bold text-gray-700">
              Tidak ada laporan ditemukan
            </p>
            <p className="mt-[6px] text-[13px] text-gray-400">
              Coba sesuaikan kata kunci atau filter status.
            </p>
          </div>

        ) : (
          // LIST
          <div className="flex flex-col gap-4">
            {filtered.map((r) => {
              const sf = formatStatus(r.status);
              const cc = catCfg[r.category_name] ?? defaultCat;
              const sc = stCfg[sf];

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden relative"
                >
                  {/* COLOR BAR */}
                  <div className="h-1" style={{ background: cc.barColor }} />

                  <div className="px-[22px] py-5 flex flex-col gap-4">

                    {/* TOP ROW */}
                    <div className="flex items-center justify-between flex-wrap gap-[10px]">
                      <div className="flex items-center gap-[10px]">
                        <div
                          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
                          style={{ background: cc.iconBg }}
                        >
                          <cc.Icon size={16} color={cc.iconColor} />
                        </div>
                        <span
                          className="text-xs font-bold py-1 px-3 rounded-full border"
                          style={{
                            background: cc.tagBg,
                            color: cc.tagColor,
                            borderColor: cc.tagBorder,
                          }}
                        >
                          {r.category_name}
                        </span>
                      </div>

                      <span
                        className="inline-flex items-center gap-[6px] py-[5px] px-3 rounded-full text-xs font-bold border"
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          borderColor: sc.border,
                        }}
                      >
                        <sc.Icon size={13} color={sc.iconColor} />
                        {sc.label}
                      </span>
                    </div>

                    {/* JUDUL */}
                    <h2 className="text-[17px] font-extrabold text-gray-900 leading-snug">
                      {r.judul_laporan}
                    </h2>

                    {/* INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        {
                          Icon: MapPin,
                          color: PRIMARY,
                          label: "Lokasi",
                          value: r.lokasi || "-",
                        },
                        {
                          Icon: CalendarDays,
                          color: "#2563EB",
                          label: "Tanggal Kejadian",
                          value: formatTanggal(r.tanggal_kejadian),
                        },
                      ].map(({ Icon, color, label, value }) => (
                        <div
                          key={label}
                          className="bg-gray-50 rounded-xl px-[14px] py-3 flex items-center gap-[10px] border border-[#F0F0F0]"
                        >
                          <div className="w-[34px] h-[34px] rounded-[10px] bg-white flex items-center justify-center shrink-0 border border-[#F0F0F0]">
                            <Icon size={16} color={color} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.06em]">
                              {label}
                            </p>
                            <p className="mt-[2px] text-[13px] font-semibold text-gray-600 truncate">
                              {value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* DESKRIPSI */}
                    <div>
                      <p className="mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.06em]">
                        Deskripsi Laporan
                      </p>
                      <div
                        className="bg-gray-50 rounded-xl px-4 py-[14px] border border-[#F0F0F0]"
                        style={{ borderLeftWidth: 4, borderLeftColor: cc.leftBorder }}
                      >
                        <p className="text-[13px] text-gray-500 leading-[1.7] whitespace-pre-wrap">
                          {r.isi_laporan}
                        </p>
                      </div>
                    </div>

                    {/* FOTO */}
                    {r.gambar && r.gambar.length > 0 && (
                      <div>
                        <p className="mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.06em]">
                          Foto Lampiran ({r.gambar.length})
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px]">
                          {r.gambar.map((img, idx) => (
                            <div
                              key={idx}
                              className="aspect-square rounded-xl overflow-hidden border border-[#F0F0F0] bg-gray-100"
                            >
                              <img
                                src={img}
                                alt={`Foto ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/images/placeholder.png";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TANGGAPAN */}
                    {typeof r.tanggapan === "string" && r.tanggapan.trim() !== "" && (
                      <div
                        className="rounded-xl px-4 py-[14px] border"
                        style={{ background: PRIMARY_BG, borderColor: PRIMARY_BORDER }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-[30px] h-[30px] rounded-lg flex items-center justify-center"
                            style={{ background: "#F0D0C8" }}
                          >
                            <MessageSquareMore size={14} color={PRIMARY} />
                          </div>
                          <p
                            className="text-xs font-extrabold"
                            style={{ color: PRIMARY_DARK }}
                          >
                            Tanggapan Resmi Admin
                          </p>
                        </div>
                        <p className="text-[13px] text-gray-600 leading-[1.7] whitespace-pre-wrap">
                          {r.tanggapan}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}