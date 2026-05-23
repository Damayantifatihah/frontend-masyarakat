"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

// ─── TYPES ─────────────────────────────────────────────────────────────

type StatusDB = "verifikasi" | "proses" | "selesai" | "ditolak";

interface Laporan {
  id: number;
  judul_laporan: string;
  isi_laporan: string;
  tanggal_kejadian: string;
  lokasi: string;
  gambar: string | string[] | null;
  status: StatusDB;
  category_id: number;
  user_id: number;
  user_name: string;
  category_name: string;
}

function getGambarItems(gambar: string | string[] | null) {
  if (!gambar) return [];
  return Array.isArray(gambar) ? gambar : [gambar];
}

// ─── STATUS CONFIG ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusDB, {
  label: string; color: string; bg: string; dot: string;
  headerBg: string; tabActive: string; tabInactive: string;
  emptyIcon: string; ringColor: string; countColor: string;
}> = {
  verifikasi: {
    label: "Menunggu Verifikasi",
    color: "text-blue-600", bg: "bg-blue-50 border-blue-100", dot: "bg-blue-400",
    headerBg: "from-blue-400 to-blue-500",
    tabActive: "border-blue-500 text-blue-600",
    tabInactive: "border-transparent text-gray-400 hover:text-gray-600",
    emptyIcon: "🔍", ringColor: "ring-blue-300", countColor: "text-blue-600",
  },
  proses: {
    label: "Sedang Diproses",
    color: "text-amber-600", bg: "bg-amber-50 border-amber-100", dot: "bg-amber-400",
    headerBg: "from-amber-400 to-orange-400",
    tabActive: "border-amber-500 text-amber-600",
    tabInactive: "border-transparent text-gray-400 hover:text-gray-600",
    emptyIcon: "⚙️", ringColor: "ring-amber-300", countColor: "text-amber-600",
  },
  selesai: {
    label: "Selesai",
    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", dot: "bg-emerald-400",
    headerBg: "from-emerald-400 to-teal-500",
    tabActive: "border-emerald-500 text-emerald-600",
    tabInactive: "border-transparent text-gray-400 hover:text-gray-600",
    emptyIcon: "✅", ringColor: "ring-emerald-300", countColor: "text-emerald-600",
  },
  ditolak: {
    label: "Ditolak",
    color: "text-red-600", bg: "bg-red-50 border-red-100", dot: "bg-red-400",
    headerBg: "from-red-400 to-rose-500",
    tabActive: "border-red-500 text-red-600",
    tabInactive: "border-transparent text-gray-400 hover:text-gray-600",
    emptyIcon: "🚫", ringColor: "ring-red-300", countColor: "text-red-600",
  },
};

const KATEGORI_COLOR: Record<string, string> = {
  Infrastruktur: "bg-violet-50 text-violet-600 border-violet-100",
  "Lalu Lintas":  "bg-sky-50 text-sky-600 border-sky-100",
  Lingkungan:     "bg-teal-50 text-teal-600 border-teal-100",
};

const STATUS_ORDER: StatusDB[] = ["verifikasi", "proses", "selesai", "ditolak"];

// ─── ICONS ──────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconCalendar = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const IconPin = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconUser = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconBan = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" />
  </svg>
);
const IconRefresh = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
  </svg>
);
const IconAlert = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const Spinner = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <svg className={`animate-spin text-gray-400 ${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`} viewBox="0 0 24 24">
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// ─── CONFIRM DIALOG ──────────────────────────────────────────────────────

