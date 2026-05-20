"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  X,
  FileX,
  MessageSquareMore,
  CalendarDays,
} from "lucide-react";

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
  tanggapan?: string;
}

type StatusKey =
  | "Verifikasi"
  | "Diproses"
  | "Selesai"
  | "Ditolak";

// ─────────────────────────────────────────────
// CATEGORY CONFIG
// ─────────────────────────────────────────────

const catCfg: Record<
  string,
  {
    Icon: React.ElementType;
    bar: string;
    iconBg: string;
    iconColor: string;
    tagBg: string;
    tagText: string;
    accentBorder: string;
  }
> = {
  Infrastruktur: {
    Icon: Construction,
    bar: "bg-orange-400",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    tagBg: "bg-orange-50",
    tagText: "text-orange-600",
    accentBorder: "border-orange-300",
  },

  Penerangan: {
    Icon: Lightbulb,
    bar: "bg-yellow-400",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    tagBg: "bg-yellow-50",
    tagText: "text-yellow-600",
    accentBorder: "border-yellow-300",
  },

  Kebersihan: {
    Icon: Recycle,
    bar: "bg-green-400",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    tagBg: "bg-green-50",
    tagText: "text-green-600",
    accentBorder: "border-green-300",
  },

  Kedaruratan: {
    Icon: TriangleAlert,
    bar: "bg-red-400",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    tagBg: "bg-red-50",
    tagText: "text-red-600",
    accentBorder: "border-red-300",
  },

  Keindahan: {
    Icon: Palette,
    bar: "bg-purple-400",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    tagBg: "bg-purple-50",
    tagText: "text-purple-600",
    accentBorder: "border-purple-300",
  },

  Lingkungan: {
    Icon: Recycle,
    bar: "bg-emerald-400",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    tagBg: "bg-emerald-50",
    tagText: "text-emerald-600",
    accentBorder: "border-emerald-300",
  },

  "Lalu Lintas": {
    Icon: Construction,
    bar: "bg-sky-400",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
    tagBg: "bg-sky-50",
    tagText: "text-sky-600",
    accentBorder: "border-sky-300",
  },

  Pengaduan: {
    Icon: MessageSquareMore,
    bar: "bg-orange-400",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    tagBg: "bg-orange-50",
    tagText: "text-orange-600",
    accentBorder: "border-orange-300",
  },
};

// ─────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────

const stCfg: Record<
  StatusKey,
  {
    Icon: React.ElementType;
    iconColor: string;
    bg: string;
    text: string;
    border: string;
    statNum: string;
    statBar: string;
    statIconBg: string;
  }
> = {
  Verifikasi: {
    Icon: Clock,
    iconColor: "text-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    statNum: "text-blue-600",
    statBar: "bg-blue-400",
    statIconBg: "bg-blue-50",
  },

  Diproses: {
    Icon: Clock,
    iconColor: "text-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    statNum: "text-amber-600",
    statBar: "bg-amber-400",
    statIconBg: "bg-amber-50",
  },

  Selesai: {
    Icon: CheckCircle2,
    iconColor: "text-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    statNum: "text-green-600",
    statBar: "bg-green-400",
    statIconBg: "bg-green-50",
  },

  Ditolak: {
    Icon: XCircle,
    iconColor: "text-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    statNum: "text-red-600",
    statBar: "bg-red-400",
    statIconBg: "bg-red-50",
  },
};

// ─────────────────────────────────────────────
// FORMAT TANGGAL
// ─────────────────────────────────────────────

