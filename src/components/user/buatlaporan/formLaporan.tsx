"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/axios"; // sesuaikan path axios instance kamu

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FormLaporan() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalKejadian, setTanggalKejadian] = useState("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch categories dari API
  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) setSelectedCategoryId(res.data[0].id);
    });
  }, []);

  const handleOpenFile = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setSelectedFile(file);
    setPreviewImages([URL.createObjectURL(file)]);
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setPreviewImages([]);
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!judul.trim()) return setErrorMsg("Judul laporan wajib diisi.");
    if (!deskripsi.trim()) return setErrorMsg("Deskripsi laporan wajib diisi.");
    if (!tanggalKejadian) return setErrorMsg("Tanggal kejadian wajib diisi.");
    if (!selectedCategoryId) return setErrorMsg("Pilih kategori terlebih dahulu.");

    const formData = new FormData();
    formData.append("judul_laporan", judul);
    formData.append("isi_laporan", deskripsi);
    formData.append("tanggal_kejadian", tanggalKejadian);
    formData.append("category_id", String(selectedCategoryId));
    // lokasi opsional — tambahkan field jika diperlukan
    formData.append("lokasi", "");
    if (selectedFile) formData.append("gambar", selectedFile);

    try {
      setLoading(true);
      await api.post("/laporan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("Laporan berhasil dikirim!");
      setJudul("");
      setDeskripsi("");
      setTanggalKejadian("");
      setPreviewImages([]);
      setSelectedFile(null);
      if (categories.length > 0) setSelectedCategoryId(categories[0].id);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Gagal mengirim laporan. Coba lagi.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#E8763A] px-7 py-5">
        <p className="text-white/75 text-sm font-medium mb-1">Buat Laporan Baru</p>
        <h1 className="text-white text-xl font-bold">Sampaikan Laporan Anda</h1>
      </div>

      {/* Form Body */}
      <div className="px-7 py-6 flex flex-col gap-6">

        {/* Alert */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
            ✓ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            ✕ {errorMsg}
          </div>
        )}

        {/* Judul */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">Judul Laporan</label>
          <p className="text-xs text-gray-400 -mt-1">Tulis singkat dan jelas</p>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="cth: Jalan berlubang di Jl. Margonda"
            className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20 transition"
          />
        </div>

        <hr className="border-gray-100" />

        {/* Kategori */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">Kategori Masalah</label>
          <p className="text-xs text-gray-400 -mt-1">Pilih kategori yang paling sesuai</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`h-9 px-4 rounded-full border text-sm font-medium transition-all
                  ${selectedCategoryId === cat.id
                    ? "bg-[#FEF0E8] border-[#E8763A] text-[#C95E24]"
                    : "bg-white border-gray-300 text-gray-500 hover:border-[#E8763A] hover:text-[#C95E24] hover:bg-[#FEF0E8]"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Tanggal Kejadian */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">Tanggal Kejadian</label>
          <p className="text-xs text-gray-400 -mt-1">Kapan kejadian ini terjadi?</p>
          <input
            type="date"
            value={tanggalKejadian}
            onChange={(e) => setTanggalKejadian(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm text-gray-700 outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20 transition"
          />
        </div>

        <hr className="border-gray-100" />

        {/* Deskripsi */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">Deskripsi Laporan</label>
          <p className="text-xs text-gray-400 -mt-1">Ceritakan detail masalah yang kamu temukan</p>
          <textarea
            rows={5}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="cth: Terdapat lubang besar di tengah jalan yang membahayakan pengendara..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20 transition resize-none"
          />
        </div>

        <hr className="border-gray-100" />

        {/* Upload Foto — max 1 (backend: upload.single) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">Lampiran Foto</label>
          <p className="text-xs text-gray-400 -mt-1">
            Maks. 1 foto, format JPG/PNG ({previewImages.length}/1 foto dipilih)
          </p>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex flex-wrap gap-3 mt-2">
            {previewImages.length === 0 && (
              <div
                onClick={handleOpenFile}
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-[#E8763A] bg-[#FFF7F3] flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#FEF0E8] transition"
              >
                <span className="text-[#E8763A] text-2xl">+</span>
                <span className="text-[#C95E24] text-xs font-medium">Tambah Foto</span>
              </div>
            )}

            {previewImages.map((img, index) => (
              <div key={index} className="relative w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 group">
                <Image src={img} alt={`preview-${index}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-11 px-7 rounded-xl bg-[#E8763A] hover:bg-[#C95E24] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Mengirim...
              </>
            ) : (
              "Kirim Laporan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}