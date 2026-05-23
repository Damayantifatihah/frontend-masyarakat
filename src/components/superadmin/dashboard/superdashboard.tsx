"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Users, UserCheck, ShieldCheck, Activity,
  FileText, AlertTriangle, CheckCircle2, Clock3,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────

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

// ─── STATUS BADGE ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    selesai:    "bg-emerald-50 text-emerald-600 border-emerald-100",
    proses:     "bg-amber-50 text-amber-600 border-amber-100",
    ditolak:    "bg-red-50 text-red-500 border-red-100",
    verifikasi: "bg-blue-50 text-blue-600 border-blue-100",
  };
  const label: Record<string, string> = {
    selesai: "Selesai", proses: "Diproses", ditolak: "Ditolak", verifikasi: "Verifikasi",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${map[status] ?? "bg-gray-50 text-gray-500 border-gray-100"}`}>
      {label[status] ?? status}
    </span>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, iconBg, iconColor }: {
  label: string; value?: number;
  icon: React.ElementType; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800 mt-0.5 tabular-nums">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

// ─── COMPONENT ───────────────────────────────────────────────────────────

export default function SuperDashboard() {
  const [statistik, setStatistik] = useState<Statistik | null>(null);
  const [admins, setAdmins]       = useState<User[]>([]);
  const [users, setUsers]         = useState<User[]>([]);
  const [laporan, setLaporan]     = useState<Laporan[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-6 h-6 animate-spin text-gray-300" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total User",       value: statistik?.totalUser,       icon: Users,        iconBg: "bg-blue-50",    iconColor: "text-blue-500"    },
    { label: "Total Admin",      value: statistik?.totalAdmin,      icon: ShieldCheck,  iconBg: "bg-violet-50",  iconColor: "text-violet-500"  },
    { label: "Total Laporan",    value: statistik?.totalLaporan,    icon: FileText,     iconBg: "bg-orange-50",  iconColor: "text-orange-500"  },
    { label: "Laporan Selesai",  value: statistik?.laporanSelesai,  icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "Sedang Diproses",  value: statistik?.laporanProses,   icon: Clock3,       iconBg: "bg-amber-50",   iconColor: "text-amber-500"   },
    { label: "Laporan Ditolak",  value: statistik?.laporanDitolak,  icon: AlertTriangle,iconBg: "bg-red-50",     iconColor: "text-red-500"     },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Super Admin Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">Monitoring admin, user, dan laporan</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="h-8 w-8 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
            title="Refresh"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── ADMIN + USER ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Admin */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <UserCheck size={15} className="text-violet-500" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">Data Admin</h2>
              <span className="ml-auto text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full tabular-nums">{admins.length}</span>
            </div>
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {admins.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Tidak ada data admin</p>
              ) : admins.map((admin) => (
                <div key={admin.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-violet-600">{admin.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{admin.name}</p>
                    <p className="text-xs text-gray-400 truncate">{admin.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <Activity size={15} className="text-blue-500" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">Data User</h2>
              <span className="ml-auto text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full tabular-nums">{users.length}</span>
            </div>
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Tidak ada data user</p>
              ) : users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-600">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── LAPORAN TABLE ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
              <FileText size={15} className="text-orange-500" />
            </div>
            <h2 className="text-sm font-bold text-gray-800">Monitoring Laporan</h2>
            <span className="ml-auto text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full tabular-nums">{laporan.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">User</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Judul Laporan</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {laporan.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-gray-400">Belum ada laporan</td>
                  </tr>
                ) : laporan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-gray-500">{item.user_name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{item.user_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[220px] truncate">{item.judul_laporan}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 tabular-nums">
                      {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}