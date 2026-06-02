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
  const [openCreate, setOpenCreate] =
  useState(false);

const [createForm, setCreateForm] =
  useState({
    name: "",
    email: "",
    password: "",
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


const handleCreateAdmin = async () => {
  try {
    const res = await api.post(
      "/superadmin/admins",
      createForm
    );

    console.log("SUCCESS:", res.data);

    setCreateForm({
      name: "",
      email: "",
      password: "",
    });

    setOpenCreate(false);

    fetchAdmins();

    alert("Admin berhasil ditambahkan");
  } catch (error: any) {
    console.log("ERROR:", error);
    console.log("DATA:", error.response?.data);
    console.log("STATUS:", error.response?.status);

    alert(
      error.response?.data?.message ||
      "Gagal menambahkan admin"
    );
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
        onClick={() =>
          setOpenCreate(true)
        }
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


  {/* MODAL CREATE */}
{openCreate && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="font-bold">Tambah Admin</h2>

        <button onClick={() => setOpenCreate(false)}>
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-4">

        <input
          type="text"
          placeholder="Nama Admin"
          value={createForm.name}
          onChange={(e) =>
            setCreateForm({
              ...createForm,
              name: e.target.value,
            })
          }
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={createForm.email}
          onChange={(e) =>
            setCreateForm({
              ...createForm,
              email: e.target.value,
            })
          }
          className="w-full border rounded-xl px-4 py-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={createForm.password}
          onChange={(e) =>
            setCreateForm({
              ...createForm,
              password: e.target.value,
            })
          }
          className="w-full border rounded-xl px-4 py-3"
        />

      </div>

      <div className="flex gap-3 p-6 border-t">

        <button
          onClick={() => setOpenCreate(false)}
          className="flex-1 border rounded-xl py-3"
        >
          Batal
        </button>

        <button
          onClick={handleCreateAdmin}
          className="flex-1 bg-[#B45743] text-white rounded-xl py-3"
        >
          Tambah Admin
        </button>

      </div>

    </div>
  </div>
)}
</div>
);
}

     