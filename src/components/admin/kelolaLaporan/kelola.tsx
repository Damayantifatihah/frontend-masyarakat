"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { Search, MapPin, User, Calendar, Check, X } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type StatusDB = "verifikasi" | "proses" | "selesai" | "ditolak";

interface Laporan {
  id: number;
  judul_laporan: string;
  isi_laporan: string;
  tanggal_kejadian: string;
  lokasi: string;
  gambar: string | string[] | null;
  status: StatusDB;
  user_name: string;
  category_name: string;
  tanggapan?: string;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function parseGambar(gambar: string | string[] | null): string[] {
  if (!gambar) return [];
  if (Array.isArray(gambar)) return gambar;
  try { const p = JSON.parse(gambar); return Array.isArray(p) ? p : [gambar]; }
  catch { return [gambar]; }
}

function formatDate(raw: string) {
  try { return new Date(raw).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }); }
  catch { return raw; }
}

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const STATUS_CFG: Record<StatusDB, {
  label: string;
  bar: string;
  badgeBg: string; badgeText: string; badgeBorder: string;
  tabBg: string; tabText: string; tabBorder: string;
  emptyIcon: string;
}> = {
  verifikasi: {
    label: "Menunggu Verifikasi", bar: "bg-blue-500",
    badgeBg: "bg-blue-50", badgeText: "text-blue-700", badgeBorder: "border-blue-200",
    tabBg: "bg-blue-50", tabText: "text-blue-700", tabBorder: "border-blue-300",
    emptyIcon: "🔍",
  },
  proses: {
    label: "Sedang Diproses", bar: "bg-amber-500",
    badgeBg: "bg-amber-50", badgeText: "text-amber-700", badgeBorder: "border-amber-200",
    tabBg: "bg-amber-50", tabText: "text-amber-700", tabBorder: "border-amber-300",
    emptyIcon: "⚙️",
  },
  selesai: {
    label: "Selesai", bar: "bg-emerald-500",
    badgeBg: "bg-emerald-50", badgeText: "text-emerald-700", badgeBorder: "border-emerald-200",
    tabBg: "bg-emerald-50", tabText: "text-emerald-700", tabBorder: "border-emerald-300",
    emptyIcon: "✅",
  },
  ditolak: {
    label: "Ditolak", bar: "bg-red-500",
    badgeBg: "bg-red-50", badgeText: "text-red-700", badgeBorder: "border-red-200",
    tabBg: "bg-red-50", tabText: "text-red-700", tabBorder: "border-red-300",
    emptyIcon: "🚫",
  },
};

const STATUS_ORDER: StatusDB[] = ["verifikasi", "proses", "selesai", "ditolak"];

// ─────────────────────────────────────────────
// TANGGAPAN DIALOG
// ─────────────────────────────────────────────

