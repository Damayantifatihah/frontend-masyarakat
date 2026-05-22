"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import {
  Users,
  UserCheck,
  ShieldCheck,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

interface Statistik {
  totalUser: number;
  totalAdmin: number;
  totalLaporan: number;
  laporanSelesai: number;
  laporanProses: number;
  laporanDitolak: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Laporan {
  id: number;
  judul_laporan: string;
  status: string;
  user_name: string;
  created_at: string;
}

export default function SuperDashboard() {
  const [statistik, setStatistik] =
    useState<Statistik | null>(null);

  const [admins, setAdmins] = useState<User[]>([]);

  const [users, setUsers] = useState<User[]>([]);

  const [laporan, setLaporan] = useState<Laporan[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

const fetchDashboard = async () => {
  try {
    console.log(
      "TOKEN:",
      localStorage.getItem("token")
    );

    const dashboardRes =
      await api.get(
        "/superadmin/dashboard"
      );

    console.log(
      "DASHBOARD:",
      dashboardRes.data
    );

    const adminRes = await api.get(
      "/superadmin/admins"
    );

    console.log(
      "ADMINS:",
      adminRes.data
    );

    const userRes = await api.get(
      "/superadmin/users"
    );

    console.log(
      "USERS:",
      userRes.data
    );

    const laporanRes = await api.get(
      "/superadmin/laporan"
    );

    console.log(
      "LAPORAN:",
      laporanRes.data
    );

    setStatistik(dashboardRes.data);

    setAdmins(adminRes.data);

    setUsers(userRes.data);

    setLaporan(laporanRes.data);
  } catch (error: any) {
    console.log(
      "ERROR:",
      error.response?.data
    );

    console.log(
      "STATUS:",
      error.response?.status
    );
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Super Admin
        </h1>

        <p className="mt-2 text-gray-500">
          Monitoring admin, user, dan laporan
        </p>
      </div>

      {/* CARD */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* USER */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total User
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {statistik?.totalUser}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3">
              <Users
                className="text-blue-600"
                size={28}
              />
            </div>
          </div>
        </div>

        {/* ADMIN */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Admin
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {statistik?.totalAdmin}
              </h2>
            </div>

            <div className="rounded-xl bg-purple-100 p-3">
              <ShieldCheck
                className="text-purple-600"
                size={28}
              />
            </div>
          </div>
        </div>

        {/* TOTAL LAPORAN */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Laporan
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {statistik?.totalLaporan}
              </h2>
            </div>

            <div className="rounded-xl bg-orange-100 p-3">
              <FileText
                className="text-orange-600"
                size={28}
              />
            </div>
          </div>
        </div>

        {/* SELESAI */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Laporan Selesai
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {statistik?.laporanSelesai}
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-3">
              <CheckCircle2
                className="text-green-600"
                size={28}
              />
            </div>
          </div>
        </div>

        {/* PROSES */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Sedang Diproses
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {statistik?.laporanProses}
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-100 p-3">
              <Clock3
                className="text-yellow-600"
                size={28}
              />
            </div>
          </div>
        </div>

        {/* DITOLAK */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Laporan Ditolak
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-800">
                {statistik?.laporanDitolak}
              </h2>
            </div>

            <div className="rounded-xl bg-red-100 p-3">
              <AlertTriangle
                className="text-red-600"
                size={28}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ADMIN */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-2">
              <UserCheck className="text-purple-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Data Admin
            </h2>
          </div>

          <div className="space-y-4">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <h3 className="font-semibold text-gray-800">
                  {admin.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {admin.email}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* USER */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2">
              <Activity className="text-blue-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Data User
            </h2>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <h3 className="font-semibold text-gray-800">
                  {user.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {user.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LAPORAN */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-orange-100 p-2">
            <FileText className="text-orange-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Monitoring Laporan User
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="py-3 text-sm font-semibold text-gray-600">
                  User
                </th>

                <th className="py-3 text-sm font-semibold text-gray-600">
                  Judul
                </th>

                <th className="py-3 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="py-3 text-sm font-semibold text-gray-600">
                  Tanggal
                </th>
              </tr>
            </thead>

            <tbody>
              {laporan.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50"
                >
                  <td className="py-4 text-sm text-gray-700">
                    {item.user_name}
                  </td>

                  <td className="py-4 text-sm text-gray-700">
                    {item.judul_laporan}
                  </td>

                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold
                      ${
                        item.status === "selesai"
                          ? "bg-green-100 text-green-600"
                          : item.status === "proses"
                          ? "bg-yellow-100 text-yellow-600"
                          : item.status === "ditolak"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-4 text-sm text-gray-500">
                    {new Date(
                      item.created_at
                    ).toLocaleDateString("id-ID")}
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