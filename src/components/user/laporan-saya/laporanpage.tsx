"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  MapPin,
  Camera,
  Clock,
  CheckCircle2,
  XCircle,
  Construction,
  Lightbulb,
  Recycle,
  TriangleAlert,
  Palette,
  X,
  Pencil,
  Trash2,
  FileX,
  Lock,
} from "lucide-react";

const data = [
  { id: 1, title: "Jalan berlubang depan SDN 04", cat: "Infrastruktur", date: "12 Mei 2026", status: "Diproses", loc: "Jl. Margonda Raya, Depok", desc: "Terdapat lubang besar di tengah jalan yang membahayakan pengendara, sudah berlangsung selama 2 minggu.", photo: true },
  { id: 2, title: "Lampu jalan mati di gang Mawar", cat: "Penerangan", date: "10 Mei 2026", status: "Selesai", loc: "Gang Mawar No. 5, Depok", desc: "Lampu jalan padam sejak sepekan lalu, warga kesulitan beraktivitas saat malam hari.", photo: true },
  { id: 3, title: "Sampah menumpuk di pinggir kali", cat: "Kebersihan", date: "8 Mei 2026", status: "Selesai", loc: "Kali Ciliwung, Depok Timur", desc: "Tumpukan sampah di tepi kali menimbulkan bau tidak sedap dan berpotensi menyebabkan banjir.", photo: false },
  { id: 4, title: "Drainase tersumbat RT 03", cat: "Infrastruktur", date: "5 Mei 2026", status: "Diproses", loc: "RT 03/RW 07, Beji, Depok", desc: "Saluran air tersumbat sampah dan tanah, menyebabkan genangan setiap kali hujan deras.", photo: true },
  { id: 5, title: "Pohon tumbang menutup jalan", cat: "Kedaruratan", date: "2 Mei 2026", status: "Selesai", loc: "Jl. Raya Bogor KM 32", desc: "Pohon besar tumbang setelah hujan deras, menutup sebagian badan jalan utama.", photo: true },
  { id: 6, title: "Vandalisme tembok taman kota", cat: "Keindahan", date: "28 Apr 2026", status: "Ditolak", loc: "Taman Kota Depok", desc: "Tembok taman dicoret-coret dengan cat. Laporan ditolak karena duplikat laporan sebelumnya.", photo: false },
];

type CatKey =
  | "Infrastruktur"
  | "Penerangan"
  | "Kebersihan"
  | "Kedaruratan"
  | "Keindahan";

type StatusKey = "Diproses" | "Selesai" | "Ditolak";

const catCfg: Record<
  CatKey,
  {
    Icon: React.ElementType;
    bar: string;
    iconBg: string;
    iconColor: string;
    tagBg: string;
    tagText: string;
  }
> = {
  Infrastruktur: {
    Icon: Construction,
    bar: "bg-orange-400",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    tagBg: "bg-orange-50",
    tagText: "text-orange-700",
  },
  Penerangan: {
    Icon: Lightbulb,
    bar: "bg-yellow-400",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    tagBg: "bg-yellow-50",
    tagText: "text-yellow-700",
  },
  Kebersihan: {
    Icon: Recycle,
    bar: "bg-green-400",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    tagBg: "bg-green-50",
    tagText: "text-green-700",
  },
  Kedaruratan: {
    Icon: TriangleAlert,
    bar: "bg-red-400",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    tagBg: "bg-red-50",
    tagText: "text-red-700",
  },
  Keindahan: {
    Icon: Palette,
    bar: "bg-purple-400",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    tagBg: "bg-purple-50",
    tagText: "text-purple-700",
  },
};

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

