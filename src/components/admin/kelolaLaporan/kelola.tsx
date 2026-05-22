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

const STATUS_CONFIG: Record<StatusDB, { label: string; color: string; bg: string; dot: string; headerBg: string; tabActive: string; tabInactive: string; emptyIcon: string }> = {
  verifikasi: {
    label: "Menunggu Verifikasi",
    color: "text-blue-700", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500",
    headerBg: "from-blue-500 to-blue-600",
    tabActive: "border-blue-500 text-blue-700 bg-blue-50",
    tabInactive: "border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50/50",
    emptyIcon: "🔍",
  },
  proses: {
    label: "Sedang Diproses",
    color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500",
    headerBg: "from-amber-400 to-amber-500",
    tabActive: "border-amber-500 text-amber-700 bg-amber-50",
    tabInactive: "border-transparent text-gray-500 hover:text-amber-600 hover:bg-amber-50/50",
    emptyIcon: "⚙️",
  },
  selesai: {
    label: "Selesai",
    color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500",
    headerBg: "from-emerald-500 to-emerald-600",
    tabActive: "border-emerald-500 text-emerald-700 bg-emerald-50",
    tabInactive: "border-transparent text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50",
    emptyIcon: "✅",
  },
  ditolak: {
    label: "Ditolak",
    color: "text-red-700", bg: "bg-red-50 border-red-200", dot: "bg-red-500",
    headerBg: "from-red-400 to-red-500",
    tabActive: "border-red-500 text-red-700 bg-red-50",
    tabInactive: "border-transparent text-gray-500 hover:text-red-600 hover:bg-red-50/50",
    emptyIcon: "🚫",
  },
};

const KATEGORI_COLOR: Record<string, string> = {
  Infrastruktur: "bg-violet-100 text-violet-700",
  "Lalu Lintas": "bg-sky-100 text-sky-700",
  Lingkungan: "bg-teal-100 text-teal-700",
};

const STATUS_ORDER: StatusDB[] = ["verifikasi", "proses", "selesai", "ditolak"];

// ─── ICONS ──────────────────────────────────────────────────────────────

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

// ─── CONFIRM DIALOG ──────────────────────────────────────────────────────

