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
  gambar: string | null;
  status: StatusDB;
  category_id: number;
  user_id: number;
  user_name: string;
  category_name: string;
}

// ─── STATUS CONFIG ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  StatusDB,
  { label: string; color: string; bg: string; dot: string }
> = {
  verifikasi: {
    label: "Menunggu Verifikasi",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  proses: {
    label: "Diproses",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  selesai: {
    label: "Selesai",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  ditolak: {
    label: "Ditolak",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
};

const KATEGORI_COLOR: Record<string, string> = {
  Infrastruktur: "bg-violet-100 text-violet-700",
  "Lalu Lintas": "bg-sky-100 text-sky-700",
  Lingkungan: "bg-teal-100 text-teal-700",
};

// ─── ICONS ─────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const IconFilter = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconChevron = ({ open }: { open: boolean }) => (
  <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
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

const IconArrow = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconX = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconBan = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" />
  </svg>
);

const IconRefresh = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
  </svg>
);

const Spinner = () => (
  <svg className="w-6 h-6 animate-spin text-[#E8763A]" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// CONFIRM DIALOG
function ConfirmDialog({
  type,
  onConfirm,
  onCancel,
  loading,
}: {
  type: "approve" | "reject";
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const isApprove = type === "approve";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isApprove ? "bg-green-100" : "bg-red-100"}`}>
          {isApprove
            ? <IconCheck />
            : <IconBan />
          }
        </div>
        <h3 className="text-base font-bold text-gray-800 text-center">
          {isApprove ? "Terima laporan ini?" : "Tolak laporan ini?"}
        </h3>
        <p className="text-sm text-gray-400 text-center mt-1 mb-5">
          {isApprove
            ? "Laporan akan diubah menjadi status Diproses dan diteruskan ke petugas terkait."
            : "Laporan akan ditandai sebagai ditolak. Tindakan ini tidak dapat dibatalkan."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 h-10 rounded-xl text-white text-sm font-bold transition flex items-center justify-center gap-2 disabled:opacity-60 ${
              isApprove
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? <Spinner /> : isApprove ? "Ya, Terima" : "Ya, Tolak"}
          </button>
        </div>
      </div>
    </div>
  );
}

// DETAIL MODAL 

function DetailModal({
  laporan,
  onClose,
  onStatusChange,
}: {
  laporan: Laporan;
  onClose: () => void;
  onStatusChange: (id: number, status: StatusDB) => Promise<void>;
}) {
  const cfg = STATUS_CONFIG[laporan.status];
  const [confirm, setConfirm] = useState<"approve" | "reject" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const canApprove = laporan.status === "verifikasi";
  const canReject = laporan.status === "verifikasi" || laporan.status === "proses";
  const canSelesai = laporan.status === "proses";

  const handleAction = async (newStatus: StatusDB) => {
    setActionLoading(true);
    try {
      await onStatusChange(laporan.id, newStatus);
      setConfirm(null);
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
          {/* top bar */}
          <div className="bg-[#E8763A] px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs font-mono">ID: {laporan.id}</p>
              <h2 className="text-white font-bold text-base leading-snug mt-0.5">
                {laporan.judul_laporan}
              </h2>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition">
              <IconX />
            </button>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">
            {/* status + kategori */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${KATEGORI_COLOR[laporan.category_name] ?? "bg-gray-100 text-gray-600"}`}>
                {laporan.category_name}
              </span>
            </div>

            {/* isi laporan */}
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Isi Laporan</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{laporan.isi_laporan}</p>
            </div>

            {/* meta */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: <IconUser />, label: "Pelapor", val: laporan.user_name },
                { icon: <IconPin />, label: "Lokasi", val: laporan.lokasi || "-" },
                { icon: <IconCalendar />, label: "Tanggal", val: laporan.tanggal_kejadian },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-2 text-sm text-gray-500">
                  <span className="mt-0.5 text-gray-400">{icon}</span>
                  <span className="text-gray-400 shrink-0">{label}:</span>
                  <span className="text-gray-700 font-medium">{val}</span>
                </div>
              ))}
            </div>

            {/* ─── ACTION BUTTONS ─── */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tindakan Admin</p>
              <div className="flex gap-2 flex-wrap">
                {/* Terima / Verifikasi */}
                {canApprove && (
                  <button
                    onClick={() => setConfirm("approve")}
                    className="flex-1 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
                  >
                    <IconCheck />
                    Terima & Proses
                  </button>
                )}

                {/* Tandai Selesai */}
                {canSelesai && (
                  <button
                    onClick={() => handleAction("selesai")}
                    className="flex-1 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
                  >
                    <IconCheck />
                    Tandai Selesai
                  </button>
                )}

                {/* Tolak */}
                {canReject && (
                  <button
                    onClick={() => setConfirm("reject")}
                    className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
                  >
                    <IconBan />
                    Tolak Laporan
                  </button>
                )}

                {/* Tutup - always shown */}
                <button
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition"
                >
                  Tutup
                </button>
              </div>

              {/* Info jika tidak ada aksi tersedia */}
              {!canApprove && !canReject && !canSelesai && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Laporan ini sudah dalam status akhir dan tidak dapat diubah.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
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

// ─── CARD ─────────────────────────────────────────────────────────────────────

function LaporanCard({
  laporan,
  onClick,
  onQuickApprove,
  onQuickReject,
}: {
  laporan: Laporan;
  onClick: () => void;
  onQuickApprove?: () => void;
  onQuickReject?: () => void;
}) {
  const cfg = STATUS_CONFIG[laporan.status];
  const showQuickActions = laporan.status === "verifikasi";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#E8763A]/30 transition-all overflow-hidden">
      {/* color stripe */}
      <div className={`h-1 w-full ${
        laporan.status === "verifikasi" ? "bg-blue-400"
        : laporan.status === "proses" ? "bg-amber-400"
        : laporan.status === "selesai" ? "bg-emerald-400"
        : "bg-red-400"
      }`} />

      <div className="p-4">
        {/* top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-xs font-mono text-gray-400">ID: {laporan.id}</span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        {/* judul */}
        <h3
          className="text-sm font-bold text-gray-800 leading-snug mb-1 group-hover:text-[#E8763A] transition-colors line-clamp-2 cursor-pointer"
          onClick={onClick}
        >
          {laporan.judul_laporan}
        </h3>

        {/* deskripsi */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{laporan.isi_laporan}</p>

        {/* meta */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <IconPin />
            <span className="truncate">{laporan.lokasi || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <IconUser />
            <span>{laporan.user_name}</span>
            <span className="mx-1 text-gray-200">·</span>
            <IconCalendar />
            <span>{laporan.tanggal_kejadian}</span>
          </div>
        </div>

        {/* kategori + lihat detail */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${KATEGORI_COLOR[laporan.category_name] ?? "bg-gray-100 text-gray-500"}`}>
            {laporan.category_name}
          </span>
          <button
            onClick={onClick}
            className="text-xs text-gray-400 hover:text-[#E8763A] transition flex items-center gap-1"
          >
            Detail <IconArrow />
          </button>
        </div>

        {/* ─── Quick Action Buttons (hanya untuk status verifikasi) ─── */}
        {showQuickActions && (
          <div className="flex gap-2 border-t border-gray-50 pt-3">
            <button
              onClick={(e) => { e.stopPropagation(); onQuickApprove?.(); }}
              className="flex-1 h-8 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <IconCheck />
              Terima
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onQuickReject?.(); }}
              className="flex-1 h-8 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <IconBan />
              Tolak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COLUMN ───────────────────────────────────────────────────────────────────

function KolomStatus({
  status,
  laporan,
  onCardClick,
  onStatusChange,
}: {
  status: StatusDB;
  laporan: Laporan[];
  onCardClick: (l: Laporan) => void;
  onStatusChange: (id: number, newStatus: StatusDB) => Promise<void>;
}) {
  const cfg = STATUS_CONFIG[status];
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-w-0">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border mb-3 text-left w-full ${cfg.bg} ${cfg.color} transition`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
        <span className="font-bold text-sm flex-1">{cfg.label}</span>
        <span className="text-xs font-semibold opacity-60 bg-white/60 px-2 py-0.5 rounded-full">
          {laporan.length}
        </span>
        <IconChevron open={!collapsed} />
      </button>

      {!collapsed && (
        <div className="flex flex-col gap-3">
          {laporan.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-300 border-2 border-dashed border-gray-100 rounded-2xl">
              Tidak ada laporan
            </div>
          ) : (
            laporan.map((l) => (
              <LaporanCard
                key={l.id}
                laporan={l}
                onClick={() => onCardClick(l)}
                onQuickApprove={() => onStatusChange(l.id, "proses")}
                onQuickReject={() => onStatusChange(l.id, "ditolak")}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function KelolaLaporan() {
  const [data, setData] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [selected, setSelected] = useState<Laporan | null>(null);

  const fetchLaporan = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/laporan");
      const result = res.data?.data ?? res.data ?? [];
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  // ─── UPDATE STATUS ────────────────────────────────────────────────────────

  const handleStatusChange = useCallback(
    async (id: number, newStatus: StatusDB) => {
      try {
        // Optimistic update
        setData((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        // Update selected jika sedang dibuka
        setSelected((prev) =>
          prev?.id === id ? { ...prev, status: newStatus } : prev
        );

        await api.patch(`/laporan/${id}/status`, { status: newStatus });
      } catch (err) {
        console.error(err);
        // Revert on error
        fetchLaporan();
      }
    },
    [fetchLaporan]
  );

  // ─── FILTER ───────────────────────────────────────────────────────────────

  const filtered = data.filter((l) => {
    const matchSearch =
      l.judul_laporan.toLowerCase().includes(search.toLowerCase()) ||
      l.user_name.toLowerCase().includes(search.toLowerCase()) ||
      String(l.id).includes(search);

    const matchKategori =
      filterKategori === "Semua" || l.category_name === filterKategori;

    return matchSearch && matchKategori;
  });

  const byStatus = (s: StatusDB) => filtered.filter((l) => l.status === s);

  const kategoriList = [
    "Semua",
    ...Array.from(new Set(data.map((l) => l.category_name))),
  ];

  const statusList: StatusDB[] = ["verifikasi", "proses", "selesai", "ditolak"];

  const needsAction = byStatus("verifikasi").length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
                  Kelola Laporan
                </h1>
                {needsAction > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {needsAction} perlu tindakan
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Total {data.length} laporan · Verifikasi, proses, dan kelola status laporan
              </p>
            </div>

            {/* search + filter + refresh */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari laporan..."
                  className="h-9 pl-9 pr-4 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20 transition w-48"
                />
              </div>

              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <span className="text-gray-400 pl-2">
                  <IconFilter />
                </span>
                {kategoriList.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFilterKategori(k)}
                    className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all ${
                      filterKategori === k
                        ? "bg-white text-[#C95E24] shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchLaporan}
                className="h-9 w-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 transition"
                title="Refresh"
              >
                <IconRefresh />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="max-w-7xl mx-auto px-6 pt-5 pb-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statusList.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const count = byStatus(s).length;
            return (
              <div key={s} className={`rounded-2xl border p-4 ${cfg.bg}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                </div>
                <p className={`text-3xl font-black ${cfg.color}`}>{count}</p>
                <p className="text-xs text-gray-400 mt-0.5">laporan</p>
              </div>
            );
          })}
        </div>

        {/* Panduan aksi cepat */}
        {needsAction > 0 && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
            <p className="text-xs text-blue-700">
              <strong>{needsAction} laporan</strong> di kolom <strong>Menunggu Verifikasi</strong> — gunakan tombol <strong>Terima</strong> atau <strong>Tolak</strong> pada kartu, atau klik <strong>Detail</strong> untuk review lengkap sebelum mengambil tindakan.
            </p>
          </div>
        )}
      </div>

      {/* Kanban Columns */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {statusList.map((s) => (
              <KolomStatus
                key={s}
                status={s}
                laporan={byStatus(s)}
                onCardClick={setSelected}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          laporan={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}