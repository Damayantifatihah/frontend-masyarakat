"use client";

import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Laporan",
    value: "1,284",
    icon: FileText,
    iconBg: "bg-orange-50",
    iconColor: "text-[#E8763A]",
  },
  {
    label: "Diproses",
    value: "320",
    icon: Clock,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    label: "Selesai",
    value: "860",
    icon: CheckCircle2,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "Ditolak",
    value: "104",
    icon: XCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-400",
  },
];

const laporan = [
  {
    id: "RPT-001",
    pelapor: "Ahmad Fauzi",
    inisial: "AF",
    judul: "Jalan berlubang di Jl. Margonda",
    kategori: "Infrastruktur",
    tanggal: "19 Mei 2026",
    status: "Diproses",
  },
  {
    id: "RPT-002",
    pelapor: "Rizky Pratama",
    inisial: "RP",
    judul: "Sampah menumpuk di TPS Cilandak",
    kategori: "Lingkungan",
    tanggal: "18 Mei 2026",
    status: "Selesai",
  },
  {
    id: "RPT-003",
    pelapor: "Siti Nurhaliza",
    inisial: "SN",
    judul: "Lampu jalan mati sejak 3 hari",
    kategori: "Infrastruktur",
    tanggal: "17 Mei 2026",
    status: "Diproses",
  },
  {
    id: "RPT-004",
    pelapor: "Budi Santoso",
    inisial: "BS",
    judul: "Drainase tersumbat menyebabkan banjir",
    kategori: "Lalu Lintas",
    tanggal: "16 Mei 2026",
    status: "Ditolak",
  },
  {
    id: "RPT-005",
    pelapor: "Dewi Lestari",
    inisial: "DL",
    judul: "Pohon tumbang menghalangi jalan",
    kategori: "Lingkungan",
    tanggal: "15 Mei 2026",
    status: "Selesai",
  },
];

const statusStyle: Record<string, string> = {
  Diproses: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  Selesai: "bg-green-50 text-green-600 border border-green-200",
  Ditolak: "bg-red-50 text-red-500 border border-red-200",
};

const kategoriStyle: Record<string, string> = {
  Infrastruktur: "bg-blue-50 text-blue-600",
  Lingkungan: "bg-emerald-50 text-emerald-600",
  "Lalu Lintas": "bg-purple-50 text-purple-600",
};

const avatarColor: string[] = [
  "bg-[#E8763A]",
  "bg-blue-400",
  "bg-emerald-500",
  "bg-purple-400",
  "bg-pink-400",
];

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-7 p-7 min-h-screen bg-[#F8F8F8]">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Selamat datang kembali! Berikut ringkasan laporan hari ini.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.iconColor} />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">Laporan Terbaru</h2>
            <p className="text-xs text-gray-400 mt-0.5">5 laporan terakhir masuk</p>
          </div>

          <button className="flex items-center gap-2 px-4 h-9 rounded-xl bg-[#FEF0E8] text-[#C95E24] text-sm font-semibold hover:bg-[#FDDCCA] transition">
            Lihat Semua
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Pelapor
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Judul Laporan
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {laporan.map((item, i) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#FFFAF7] transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">
                    {item.id}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${avatarColor[i % avatarColor.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {item.inisial}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {item.pelapor}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[220px] truncate">
                    {item.judul}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${kategoriStyle[item.kategori] ?? "bg-gray-100 text-gray-500"}`}>
                      {item.kategori}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-400">
                    {item.tanggal}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}