"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type StatusDB =
  | "verifikasi"
  | "proses"
  | "selesai"
  | "ditolak";

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
  tanggapan?: string;
}

function getGambarItems(
  gambar: string | string[] | null
): string[] {
  if (!gambar) return [];

  if (Array.isArray(gambar)) {
    return gambar;
  }

  try {
    const parsed = JSON.parse(gambar);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [gambar];
  } catch {
    return [gambar];
  }
}

// ─────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────

const STATUS_CONFIG: Record<
  StatusDB,
  {
    label: string;
    color: string;
    bg: string;
    headerBg: string;
    emptyIcon: string;
  }
> = {
  verifikasi: {
    label: "Menunggu Verifikasi",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-100",
    headerBg: "from-blue-400 to-blue-500",
    emptyIcon: "🔍",
  },

  proses: {
    label: "Sedang Diproses",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
    headerBg: "from-amber-400 to-orange-400",
    emptyIcon: "⚙️",
  },

  selesai: {
    label: "Selesai",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
    headerBg: "from-emerald-400 to-teal-500",
    emptyIcon: "✅",
  },

  ditolak: {
    label: "Ditolak",
    color: "text-red-600",
    bg: "bg-red-50 border-red-100",
    headerBg: "from-red-400 to-rose-500",
    emptyIcon: "🚫",
  },
};

const KATEGORI_COLOR: Record<
  string,
  string
> = {
  Infrastruktur:
    "bg-violet-50 text-violet-600 border-violet-100",

  "Lalu Lintas":
    "bg-sky-50 text-sky-600 border-sky-100",

  Lingkungan:
    "bg-teal-50 text-teal-600 border-teal-100",
};

const STATUS_ORDER: StatusDB[] = [
  "verifikasi",
  "proses",
  "selesai",
  "ditolak",
];

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────

