"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Activity,
} from "lucide-react";
import api from "@/lib/axios";

// TYPES

type StatusDB = "verifikasi" | "proses" | "selesai" | "ditolak";

interface DashboardLaporan {
  id: number;
  judul_laporan: string;
  status: StatusDB;
  tanggal_kejadian: string;
  user_name: string;
  category_name: string;
}

// STATUS STYLE

const statusStyle: Record<string, string> = {
  Diproses: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  Selesai: "bg-green-50 text-green-600 border border-green-200",
  Ditolak: "bg-red-50 text-red-500 border border-red-200",
  Verifikasi: "bg-blue-50 text-blue-600 border border-blue-200",
};

const kategoriStyle: Record<string, string> = {
  Infrastruktur: "bg-violet-50 text-violet-600",
  Lingkungan: "bg-emerald-50 text-emerald-600",
  "Lalu Lintas": "bg-sky-50 text-sky-600",
};

const avatarColor: string[] = [
  "bg-[#E8763A]",
  "bg-blue-400",
  "bg-emerald-500",
  "bg-purple-400",
  "bg-pink-400",
];

// DONUT CHART

function DonutChart({
  verifikasi,
  proses,
  selesai,
  ditolak,
}: {
  verifikasi: number;
  proses: number;
  selesai: number;
  ditolak: number;
}) {
  const data = [
    { label: "Selesai", value: selesai, color: "#22c55e" },
    { label: "Diproses", value: proses, color: "#eab308" },
    { label: "Verifikasi", value: verifikasi, color: "#3b82f6" },
    { label: "Ditolak", value: ditolak, color: "#f87171" },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);

  let offset = 0;
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;

  const slices = data.map((d) => {
    const pct = total ? d.value / total : 0;
    const dash = pct * circumference;
    const gap = circumference - dash;

    const slice = { ...d, dash, gap, offset };
    offset += dash;

    return slice;
  });

  return (
    <div className="flex items-center gap-5">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="transparent"
          stroke="#f3f4f6"
          strokeWidth="18"
        />

        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="transparent"
            stroke={s.color}
            strokeWidth="18"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset + circumference * 0.25}
          />
        ))}

        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="fill-gray-800"
          style={{ fontSize: 18, fontWeight: 700 }}
        >
          {total}
        </text>

        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          className="fill-gray-400"
          style={{ fontSize: 10 }}
        >
          Total
        </text>
      </svg>

      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: d.color }}
            />

            <span className="text-xs text-gray-500">{d.label}</span>

            <span className="text-xs font-bold text-gray-700 ml-auto">
              {total ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// KATEGORI BAR

function KategoriBar({
  
  data,
}: {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">{d.label}</span>

            <span className="text-xs font-bold text-gray-700">
              {d.value}
            </span>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${d.color}`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// MAIN

export default function AdminDashboard() {
  const [laporan, setLaporan] = useState<DashboardLaporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);

 const [laporanRes, kategoriRes] =
  await Promise.all([
    api.get("/laporan"),
    api.get("/categories"),
  ]);

setLaporan(
  laporanRes.data?.data ?? []
);

setCategories(
  kategoriRes.data?.data ?? []
);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchDashboard]);

  // COUNT STATUS

  const total = laporan.length;

  const verifikasi = laporan.filter(
    (l) => l.status === "verifikasi"
  ).length;

  const proses = laporan.filter(
    (l) => l.status === "proses"
  ).length;

  const selesai = laporan.filter(
    (l) => l.status === "selesai"
  ).length;

  const ditolak = laporan.filter(
    (l) => l.status === "ditolak"
  ).length;

  // KATEGORI

  const kategoriCount = laporan.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.category_name] =
        (acc[item.category_name] || 0) + 1;

      return acc;
    },
    {}
  );

 const warnaKategori = [
  "bg-violet-400",
  "bg-emerald-400",
  "bg-sky-400",
  "bg-orange-400",
  "bg-pink-400",
  "bg-indigo-400",
  "bg-yellow-400",
];

const kategoriData = categories.map(
  (kategori: any, index) => ({
    label: kategori.name,
    value:
      kategoriCount[
        kategori.name
      ] || 0,
    color:
      warnaKategori[
        index % warnaKategori.length
      ],
  })
);

  // STATS

  const stats = [
    {
      label: "Total Laporan",
      value: total,
      sub: "Semua laporan",
      icon: FileText,
      iconBg: "bg-orange-50",
      iconColor: "text-[#E8763A]",
      trend: true,
    },
    {
      label: "Menunggu Verifikasi",
      value: verifikasi,
      sub: "Perlu ditinjau admin",
      icon: ShieldCheck,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      trend: false,
    },
    {
      label: "Sedang Diproses",
      value: proses,
      sub: "Dalam penanganan",
      icon: Clock,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-500",
      trend: false,
    },
    {
      label: "Selesai",
      value: selesai,
      sub: "Berhasil ditangani",
      icon: CheckCircle2,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
      trend: true,
    },
  ];

  // FORMAT STATUS

  const formatStatus = (status: StatusDB) => {
    switch (status) {
      case "verifikasi":
        return "Verifikasi";
      case "proses":
        return "Diproses";
      case "selesai":
        return "Selesai";
      case "ditolak":
        return "Ditolak";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-7 min-h-screen bg-[#F7F8FA]">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Ringkasan dan monitoring laporan masyarakat
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {stat.label}
              </p>

              <div
                className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center`}
              >
                <stat.icon
                  size={16}
                  className={stat.iconColor}
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-gray-800">
                {stat.value}
              </h2>

              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                {stat.trend && (
                  <TrendingUp
                    size={11}
                    className="text-green-500"
                  />
                )}

                {stat.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHART */}
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm font-bold text-gray-700 mb-4">
              Laporan per Kategori
            </p>

            <KategoriBar data={kategoriData} />
          </div>

          <div className="bg-gradient-to-br bg-[#FE7951] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">
                Butuh Perhatian
              </p>

              <h3 className="text-white font-extrabold text-2xl mt-2">
                {verifikasi}
              </h3>

              <p className="text-white/80 text-sm mt-1">
                Laporan menunggu verifikasi admin
              </p>
            </div>

            <a
              href="/admin/kelola-laporan"
              className="mt-5 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition text-white text-sm font-semibold px-4 h-9 rounded-xl"
            >
              Kelola Sekarang <ArrowRight size={14} />
            </a>
          </div>
        </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              Laporan Terbaru
            </h2>

            <p className="text-xs text-gray-400 mt-0.5">
              5 laporan terakhir masuk
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                {[
                  "ID",
                  "Pelapor",
                  "Judul",
                  "Kategori",
                  "Tanggal",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                laporan.slice(0, 5).map((item, i) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FFFAF7] transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-gray-400">
                      RPT-{item.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full ${
                            avatarColor[i % avatarColor.length]
                          } flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {item.user_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <span className="text-sm font-medium text-gray-700">
                          {item.user_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.judul_laporan}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          kategoriStyle[item.category_name] ??
                          "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.category_name}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-400">
                      {item.tanggal_kejadian}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          statusStyle[
                            formatStatus(item.status)
                          ]
                        }`}
                      >
                        {formatStatus(item.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}