export default function LaporanSaya() {
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selId, setSelId] = useState<number | null>(null);

  const statuses = ["Semua", "Diproses", "Selesai", "Ditolak"];

  const filtered = data.filter((r) => {
    const ms = filter === "Semua" || r.status === filter;
    const mq =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.loc.toLowerCase().includes(search.toLowerCase());

    return ms && mq;
  });

  const countOf = (s: string) =>
    data.filter((r) => r.status === s).length;

  const sel = data.find((r) => r.id === selId);

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900">
      <div className="max-w-4xl mx-auto px-5 py-8 pb-20">

        {/* TOP BAR */}
        <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
          <div>
            <Image
              src="/images/logo.png"
              alt="LaporinAja"
              width={140}
              height={36}
              className="mb-3 object-contain"
            />

            <p className="text-sm text-stone-400 mt-1">
              Pantau semua laporan yang telah kamu kirimkan
            </p>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold rounded-full transition-all shadow-md shadow-orange-200">
            <Plus size={16} />
            Buat Laporan
          </button>
        </div>

        {/* STAT */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(["Diproses", "Selesai", "Ditolak"] as StatusKey[]).map((s) => {
            const c = stCfg[s];

            return (
              <div
                key={s}
                className="relative bg-white rounded-2xl p-4 border border-stone-100 shadow-sm overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${c.statBar} rounded-t-2xl`}
                />

                <div
                  className={`w-9 h-9 ${c.statIconBg} rounded-xl flex items-center justify-center mb-2`}
                >
                  <c.Icon size={18} className={c.iconColor} />
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

        {/* TOOLBAR */}
        <div className="flex gap-2 mb-5 flex-wrap items-center">
          <div className="relative flex-1 min-w-[160px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Cari laporan atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-full outline-none focus:border-orange-400 focus:bg-white transition-colors placeholder:text-stone-400"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  filter === s
                    ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100"
                    : "bg-white border-stone-200 text-stone-500 hover:border-orange-400 hover:text-orange-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <FileX size={44} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Tidak ada laporan ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((r, i) => {
              const cc =
                catCfg[r.cat as CatKey] ?? catCfg["Infrastruktur"];

              const sc = stCfg[r.status as StatusKey];

              const isActive = selId === r.id;

              return (
                <div
                  key={r.id}
                  onClick={() =>
                    setSelId((p) => (p === r.id ? null : r.id))
                  }
                  style={{ animationDelay: `${i * 55}ms` }}
                  className={`relative bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200
                    ${
                      isActive
                        ? "border-orange-400 shadow-[0_0_0_3px_rgba(234,88,12,0.12)]"
                        : "border-stone-100 shadow-sm hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(234,88,12,0.12)] hover:border-orange-200"
                    }`}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${cc.bar}`}
                  />

                  <div className="p-4 pt-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div
                        className={`w-10 h-10 ${cc.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
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
                        {r.status}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-stone-800 leading-snug mb-1.5">
                      {r.title}
                    </p>

                    <p className="text-xs text-stone-400 flex items-center gap-1 mb-4">
                      <MapPin
                        size={12}
                        className="text-orange-400 flex-shrink-0"
                      />
                      {r.loc}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-300">
                          {r.date}
                        </span>

                        {r.photo && (
                          <span className="text-[11px] text-stone-400 flex items-center gap-1">
                            <Camera size={11} /> Foto
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${cc.tagBg} ${cc.tagText}`}
                      >
                        {r.cat}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DRAWER */}
      {sel && (
        <div
          className="fixed inset-0 bg-black/35 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => setSelId(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-3xl px-6 pt-5 pb-10 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-4" />

            <div className="flex justify-end mb-1">
              <button
                onClick={() => setSelId(null)}
                className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {(() => {
              const cc =
                catCfg[sel.cat as CatKey] ??
                catCfg["Infrastruktur"];

              const sc = stCfg[sel.status as StatusKey];

              const isProcessing = sel.status === "Diproses";

              return (
                <>
                  <div className="flex gap-3 items-start mb-5">
                    <div
                      className={`w-12 h-12 ${cc.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}
                    >
                      <cc.Icon
                        size={24}
                        className={cc.iconColor}
                      />
                    </div>

                    <div>
                      <p className="text-base font-extrabold text-stone-800 leading-snug mb-1.5">
                        {sel.title}
                      </p>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}
                      >
                        <sc.Icon
                          size={11}
                          className={sc.iconColor}
                        />
                        {sel.status}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-stone-100 mb-4" />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
                        Tanggal
                      </p>

                      <p className="text-sm font-semibold text-stone-800">
                        {sel.date}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
                        Kategori
                      </p>

                      <p className="text-sm font-semibold text-stone-800">
                        {sel.cat}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
                        Lokasi
                      </p>

                      <p className="text-sm font-semibold text-stone-800 flex items-center gap-1">
                        <MapPin
                          size={13}
                          className="text-orange-400 flex-shrink-0"
                        />
                        {sel.loc}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
                        ID Laporan
                      </p>

                      <p className="text-sm font-semibold text-stone-400">
                        #LP-00{sel.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
                        Foto
                      </p>

                      <p className="text-sm font-semibold text-stone-800 flex items-center gap-1">
                        {sel.photo ? (
                          <>
                            <Camera
                              size={13}
                              className="text-stone-400"
                            />
                            Tersedia
                          </>
                        ) : (
                          "—"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-stone-100 mb-4" />

                  <p className="text-sm text-stone-500 leading-relaxed bg-stone-50 rounded-xl px-4 py-3 mb-5">
                    {sel.desc}
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}