function ConfirmDialog({ type, onConfirm, onCancel, loading }: {
  type: "approve" | "reject"; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  const isApprove = type === "approve";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs p-6">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 ${isApprove ? "bg-emerald-50" : "bg-red-50"}`}>
          <span className={isApprove ? "text-emerald-500" : "text-red-500"}>
            {isApprove ? <IconCheck /> : <IconBan />}
          </span>
        </div>
        <h3 className="text-sm font-bold text-gray-800 text-center">
          {isApprove ? "Terima laporan ini?" : "Tolak laporan ini?"}
        </h3>
        <p className="text-xs text-gray-400 text-center mt-1.5 mb-5 leading-relaxed">
          {isApprove
            ? "Laporan akan diubah menjadi status Diproses dan diteruskan ke petugas."
            : "Laporan akan ditandai ditolak. Tindakan ini tidak dapat dibatalkan."}
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={loading} className="flex-1 h-9 rounded-xl bg-gray-100 hover:bg-gray-150 text-gray-600 text-sm font-semibold transition disabled:opacity-50">
            Batal
          </button>
          <button onClick={onConfirm} disabled={loading} className={`flex-1 h-9 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-60 ${isApprove ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}`}>
            {loading ? <Spinner size="sm" /> : isApprove ? "Ya, Terima" : "Ya, Tolak"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LAPORAN CARD ──────────────────────────────────────────────────────────

function LaporanRow({ laporan, onStatusChange }: {
  laporan: Laporan;
  onStatusChange: (id: number, status: StatusDB) => Promise<void>;
}) {
  const cfg = STATUS_CONFIG[laporan.status];
  const gambarItems = getGambarItems(laporan.gambar);
  const [confirm, setConfirm] = useState<"approve" | "reject" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const canApprove = laporan.status === "verifikasi";
  const canReject  = laporan.status === "verifikasi" || laporan.status === "proses";
  const canSelesai = laporan.status === "proses";

  const handleAction = async (newStatus: StatusDB) => {
    setActionLoading(true);
    try {
      await onStatusChange(laporan.id, newStatus);
      setConfirm(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* gradient top bar */}
        <div className={`h-[3px] w-full bg-gradient-to-r ${cfg.headerBg}`} />

        <div className="p-5">
          {/* TOP: badges row */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-[11px] font-mono text-gray-300 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
              #{laporan.id}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${cfg.bg} ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${laporan.status === "verifikasi" ? "animate-pulse" : ""}`} />
              {cfg.label}
            </span>
            <span className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${KATEGORI_COLOR[laporan.category_name] ?? "bg-gray-50 text-gray-500 border-gray-100"}`}>
              {laporan.category_name}
            </span>
          </div>

          {/* CONTENT */}
          <div className="flex gap-4">
            {/* Foto grid */}
            {gambarItems.length > 0 && (
              <div className="flex-shrink-0 grid gap-1.5" style={{ gridTemplateColumns: gambarItems.length === 1 ? "1fr" : "repeat(2, 1fr)" }}>
                {gambarItems.slice(0, 4).map((src, i) => (
                  <div key={i} className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
              <div>
                <h3 className="text-[15px] font-bold text-gray-800 leading-snug mb-1">
                  {laporan.judul_laporan}
                </h3>
                <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-2 whitespace-pre-line">
                  {laporan.isi_laporan}
                </p>
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <IconUser />{laporan.user_name}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <IconPin />{laporan.lokasi || "—"}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <IconCalendar />{laporan.tanggal_kejadian}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-50 pt-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {canApprove && (
                    <button onClick={() => setConfirm("approve")} className="h-8 px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition">
                      <IconCheck /> Terima & Proses
                    </button>
                  )}
                  {canSelesai && (
                    <button onClick={() => handleAction("selesai")} disabled={actionLoading} className="h-8 px-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-60">
                      {actionLoading ? <Spinner size="sm" /> : <><IconCheck /> Tandai Selesai</>}
                    </button>
                  )}
                  {canReject && (
                    <button onClick={() => setConfirm("reject")} className="h-8 px-3.5 rounded-lg bg-white hover:bg-red-50 text-red-500 border border-red-200 text-xs font-semibold flex items-center gap-1.5 transition">
                      <IconBan /> Tolak
                    </button>
                  )}
                  {!canApprove && !canReject && !canSelesai && (
                    <span className="text-[11px] text-gray-300 italic">Tidak ada tindakan tersedia</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          type={confirm}
          loading={actionLoading}
          onConfirm={() => handleAction(confirm === "approve" ? "proses" : "ditolak")}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────

function EmptyState({ status }: { status: StatusDB }) {
  const cfg = STATUS_CONFIG[status];
  const messages: Record<StatusDB, string> = {
    verifikasi: "Tidak ada laporan menunggu verifikasi",
    proses:     "Tidak ada laporan sedang diproses",
    selesai:    "Belum ada laporan diselesaikan",
    ditolak:    "Tidak ada laporan yang ditolak",
  };
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 text-2xl ${cfg.bg} border`}>
        {cfg.emptyIcon}
      </div>
      <p className="text-gray-400 text-sm font-medium">{messages[status]}</p>
      <p className="text-gray-300 text-xs mt-1">Data akan muncul di sini ketika tersedia</p>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────

function StatCard({ s, count, isActive, onClick }: {
  s: StatusDB; count: number; isActive: boolean; onClick: () => void;
}) {
  const cfg = STATUS_CONFIG[s];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition-all duration-150 w-full
        ${isActive
          ? `${cfg.bg} ${cfg.ringColor} ring-2 ring-offset-1`
          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
        }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`w-2 h-2 rounded-full ${cfg.dot} ${s === "verifikasi" && count > 0 ? "animate-pulse" : ""}`} />
        <span className={`text-2xl font-black tabular-nums ${isActive ? cfg.countColor : "text-gray-700"}`}>
          {count}
        </span>
      </div>
      <p className={`text-xs font-semibold leading-tight ${isActive ? cfg.color : "text-gray-500"}`}>
        {cfg.label}
      </p>
    </button>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function KelolaLaporan() {
  const [data, setData] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [activeTab, setActiveTab] = useState<StatusDB>("verifikasi");

  const fetchLaporan = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/laporan");
      const result: Laporan[] = res.data?.data ?? res.data ?? [];
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaporan();
    const interval = setInterval(fetchLaporan, 3000);
    return () => clearInterval(interval);
  }, [fetchLaporan]);

  const handleStatusChange = useCallback(async (id: number, newStatus: StatusDB) => {
    try {
      setData((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
      await api.patch(`/laporan/${id}/status`, { status: newStatus });
      fetchLaporan();
    } catch (err) {
      console.error(err);
      fetchLaporan();
    }
  }, [fetchLaporan]);

  const kategoriList = ["Semua", ...Array.from(new Set(data.map((l) => l.category_name)))];
  const filtered = data.filter((l) => {
    const matchSearch =
      l.judul_laporan.toLowerCase().includes(search.toLowerCase()) ||
      l.user_name.toLowerCase().includes(search.toLowerCase()) ||
      String(l.id).includes(search);
    const matchKategori = filterKategori === "Semua" || l.category_name === filterKategori;
    return matchSearch && matchKategori;
  });

  const byStatus      = (s: StatusDB) => filtered.filter((l) => l.status === s);
  const totalByStatus = (s: StatusDB) => data.filter((l) => l.status === s).length;
  const needsAction   = totalByStatus("verifikasi");
  const currentList   = byStatus(activeTab);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* ── STICKY HEADER ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6">

          {/* Row 1: Title + actions */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Kelola Laporan</h1>
              {needsAction > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-500 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  {needsAction} baru
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari laporan..."
                  className="h-8 pl-8 pr-3 rounded-xl border border-gray-200 text-xs text-gray-600 placeholder:text-gray-300 outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition w-40 bg-gray-50"
                />
              </div>
              <button
                onClick={fetchLaporan}
                className="h-8 w-8 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                title="Refresh"
              >
                <IconRefresh />
              </button>
            </div>
          </div>

          {/* Row 2: Kategori filter tabs */}
          <div className="flex items-center gap-1 pb-0">
            {kategoriList.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilterKategori(k)}
                className={`h-8 px-3.5 rounded-t-lg text-xs font-semibold transition-all border-b-2 -mb-px ${
                  filterKategori === k
                    ? "border-gray-800 text-gray-800 bg-white"
                    : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {k}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-gray-300 pb-2">{data.length} laporan</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 pb-1">
          {STATUS_ORDER.map((s) => (
            <StatCard
              key={s}
              s={s}
              count={totalByStatus(s)}
              isActive={activeTab === s}
              onClick={() => setActiveTab(s)}
            />
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="flex items-center gap-0 border-b border-gray-100 mb-5 mt-4 overflow-x-auto">
          {STATUS_ORDER.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const count = byStatus(s).length;
            const isActive = activeTab === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setActiveTab(s)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all -mb-px ${
                  isActive ? cfg.tabActive : cfg.tabInactive
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${s === "verifikasi" && count > 0 ? "animate-pulse" : ""}`} />
                {cfg.label}
                <span className={`min-w-[18px] text-center text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                  isActive ? `${cfg.bg} ${cfg.color}` : "bg-gray-100 text-gray-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── LIST ── */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : currentList.length === 0 ? (
          <EmptyState status={activeTab} />
        ) : (
          <div className="flex flex-col gap-3">
            {currentList.map((l) => (
              <LaporanRow key={l.id} laporan={l} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
      `}</style>
    </div>
  );
}