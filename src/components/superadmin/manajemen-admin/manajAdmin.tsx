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
const [editForm, setEditForm] = useState({
  name: "",
  email: "",
  password: "",
});
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    no_tlp: "",
  });

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

  setEditForm({
    name: admin.name,
    email: admin.email,
    password: "",
  });

  setOpenEdit(true);
};

  const handleUpdateAdmin = async () => {
    if (!selectedAdmin) return;
    try {
     await api.put(`/superadmin/admins/${selectedAdmin.id}`, {
      name: editForm.name,
      email: editForm.email,
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

  const handleCreateAdmin = async () => {
    try {
      const res = await api.post("/superadmin/admins", createForm);
      console.log("SUCCESS:", res.data);
      setCreateForm({ name: "", email: "", password: "", no_tlp: "" });
      setOpenCreate(false);
      fetchAdmins();
      alert("Admin berhasil ditambahkan");
    } catch (error: any) {
      console.log("ERROR:", error);
      alert(error.response?.data?.message || "Gagal menambahkan admin");
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
        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#B45743] hover:bg-[#a04d3b] active:scale-95 text-white text-xs font-semibold transition-all shadow-sm"
        >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[420px] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Pencil size={15} className="text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Edit Admin</p>
                  <p className="text-xs text-gray-400">Ubah nama atau password admin</p>
                </div>
              </div>
              <button
                onClick={() => setOpenEdit(false)}
                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Nama lengkap</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Nama admin"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 outline-none focus:border-[#B45743] focus:ring-2 focus:ring-[#B45743]/10 transition"
                  />
                </div>
              </div>



              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="admin@email.com"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                  Password baru <span className="text-gray-300 font-normal">(kosongkan jika tidak diubah)</span>
                </label>
                <div className="relative">
                  <KeyRound size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="Password baru..."
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 outline-none focus:border-[#B45743] focus:ring-2 focus:ring-[#B45743]/10 transition"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2.5 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setOpenEdit(false)}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateAdmin}
                className="flex-[2] flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl bg-[#B45743] hover:bg-[#a04d3b] active:scale-95 text-white transition-all shadow-sm"
              >
                <Pencil size={13} />
                Simpan Perubahan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL CREATE */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAECE7] flex items-center justify-center">
                  <User size={17} className="text-[#B45743]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Tambah admin baru</p>
                  <p className="text-xs text-gray-400">Lengkapi data di bawah ini</p>
                </div>
              </div>
              <button
                onClick={() => setOpenCreate(false)}
                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-4">

              {/* Row: Nama + No Telepon */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">Nama lengkap</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Nama admin"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 outline-none focus:border-[#B45743] focus:ring-2 focus:ring-[#B45743]/10 transition"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">No. telepon</label>
                  <div className="relative">
                    <KeyRound size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="08xx"
                      value={createForm.no_tlp}
                      onChange={(e) => setCreateForm({ ...createForm, no_tlp: e.target.value })}
                      className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 outline-none focus:border-[#B45743] focus:ring-2 focus:ring-[#B45743]/10 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Alamat email</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    type="email"
                    placeholder="admin@email.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 outline-none focus:border-[#B45743] focus:ring-2 focus:ring-[#B45743]/10 transition"
                  />
                </div>
              </div>


         

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Password</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    placeholder="Min. 8 karakter"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 outline-none focus:border-[#B45743] focus:ring-2 focus:ring-[#B45743]/10 transition"
                  />
                </div>
              </div>

              {/* Info hint */}
              <div className="flex items-start gap-2.5 bg-[#FAECE7] border border-[#F0997B]/40 rounded-xl px-3.5 py-3">
                <ShieldCheck size={15} className="text-[#B45743] mt-0.5 shrink-0" />
                <p className="text-xs text-[#993C1D] leading-relaxed">
                  Admin baru akan mendapatkan role <span className="font-semibold">admin</span> secara otomatis dan dapat login segera.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2.5 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setOpenCreate(false)}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleCreateAdmin}
                className="flex-[2] flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl bg-[#B45743] hover:bg-[#a04d3b] active:scale-95 text-white transition-all shadow-sm"
              >
                <Plus size={14} />
                Tambah Admin
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}