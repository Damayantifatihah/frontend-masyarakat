"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import {
  ShieldCheck,
  Plus,
  Trash2,
  Pencil,
  Search,
  X,
} from "lucide-react";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ManajemenAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =========================
  // MODAL EDIT
  // =========================
  const [openEdit, setOpenEdit] =
    useState(false);

  const [selectedAdmin, setSelectedAdmin] =
    useState<Admin | null>(null);

  const [editForm, setEditForm] =
    useState({
      name: "",
      password: "",
    });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get(
        "/superadmin/admins"
      );

      setAdmins(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (
    id: number
  ) => {
    const confirmDelete = confirm(
      "Yakin ingin menghapus admin?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/superadmin/admins/${id}`
      );

      fetchAdmins();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // OPEN EDIT
  // =========================
  const handleOpenEdit = (
    admin: Admin
  ) => {
    setSelectedAdmin(admin);

    setEditForm({
      name: admin.name,
      password: "",
    });

    setOpenEdit(true);
  };

  // =========================
  // UPDATE ADMIN
  // =========================
  const handleUpdateAdmin =
    async () => {
      if (!selectedAdmin) return;

      try {
        await api.put(
          `/superadmin/admins/${selectedAdmin.id}`,
          {
            name: editForm.name,
            password:
              editForm.password || undefined,
          }
        );

        setOpenEdit(false);

        fetchAdmins();

        alert(
          "Admin berhasil diupdate"
        );
      } catch (error) {
        console.log(error);

        alert(
          "Gagal update admin"
        );
      }
    };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      admin.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen Admin
          </h1>

          <p className="mt-1 text-gray-500">
            Kelola seluruh akun admin
          </p>
        </div>

        <button
          className="
          flex items-center gap-2
          rounded-xl bg-[#B45743]
          px-5 py-3
          text-white
          transition hover:opacity-90
        "
        >
          <Plus size={20} />
          Tambah Admin
        </button>
      </div>

      {/* SEARCH */}
      <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
        <div
          className="
          flex items-center gap-3
          rounded-xl border border-gray-200
          px-4 py-3
        "
        >
          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari admin..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full bg-transparent
              text-sm outline-none
            "
          />
        </div>
      </div>

      {/* TABLE */}
      <div
        className="
        mt-6 overflow-hidden
        rounded-2xl bg-white shadow-sm
      "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
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
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-t border-gray-100"
                >
                  {/* NAMA */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                        flex h-11 w-11 items-center justify-center
                        rounded-full bg-purple-100
                      "
                      >
                        <ShieldCheck className="text-purple-600" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {admin.name}
                        </h3>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {admin.email}
                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    <span
                      className="
                      rounded-full bg-purple-100
                      px-3 py-1 text-xs font-semibold
                      text-purple-600
                    "
                    >
                      {admin.role}
                    </span>
                  </td>

                  {/* AKSI */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      {/* EDIT */}
                      <button
                        onClick={() =>
                          handleOpenEdit(admin)
                        }
                        className="
                        flex h-10 w-10 items-center justify-center
                        rounded-xl bg-yellow-100
                        text-yellow-600
                        transition hover:scale-105
                      "
                      >
                        <Pencil size={18} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDelete(admin.id)
                        }
                        className="
                        flex h-10 w-10 items-center justify-center
                        rounded-xl bg-red-100
                        text-red-600
                        transition hover:scale-105
                      "
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAdmins.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="
                    py-10 text-center
                    text-gray-400
                  "
                  >
                    Data admin kosong
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT */}
      {openEdit && (
        <div
          className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/40 p-4
        "
        >
          <div
            className="
            w-full max-w-md
            rounded-2xl bg-white p-6
          "
          >
            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Edit Admin
              </h2>

              <button
                onClick={() =>
                  setOpenEdit(false)
                }
              >
                <X />
              </button>
            </div>

            {/* USERNAME */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Username
              </label>

              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value,
                  })
                }
                className="
                  w-full rounded-xl border
                  px-4 py-3 outline-none
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Password Baru
              </label>

              <input
                type="password"
                placeholder="Kosongkan jika tidak diubah"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    password:
                      e.target.value,
                  })
                }
                className="
                  w-full rounded-xl border
                  px-4 py-3 outline-none
                "
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleUpdateAdmin}
              className="
                w-full rounded-xl
                bg-[#B45743]
                py-3 font-semibold text-white
              "
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}