"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { ShieldCheck, Plus, Trash2, Pencil, Search, X, KeyRound, User } from "lucide-react";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ManajemenAdmin() {
  const [admins, setAdmins]         = useState<Admin[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [openEdit, setOpenEdit]     = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [editForm, setEditForm]     = useState({ name: "", password: "" });

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get("/superadmin/admins");
      setAdmins(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus admin?")) return;
    try {
      await api.delete(`/superadmin/admins/${id}`);
      fetchAdmins();
    } catch (error) { console.log(error); }
  };

  const handleOpenEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditForm({ name: admin.name, password: "" });
    setOpenEdit(true);
  };

  const handleUpdateAdmin = async () => {
    if (!selectedAdmin) return;
    try {
      await api.put(`/superadmin/admins/${selectedAdmin.id}`, {
        name: editForm.name,
        password: editForm.password || undefined,
      });
      setOpenEdit(false);
      fetchAdmins();
      alert("Admin berhasil diupdate");
    } catch (error) {
      console.log(error);
      alert("Gagal update admin");
    }
  };

  const filteredAdmins = admins.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-[3px] border-slate-200 border-t-[#B45743] rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-7 flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Manajemen Admin</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Kelola seluruh akun admin</p>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#B45743] hover:bg-[#a04d3b] active:scale-95 text-white text-xs font-semibold transition-all shadow-sm">
          <Plus size={14} />
          Tambah Admin
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Cari nama atau email admin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500 transition">
            <X size={14} />
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                {["Nama", "Email", "Role", "Aksi"].map((col) => (
                  <th key={col} className={`px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest ${col === "Aksi" ? "text-center" : "text-left"}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-violet-700">{admin.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{admin.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-violet-100 text-violet-700 ring-1 ring-violet-200">
                      <ShieldCheck size={11} />
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(admin)}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-semibold transition-all"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold transition-all"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-14 text-center text-sm text-gray-400">
                    {search ? `Tidak ada admin dengan kata kunci "${search}"` : "Data admin kosong"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDIT */}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Pencil size={14} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Edit Admin</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedAdmin?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setOpenEdit(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 flex flex-col gap-4">

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-[#B45743] focus-within:ring-2 focus-within:ring-[#B45743]/10 transition-all">
                  <User size={14} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder-gray-300"
                    placeholder="Nama admin"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Password Baru</label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-[#B45743] focus-within:ring-2 focus-within:ring-[#B45743]/10 transition-all">
                  <KeyRound size={14} className="text-gray-400 shrink-0" />
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder-gray-300"
                    placeholder="Kosongkan jika tidak diubah"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 pl-1">Biarkan kosong jika tidak ingin mengubah password</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setOpenEdit(false)}
                className="flex-1 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateAdmin}
                className="flex-1 h-9 rounded-xl bg-[#B45743] hover:bg-[#a04d3b] active:scale-95 text-sm font-semibold text-white transition-all shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}