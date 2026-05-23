"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Users, UserCheck, ShieldCheck, Activity,
  FileText, AlertTriangle, CheckCircle2, Clock3, RefreshCw,
} from "lucide-react";

interface Statistik {
  totalUser: number;
  totalAdmin: number;
  totalLaporan: number;
  laporanSelesai: number;
  laporanProses: number;
  laporanDitolak: number;
}
interface User    { id: number; name: string; email: string; role: string; }
interface Laporan { id: number; judul_laporan: string; status: string; user_name: string; created_at: string; }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    selesai:    "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    proses:     "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    ditolak:    "bg-red-100 text-red-600 ring-1 ring-red-200",
    verifikasi: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  };
  const label: Record<string, string> = {
    selesai: "Selesai", proses: "Diproses", ditolak: "Ditolak", verifikasi: "Verifikasi",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {label[status] ?? status}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, accentBg, accentText, borderAccent }: {
  label: string; value?: number; icon: React.ElementType;
  accentBg: string; accentText: string; borderAccent: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${borderAccent} p-5 flex flex-col gap-3 shadow-sm`}>
      <p className="text-3xl font-extrabold text-gray-900 tabular-nums leading-none">
        {value ?? "—"}
      </p>
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${accentBg}`}>
          <Icon size={14} className={accentText} />
        </div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

export default function SuperDashboard() {
  const [statistik, setStatistik] = useState<Statistik | null>(null);
  const [admins, setAdmins]       = useState<User[]>([]);
  const [users, setUsers]         = useState<User[]>([]);
  const [laporan, setLaporan]     = useState<Laporan[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const [dashRes, adminRes, userRes, laporanRes] = await Promise.all([
        api.get("/superadmin/dashboard"),
        api.get("/superadmin/admins"),
        api.get("/superadmin/users"),
        api.get("/superadmin/laporan"),
      ]);
      setStatistik(dashRes.data);
      setAdmins(adminRes.data);
      setUsers(userRes.data);
      setLaporan(laporanRes.data);
    } catch (error: any) {
      console.error("ERROR:", error.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-[3px] border-slate-200 border-t-[#B45743] rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total User",      value: statistik?.totalUser,      icon: Users,         accentBg: "bg-blue-50",    accentText: "text-blue-500",    borderAccent: "border-l-blue-400"    },
    { label: "Total Admin",     value: statistik?.totalAdmin,     icon: ShieldCheck,   accentBg: "bg-violet-50",  accentText: "text-violet-500",  borderAccent: "border-l-violet-400"  },
    { label: "Total Laporan",   value: statistik?.totalLaporan,   icon: FileText,      accentBg: "bg-orange-50",  accentText: "text-orange-500",  borderAccent: "border-l-orange-400"  },
    { label: "Laporan Selesai", value: statistik?.laporanSelesai, icon: CheckCircle2,  accentBg: "bg-emerald-50", accentText: "text-emerald-500", borderAccent: "border-l-emerald-400" },
    { label: "Sedang Diproses", value: statistik?.laporanProses,  icon: Clock3,        accentBg: "bg-amber-50",   accentText: "text-amber-500",   borderAccent: "border-l-amber-400"   },
    { label: "Laporan Ditolak", value: statistik?.laporanDitolak, icon: AlertTriangle, accentBg: "bg-red-50",     accentText: "text-red-500",     borderAccent: "border-l-red-400"     },
  ];

  return (
    <div className="p-7 flex flex-col gap-6">

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ADMIN + USER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Admin */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
              <UserCheck size={15} className="text-violet-600" />
            </div>
            <h2 className="text-sm font-bold text-gray-800 flex-1">Data Admin</h2>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full tabular-nums">{admins.length}</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {admins.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10">Tidak ada data admin</p>
            ) : admins.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-violet-700">{a.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{a.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{a.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Activity size={15} className="text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-gray-800 flex-1">Data User</h2>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full tabular-nums">{users.length}</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {users.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10">Tidak ada data user</p>
            ) : users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-blue-700">{u.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LAPORAN TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <FileText size={15} className="text-orange-600" />
          </div>
          <h2 className="text-sm font-bold text-gray-800 flex-1">Monitoring Laporan</h2>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full tabular-nums">{laporan.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                {["User", "Judul Laporan", "Status", "Tanggal"].map((col) => (
                  <th key={col} className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {laporan.length === 0 ? (
                <tr><td colSpan={4} className="py-14 text-center text-sm text-gray-400">Belum ada laporan</td></tr>
              ) : laporan.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-gray-500">{item.user_name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{item.user_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[220px] truncate">{item.judul_laporan}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-3.5 text-xs text-gray-400 tabular-nums font-medium">
                    {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
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