const IconSearch = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const IconCalendar = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect
      width="18"
      height="18"
      x="3"
      y="4"
      rx="2"
    />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const IconPin = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconUser = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const Spinner = ({
  size = "md",
}: {
  size?: "sm" | "md";
}) => (
  <svg
    className={`animate-spin text-gray-400 ${
      size === "sm"
        ? "w-4 h-4"
        : "w-5 h-5"
    }`}
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-20"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />

    <path
      className="opacity-70"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ─────────────────────────────────────────────
// DIALOG TANGGAPAN
// ─────────────────────────────────────────────

function TanggapanDialog({
  type,
  loading,
  onCancel,
  onSubmit,
}: {
  type: "approve" | "reject";
  loading: boolean;
  onCancel: () => void;
  onSubmit: (
    tanggapan: string
  ) => void;
}) {
  const [tanggapan, setTanggapan] =
    useState("");

  const isApprove = type === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-800">
          {isApprove
            ? "Terima Laporan"
            : "Tolak Laporan"}
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Berikan tanggapan admin
        </p>

        <textarea
          value={tanggapan}
          onChange={(e) =>
            setTanggapan(e.target.value)
          }
          placeholder="Tulis tanggapan..."
          className="w-full mt-5 min-h-[140px] rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none text-gray-800 focus:ring-2 focus:ring-gray-200 resize-none"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold"
          >
            Batal
          </button>

          <button
            disabled={
              loading ||
              !tanggapan.trim()
            }
            onClick={() =>
              onSubmit(tanggapan)
            }
            className={`flex-1 h-11 rounded-2xl text-white text-sm font-semibold ${
              isApprove
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-red-500 hover:bg-red-600"
            } disabled:opacity-50`}
          >
            {loading ? (
              <div className="flex justify-center">
                <Spinner size="sm" />
              </div>
            ) : isApprove ? (
              "Terima"
            ) : (
              "Tolak"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LAPORAN ROW
// ─────────────────────────────────────────────

function LaporanRow({
  laporan,
  onStatusChange,
}: {
  laporan: Laporan;
  onStatusChange: (
    id: number,
    status: StatusDB,
    tanggapan?: string
  ) => Promise<void>;
}) {
  const cfg = STATUS_CONFIG[laporan.status];

  const gambarItems = getGambarItems(
    laporan.gambar
  );

  const [dialog, setDialog] =
    useState<
      "approve" | "reject" | null
    >(null);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    status: StatusDB,
    tanggapan: string
  ) => {
    try {
      setLoading(true);

      await onStatusChange(
        laporan.id,
        status,
        tanggapan
      );

      setDialog(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div
          className={`h-1 bg-gradient-to-r ${cfg.headerBg}`}
        />

        <div className="p-5">
          {/* BADGES */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
              #{laporan.id}
            </span>

            <span
              className={`px-3 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.color}`}
            >
              {cfg.label}
            </span>

            <span
              className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                KATEGORI_COLOR[
                  laporan.category_name
                ] ||
                "bg-gray-50 text-gray-500 border-gray-100"
              }`}
            >
              {laporan.category_name}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* GAMBAR */}
            {gambarItems.length > 0 && (
              <div className="grid grid-cols-2 gap-2 w-full md:w-[220px]">
                {gambarItems
                  .slice(0, 4)
                  .map((img, index) => (
                    <div
                      key={index}
                      className="h-28 rounded-2xl overflow-hidden border border-gray-100"
                    >
                      <img
                        src={img}
                        alt={`gambar-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            )}

            {/* CONTENT */}
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-800">
                {laporan.judul_laporan}
              </h2>

              <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">
                {laporan.isi_laporan}
              </p>

              {/* META */}
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <IconUser />
                  {laporan.user_name}
                </span>

                <span className="flex items-center gap-1">
                  <IconPin />
                  {laporan.lokasi}
                </span>

                <span className="flex items-center gap-1">
                  <IconCalendar />
                  {new Date(
                    laporan.tanggal_kejadian
                  ).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              {/* TANGGAPAN */}
              {laporan.tanggapan && (
                <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-xs font-bold text-orange-700 mb-1">
                    Tanggapan Admin
                  </p>

                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {laporan.tanggapan}
                  </p>
                </div>
              )}

              {/* ACTION */}
              <div className="flex flex-wrap gap-2 mt-5">
                {laporan.status ===
                  "verifikasi" && (
                  <>
                    <button
                      onClick={() =>
                        setDialog("approve")
                      }
                      className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold"
                    >
                      Terima + Tanggapan
                    </button>

                    <button
                      onClick={() =>
                        setDialog("reject")
                      }
                      className="h-10 px-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold"
                    >
                      Tolak + Tanggapan
                    </button>
                  </>
                )}

                {laporan.status ===
                  "proses" && (
                  <button
                    onClick={() =>
                      handleSubmit(
                        "selesai",
                        laporan.tanggapan ||
                          "Laporan selesai ditangani."
                      )
                    }
                    className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold"
                  >
                    Selesaikan
                  </button>
                )}

                {(laporan.status ===
                  "selesai" ||
                  laporan.status ===
                    "ditolak") && (
                  <span className="text-xs italic text-gray-400">
                    Tidak ada tindakan
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIALOG */}
      {dialog && (
        <TanggapanDialog
          type={dialog}
          loading={loading}
          onCancel={() =>
            setDialog(null)
          }
          onSubmit={(tanggapan) =>
            handleSubmit(
              dialog === "approve"
                ? "proses"
                : "ditolak",
              tanggapan
            )
          }
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────

function EmptyState({
  status,
}: {
  status: StatusDB;
}) {
  return (
    <div className="py-20 text-center">
      <div className="text-5xl mb-4">
        {STATUS_CONFIG[status].emptyIcon}
      </div>

      <h3 className="font-bold text-gray-700">
        Tidak ada laporan
      </h3>

      <p className="text-sm text-gray-400 mt-1">
        Data laporan akan muncul di sini
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function KelolaLaporan() {
  const [data, setData] = useState<
    Laporan[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState<StatusDB>("verifikasi");

  const fetchLaporan = useCallback(
    async () => {
      try {
        setLoading(true);

        const res = await api.get(
          "/laporan"
        );

        const result =
          res.data?.data ||
          res.data ||
          [];

        setData(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  const handleStatusChange =
    useCallback(
      async (
        id: number,
        status: StatusDB,
        tanggapan?: string
      ) => {
        try {
          await api.patch(
            `/laporan/${id}/status`,
            {
              status,
              tanggapan,
            }
          );

          await fetchLaporan();
        } catch (error) {
          console.log(error);
        }
      },
      [fetchLaporan]
    );

  const filtered = data.filter(
    (item) => {
      const searchValue =
        search.toLowerCase();

      return (
        item.status === activeTab &&
        (item.judul_laporan
          ?.toLowerCase()
          .includes(searchValue) ||
          item.user_name
            ?.toLowerCase()
            .includes(searchValue) ||
          String(item.id).includes(
            searchValue
          ))
      );
    }
  );

  const totalByStatus = (
    status: StatusDB
  ) =>
    data.filter(
      (item) => item.status === status
    ).length;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Kelola Laporan
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Verifikasi dan kelola
                laporan masyarakat
              </p>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                <IconSearch />
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari laporan..."
                className="h-11 pl-10 pr-4 rounded-2xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-2 overflow-x-auto mt-6">
            {STATUS_ORDER.map((status) => {
              const cfg =
                STATUS_CONFIG[status];

              const isActive =
                activeTab === status;

              return (
                <button
                  key={status}
                  onClick={() =>
                    setActiveTab(status)
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                    isActive
                      ? `${cfg.bg} ${cfg.color} border`
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cfg.label} (
                  {totalByStatus(status)})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            status={activeTab}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((laporan) => (
              <LaporanRow
                key={laporan.id}
                laporan={laporan}
                onStatusChange={
                  handleStatusChange
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}