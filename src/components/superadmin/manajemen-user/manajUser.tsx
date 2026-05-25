"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import {
  Users,
  Search,
  Mail,
  Shield,
  Trash2,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ManajemenUser() {
  const [users, setUsers] = useState<User[]>([]);

  const [filteredUsers, setFilteredUsers] =
    useState<User[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const result = users.filter((user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredUsers(result);
  }, [search, users]);

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {
    try {
      const res = await api.get(
        "/superadmin/users"
      );

      setUsers(res.data);

      setFilteredUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const handleDelete = async (
    id: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Yakin ingin menghapus user ini?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/superadmin/users/${id}`
      );

      // REFRESH DATA
      fetchUsers();

      alert(
        "User berhasil dihapus"
      );
    } catch (error) {
      console.log(error);

      alert(
        "Gagal menghapus user"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen User
          </h1>

          <p className="mt-2 text-gray-500">
            Monitoring seluruh user yang
            terdaftar
          </p>
        </div>

        <div className="hidden rounded-2xl bg-white p-4 shadow-sm md:flex">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <Users className="text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total User
              </p>

              <h2 className="text-2xl font-bold text-gray-800">
                {users.length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari user..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-[#E8763A]"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            
            {/* TABLE HEAD */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Nama
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Role
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    User tidak ditemukan
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    
                    {/* NAME */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                          {user.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {user.name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} />

                        <span>
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
                        <Shield size={14} />

                        {user.role}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() =>
                          handleDelete(
                            user.id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />

                        Hapus
                      </button>
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