const formatTanggal = (raw: string): string => {
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

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function LaporanSaya() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const [selId, setSelId] = useState<number | null>(
    null
  );

  const statuses = [
    "Semua",
    "Verifikasi",
    "Diproses",
    "Selesai",
    "Ditolak",
  ];

  // ─────────────────────────────────────────────
  // FETCH LAPORAN
  // ─────────────────────────────────────────────

  const fetchLaporan = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setLaporan([]);
        return;
      }

      // GET LAPORAN SAYA
      const res = await api.get("/laporan/saya", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data?.data || [];

      // FORMAT GAMBAR
      const formatted = data.map((item: any) => ({
        ...item,

        gambar: Array.isArray(item.gambar)
          ? item.gambar
          : typeof item.gambar === "string"
          ? (() => {
              try {
                return JSON.parse(item.gambar);
              } catch {
                return [item.gambar];
              }
            })()
          : [],
      }));

      setLaporan(formatted);

    } catch (error) {

      console.log(
        "ERROR FETCH LAPORAN:",
        error
      );

      setLaporan([]);

    } finally {

      setLoading(false);

    }
  };

  // ─────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────

  useEffect(() => {
    fetchLaporan();
  }, []);

  // ─────────────────────────────────────────────
  // ESC CLOSE MODAL
  // ─────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelId(null);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener(
        "keydown",
        handler
      );
    };
  }, []);

  // ─────────────────────────────────────────────
  // FORMAT STATUS
  // ─────────────────────────────────────────────

  const formatStatus = (
    status: string
  ): StatusKey => {
    switch (status) {
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
  // FILTER DATA
  // ─────────────────────────────────────────────

  const filtered = laporan.filter((r) => {
    const sf = formatStatus(r.status);

    const matchStatus =
      filter === "Semua" || sf === filter;

    const matchSearch =
      !search ||
      r.judul_laporan
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      r.lokasi
        ?.toLowerCase()
        .includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  // ─────────────────────────────────────────────
  // COUNT STATUS
  // ─────────────────────────────────────────────

  const countOf = (status: string) =>
    laporan.filter(
      (r) =>
        formatStatus(r.status) === status
    ).length;

  // ─────────────────────────────────────────────
  // SELECTED
  // ─────────────────────────────────────────────

  const sel = laporan.find(
    (r) => r.id === selId
  );

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900">

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-5 py-8 pb-20">

        {/* HEADER */}
        <div className="mb-6">
          <Image
            src="/images/logo.png"
            alt="LaporinAja"
            width={140}
            height={36}
            className="mb-2 object-contain"
          />

          <p className="text-sm text-stone-400">
            Pantau semua laporan yang telah
            kamu kirimkan
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {(
            [
              "Verifikasi",
              "Diproses",
              "Selesai",
              "Ditolak",
            ] as StatusKey[]
          ).map((s) => {
            const c = stCfg[s];

            return (
              <div
                key={s}
                className="relative bg-white rounded-2xl p-4 border border-stone-100 shadow-sm overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${c.statBar}`}
                />

                <div
                  className={`w-9 h-9 ${c.statIconBg} rounded-xl flex items-center justify-center mb-2`}
                >
                  <c.Icon
                    size={18}
                    className={c.iconColor}
                  />
                </div>

                <div
                  className={`text-3xl font-extrabold leading-none mb-1 ${c.statNum}`}
                >
                  {countOf(s)}
                </div>

                <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                  {s}
                </div>
              </div>
            );
          })}
        </div>

        {/* SEARCH */}
        <div className="flex gap-2 mb-5 flex-wrap items-center">

          <div className="relative flex-1 min-w-[160px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Cari laporan..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-full outline-none"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold border ${
                  filter === s
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-stone-200 text-stone-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        {loading ? (

          <div className="text-center py-20 text-stone-400 text-sm">
            Memuat laporan...
          </div>

        ) : filtered.length === 0 ? (

          <div className="text-center py-20 text-stone-400">
            <FileX
              size={44}
              className="mx-auto mb-3 opacity-30"
            />

            <p className="text-sm">
              Belum ada laporan
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {filtered.map((r) => {
              const sf = formatStatus(r.status);

              const cc =
                catCfg[r.category_name] ??
                catCfg["Infrastruktur"];

              const sc = stCfg[sf];

              return (
                <div
                  key={r.id}
                  onClick={() => setSelId(r.id)}
                  className="relative bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden cursor-pointer"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${cc.bar}`}
                  />

                  <div className="p-4 pt-5">

                    <div className="flex items-start justify-between gap-2 mb-3">

                      <div
                        className={`w-10 h-10 ${cc.iconBg} rounded-xl flex items-center justify-center`}
                      >
                        <cc.Icon
                          size={20}
                          className={cc.iconColor}
                        />
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}
                      >
                        <sc.Icon
                          size={11}
                          className={sc.iconColor}
                        />

                        {sf}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-stone-800 mb-1.5 line-clamp-2">
                      {r.judul_laporan}
                    </p>

                    <p className="text-xs text-stone-400 flex items-center gap-1 mb-4">
                      <MapPin
                        size={12}
                        className="text-orange-400"
                      />

                      <span className="truncate">
                        {r.lokasi}
                      </span>
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-300">
                        {formatTanggal(
                          r.tanggal_kejadian
                        )}
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${cc.tagBg} ${cc.tagText}`}
                      >
                        {r.category_name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* MODAL */}
      {sel && (() => {

        const cc =
          catCfg[sel.category_name] ??
          catCfg["Infrastruktur"];

        const sf = formatStatus(sel.status);

        const sc = stCfg[sf];

        return (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelId(null)}
          >
            <div
              className="w-full sm:max-w-lg bg-white rounded-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="p-5 space-y-5">

                {/* TOP */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-9 h-9 ${cc.iconBg} rounded-xl flex items-center justify-center`}
                    >
                      <cc.Icon
                        size={18}
                        className={cc.iconColor}
                      />
                    </div>

                    <span
                      className={`text-[12px] font-bold px-3 py-1 rounded-full border ${cc.tagBg} ${cc.tagText}`}
                    >
                      {sel.category_name}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setSelId(null)
                    }
                    className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* TITLE */}
                <div className="flex items-start gap-3">

                  <h2 className="text-[15px] font-bold text-stone-800 flex-1">
                    {sel.judul_laporan}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}
                  >
                    <sc.Icon
                      size={11}
                      className={sc.iconColor}
                    />

                    {sf}
                  </span>
                </div>

                {/* INFO */}
                <div className="grid grid-cols-2 gap-2">

                  <div className="bg-stone-50 rounded-xl p-3">
                    <p className="text-[10px] text-stone-400 mb-1">
                      Lokasi
                    </p>

                    <p className="text-[13px] font-semibold text-stone-700">
                      {sel.lokasi}
                    </p>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-3">
                    <p className="text-[10px] text-stone-400 mb-1">
                      Tanggal
                    </p>

                    <p className="text-[13px] font-semibold text-stone-700">
                      {formatTanggal(
                        sel.tanggal_kejadian
                      )}
                    </p>
                  </div>
                </div>

                {/* DESKRIPSI */}
                <div>
                  <p className="text-[10px] font-semibold text-stone-400 uppercase mb-2">
                    Deskripsi
                  </p>

                  <div
                    className={`rounded-xl p-4 bg-stone-50 border-l-[3px] ${cc.accentBorder}`}
                  >
                    <p className="text-sm text-stone-600 whitespace-pre-wrap">
                      {sel.isi_laporan}
                    </p>
                  </div>
                </div>

                {/* FOTO */}
                {sel.gambar &&
                  sel.gambar.length > 0 && (

                  <div>
                    <p className="text-[10px] font-semibold text-stone-400 uppercase mb-2">
                      Foto Laporan
                    </p>

                    <div className="grid grid-cols-2 gap-3">

                      {sel.gambar.map(
                        (img, idx) => (
                          <img
                            key={idx}
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`}
                            alt="foto laporan"
                            className="w-full h-40 object-cover rounded-2xl border border-stone-100"
                          />
                        )
                      )}

                    </div>
                  </div>
                )}

                {/* TANGGAPAN */}
                {sel.tanggapan && (
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">

                      <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                        <MessageSquareMore
                          size={14}
                          className="text-orange-500"
                        />
                      </div>

                      <h3 className="text-sm font-bold text-orange-700">
                        Tanggapan Admin
                      </h3>
                    </div>

                    <p className="text-sm text-orange-700">
                      {sel.tanggapan}
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}