function TanggapanDialog({ type, loading, onCancel, onSubmit }: {
  type: "approve" | "reject"; loading: boolean;
  onCancel: () => void; onSubmit: (t: string) => void;
}) {
  const [tanggapan, setTanggapan] = useState("");
  const isApprove = type === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden">
        <div className={`px-6 py-5 flex items-center justify-between ${isApprove ? "bg-emerald-500" : "bg-red-500"}`}>
          <div>
            <h2 className="text-[15px] font-bold text-white">{isApprove ? "Terima Laporan" : "Tolak Laporan"}</h2>
            <p className="text-xs text-white/75 mt-0.5">Berikan tanggapan untuk pengguna</p>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-lg bg-white/20 border-none text-white cursor-pointer flex items-center justify-center hover:bg-white/30 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <textarea
            value={tanggapan}
            onChange={(e) => setTanggapan(e.target.value)}
            placeholder="Tulis tanggapan admin untuk pelapor..."
            rows={4}
            className="w-full rounded-xl border-[1.5px] border-gray-200 px-4 py-3 text-sm resize-none outline-none font-[inherit] text-gray-700 focus:border-[#B45743] transition-colors leading-relaxed"
          />
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 h-11 rounded-xl border-[1.5px] border-gray-200 bg-white text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors font-[inherit]">
              Batal
            </button>
            <button
              disabled={loading || !tanggapan.trim()}
              onClick={() => onSubmit(tanggapan)}
              className={`flex-[2] h-11 rounded-xl border-none text-sm font-bold text-white cursor-pointer flex items-center justify-center gap-1.5 transition-colors font-[inherit] disabled:opacity-60 disabled:cursor-not-allowed ${isApprove ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}`}>
              {loading
                ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : isApprove ? <><Check size={14} /> Terima</> : <><X size={14} /> Tolak</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LAPORAN CARD
// ─────────────────────────────────────────────

function LaporanCard({ laporan, onStatusChange }: {
  laporan: Laporan;
  onStatusChange: (id: number, status: StatusDB, tanggapan?: string) => Promise<void>;
}) {
  const cfg = STATUS_CFG[laporan.status];
  const images = parseGambar(laporan.gambar);
  const [dialog, setDialog] = useState<"approve" | "reject" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (status: StatusDB, tanggapan: string) => {
    try { setLoading(true); await onStatusChange(laporan.id, status, tanggapan); setDialog(null); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className={`h-[3px] ${cfg.bar}`} />

        <div className="p-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500">
              #{laporan.id}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}>
              {cfg.label}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F9EAE7] text-[#8B3A2A] border border-[#F0D0C8]">
              {laporan.category_name}
            </span>
          </div>

          <div className="flex gap-4 flex-wrap">
            {/* Images */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-1.5 w-[196px] shrink-0">
                {images.slice(0, 4).map((img, i) => (
                  <div key={i} className="h-[88px] rounded-xl overflow-hidden border border-gray-100">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-gray-900">{laporan.judul_laporan}</h2>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed whitespace-pre-line line-clamp-3">{laporan.isi_laporan}</p>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 mt-3">
                {[
                  { Icon: User,     val: laporan.user_name },
                  { Icon: MapPin,   val: laporan.lokasi },
                  { Icon: Calendar, val: formatDate(laporan.tanggal_kejadian) },
                ].map(({ Icon, val }) => (
                  <span key={val} className="flex items-center gap-1 text-xs text-gray-400">
                    <Icon size={12} /> {val}
                  </span>
                ))}
              </div>

              {/* Tanggapan */}
              {laporan.tanggapan && (
                <div className="mt-3 rounded-xl bg-[#F9EAE7] border border-[#F0D0C8] px-4 py-3">
                  <p className="text-[11px] font-bold text-[#8B3A2A] mb-1">Tanggapan Admin</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{laporan.tanggapan}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                {laporan.status === "verifikasi" && (
                  <>
                    <button onClick={() => setDialog("approve")}
                      className="h-9 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold border-none cursor-pointer flex items-center gap-1.5 transition-colors font-[inherit]">
                      <Check size={13} /> Terima
                    </button>
                    <button onClick={() => setDialog("reject")}
                      className="h-9 px-4 rounded-lg bg-white border-[1.5px] border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors font-[inherit]">
                      <X size={13} /> Tolak
                    </button>
                  </>
                )}
                {laporan.status === "proses" && (
                  <button onClick={() => handleSubmit("selesai", laporan.tanggapan || "Laporan selesai ditangani.")}
                    className="h-9 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold border-none cursor-pointer flex items-center gap-1.5 transition-colors font-[inherit]">
                    <Check size={13} /> Selesaikan
                  </button>
                )}
                {(laporan.status === "selesai" || laporan.status === "ditolak") && (
                  <span className="text-xs text-gray-400 italic self-center">Tidak ada tindakan</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {dialog && (
        <TanggapanDialog
          type={dialog} loading={loading}
          onCancel={() => setDialog(null)}
          onSubmit={(t) => handleSubmit(dialog === "approve" ? "proses" : "ditolak", t)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function KelolaLaporan() {
  const [data, setData]           = useState<Laporan[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [activeTab, setActiveTab] = useState<StatusDB>("verifikasi");

  const fetchLaporan = useCallback(async () => {
    try { setLoading(true); const res = await api.get("/laporan"); setData(res.data?.data || res.data || []); }
    catch (err) { console.log(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLaporan(); }, [fetchLaporan]);

  const handleStatusChange = useCallback(async (id: number, status: StatusDB, tanggapan?: string) => {
    await api.patch(`/laporan/${id}/status`, { status, tanggapan });
    await fetchLaporan();
  }, [fetchLaporan]);

  const countOf = (s: StatusDB) => data.filter((d) => d.status === s).length;
  const filtered = data.filter((item) =>
    item.status === activeTab && (
      item.judul_laporan?.toLowerCase().includes(search.toLowerCase()) ||
      item.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(item.id).includes(search)
    )
  );

  return (
    <div className="min-h-screen bg-[#F8F8F8]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-7 py-5">

          {/* Title row */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">Kelola Laporan</h1>
              <p className="text-[13px] text-gray-400 mt-0.5">Verifikasi dan kelola laporan masyarakat</p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 border-[1.5px] border-gray-200 rounded-xl px-3.5 py-2.5 w-[260px] focus-within:border-[#B45743] focus-within:bg-white transition-colors">
              <Search size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul, nama, atau ID..."
                className="flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400 font-[inherit]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer p-0">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {STATUS_ORDER.map((s) => {
              const c = STATUS_CFG[s];
              const active = activeTab === s;
              const count = countOf(s);
              return (
                <button key={s} onClick={() => setActiveTab(s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold whitespace-nowrap cursor-pointer border-[1.5px] transition-all font-[inherit] ${
                    active
                      ? `${c.tabBg} ${c.tabText} ${c.tabBorder}`
                      : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-200"
                  }`}>
                  {c.label}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    active ? "bg-white/60" : "bg-gray-100 text-gray-500"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-7 py-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-[#F0D0C8] border-t-[#B45743] animate-spin mx-auto mb-3" />
            <p className="text-[13px] text-gray-400">Memuat laporan...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">{STATUS_CFG[activeTab].emptyIcon}</div>
            <p className="text-[15px] font-bold text-gray-700">Tidak ada laporan</p>
            <p className="text-[13px] text-gray-400 mt-1">Data laporan akan muncul di sini</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((laporan) => (
              <LaporanCard key={laporan.id} laporan={laporan} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}