function ConfirmDialog({ type, onConfirm, onCancel, loading }: {
  type: "approve" | "reject"; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  const isApprove = type === "approve";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isApprove ? "bg-green-100" : "bg-red-100"}`}>
          {isApprove ? <IconCheck /> : <IconBan />}
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
          <button onClick={onCancel} disabled={loading} className="flex-1 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition disabled:opacity-50">Batal</button>
          <button onClick={onConfirm} disabled={loading} className={`flex-1 h-10 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-60 ${isApprove ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
            {loading ? <Spinner /> : isApprove ? "Ya, Terima" : "Ya, Tolak"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LAPORAN ROW (full detail, inline) ──────────────────────────────────

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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* color bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${cfg.headerBg}`} />

        <div className="p-5">
          {/* ── TOP ROW: id + status + kategori ── */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-mono text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg">#{laporan.id}</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${KATEGORI_COLOR[laporan.category_name] ?? "bg-gray-100 text-gray-600"}`}>
              {laporan.category_name}
            </span>
          </div>

          {/* ── MAIN CONTENT: foto + info ── */}
          <div className="flex gap-5">

            {/* Foto (jika ada) */}
            {gambarItems.length > 0 && (
              <div className="flex-shrink-0 flex flex-col gap-2">
                {gambarItems.map((src, i) => (
                  <div key={i} className="w-48 h-36 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-800 leading-snug mb-1">{laporan.judul_laporan}</h3>
                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{laporan.isi_laporan}</p>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <IconUser /><span>{laporan.user_name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <IconPin /><span>{laporan.lokasi || "-"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <IconCalendar /><span>{laporan.tanggal_kejadian}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {canApprove && (
                  <button
                    onClick={() => setConfirm("approve")}
                    className="h-9 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center gap-2 transition"
                  >
                    <IconCheck /> Terima & Proses
                  </button>
                )}
                {canSelesai && (
                  <button
                    onClick={() => handleAction("selesai")}
                    disabled={actionLoading}
                    className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold flex items-center gap-2 transition disabled:opacity-60"
                  >
                    {actionLoading ? <Spinner /> : <><IconCheck /> Tandai Selesai</>}
                  </button>
                )}
                {canReject && (
                  <button
                    onClick={() => setConfirm("reject")}
                    className="h-9 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold flex items-center gap-2 transition"
                  >
                    <IconBan /> Tolak
                  </button>
                )}
                {!canApprove && !canReject && !canSelesai && (
                  <span className="text-xs text-gray-400 italic">Status akhir — tidak ada tindakan tersedia</span>
                )}
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
    verifikasi: "Tidak ada laporan yang menunggu verifikasi",
    proses: "Tidak ada laporan yang sedang diproses",
    selesai: "Belum ada laporan yang diselesaikan",
    ditolak: "Tidak ada laporan yang ditolak",
  };
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl ${cfg.bg} border`}>
        {cfg.emptyIcon}
      </div>
      <p className="text-gray-400 text-sm font-medium">{messages[status]}</p>
      <p className="text-gray-300 text-xs mt-1">Data akan muncul di sini ketika tersedia</p>
    </div>
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
    const interval = setInterval(() => { fetchLaporan(); }, 3000);
    return () => clearInterval(interval);
  }, [fetchLaporan]);

  const handleStatusChange = useCallback(
    async (id: number, newStatus: StatusDB) => {
      try {
        setData((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
        await api.patch(`/laporan/${id}/status`, { status: newStatus });
        fetchLaporan();
      } catch (err) {
        console.error(err);
        fetchLaporan();
      }
    },
    [fetchLaporan]
  );

  const kategoriList = ["Semua", ...Array.from(new Set(data.map((l) => l.category_name)))];

  const filtered = data.filter((l) => {
    const matchSearch =
      l.judul_laporan.toLowerCase().includes(search.toLowerCase()) ||
      l.user_name.toLowerCase().includes(search.toLowerCase()) ||
      String(l.id).includes(search);
    const matchKategori = filterKategori === "Semua" || l.category_name === filterKategori;
    return matchSearch && matchKategori;
  });

  const byStatus = (s: StatusDB) => filtered.filter((l) => l.status === s);
  const totalByStatus = (s: StatusDB) => data.filter((l) => l.status === s).length;
  const needsAction = totalByStatus("verifikasi");
  const currentList = byStatus(activeTab);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── PAGE HEADER ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Kelola Laporan</h1>
                {needsAction > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {needsAction} perlu tindakan
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Total {data.length} laporan · Scroll untuk melihat semua laporan</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch /></span>
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari laporan..."
                  className="h-9 pl-9 pr-4 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20 transition w-48"
                />
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                <span className="text-gray-400 pl-2"><IconFilter /></span>
                {kategoriList.map((k) => (
                  <button key={k} type="button" onClick={() => setFilterKategori(k)}
                    className={`h-7 px-3 rounded-lg text-xs font-semibold transition-all ${filterKategori === k ? "bg-white text-[#C95E24] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >{k}</button>
                ))}
              </div>
              <button onClick={fetchLaporan} className="h-9 w-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 transition" title="Refresh">
                <IconRefresh />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">

        {/* ── SUMMARY STATS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 pb-4">
          {STATUS_ORDER.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const count = totalByStatus(s);
            const isActive = activeTab === s;
            return (
              <button key={s} type="button" onClick={() => setActiveTab(s)}
                className={`rounded-2xl border p-4 text-left transition-all ${cfg.bg} ${isActive ? "ring-2 ring-offset-1 " + (s === "verifikasi" ? "ring-blue-400" : s === "proses" ? "ring-amber-400" : s === "selesai" ? "ring-emerald-400" : "ring-red-400") : "hover:opacity-80"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot} ${s === "verifikasi" && count > 0 ? "animate-pulse" : ""}`} />
                  <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                </div>
                <p className={`text-3xl font-black ${cfg.color}`}>{count}</p>
                <p className="text-xs text-gray-400 mt-0.5">laporan</p>
              </button>
            );
          })}
        </div>

        {/* ── TABS ── */}
        <div className="flex items-center gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
          {STATUS_ORDER.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const count = byStatus(s).length;
            const isActive = activeTab === s;
            return (
              <button key={s} type="button" onClick={() => setActiveTab(s)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all -mb-px ${isActive ? cfg.tabActive : cfg.tabInactive}`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot} ${s === "verifikasi" && count > 0 ? "animate-pulse" : ""}`} />
                {cfg.label}
                <span className={`min-w-[1.4rem] text-center text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/70" : "bg-gray-100"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── LIST ── */}
        {loading ? (
          <div className="flex justify-center items-center py-24"><Spinner /></div>
        ) : currentList.length === 0 ? (
          <EmptyState status={activeTab} />
        ) : (
          <div className="flex flex-col gap-4 pb-10">
            {currentList.map((l) => (
              <LaporanRow key={l.id} laporan={l} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.18s ease-out; }
      `}</style>
    </div>
  );
}