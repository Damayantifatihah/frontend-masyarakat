"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/axios";

import dynamic from "next/dynamic";

const MapPicker = dynamic(
  () => import("@/components/MapPicker"),
  {
    ssr: false,
  }
);

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const inputClass =
  "w-full h-11 rounded-xl border-[1.5px] border-gray-200 px-[14px] text-sm text-gray-900 outline-none font-[inherit] bg-white focus:border-[#B45743] transition-colors duration-150";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-bold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function FormLaporan() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalKejadian, setTanggalKejadian] = useState("");
  const [lokasi, setLokasi] = useState("");

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ─────────────────────────────────────────────
  // FETCH CATEGORIES
  // ─────────────────────────────────────────────

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const data = res.data.data || res.data;
        setCategories(data);
        if (data.length > 0) setSelectedCategoryId(data[0].id);
      } catch (error) {
        console.log(error);
        setErrorMsg("Gagal mengambil kategori");
      }
    };
    fetchCategories();
  }, []);

  // ─────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────

  const handleOpenFile = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    console.log("FILES DIPILIH:", newFiles);

    if (selectedFiles.length + newFiles.length > 3) {
      setErrorMsg("Maksimal upload 3 foto.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    for (const file of newFiles) {
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg("File harus JPG atau PNG.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Ukuran file maksimal 5MB.");
        return;
      }
    }

    setErrorMsg("");
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewImages((prev) => [
      ...prev,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      if (!judul.trim()) return setErrorMsg("Judul laporan wajib diisi.");
      if (!lokasi.trim()) return setErrorMsg("Alamat / lokasi wajib diisi.");
      if (!deskripsi.trim()) return setErrorMsg("Deskripsi laporan wajib diisi.");
      if (!tanggalKejadian) return setErrorMsg("Tanggal kejadian wajib diisi.");
      if (!selectedCategoryId) return setErrorMsg("Pilih kategori terlebih dahulu.");

      const formData = new FormData();
      formData.append("category_id", String(selectedCategoryId));
      formData.append("judul_laporan", judul);
      formData.append("isi_laporan", deskripsi);
      formData.append("tanggal_kejadian", tanggalKejadian);
      formData.append("lokasi", lokasi);
      selectedFiles.forEach((file) => formData.append("gambar", file));

      console.log("SELECTED FILES:", selectedFiles);

for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

const res = await api.post("/laporan", formData);
      console.log("SUCCESS:", res.data);

      setSuccessMsg("Laporan berhasil dikirim!");
      setJudul("");
      setLokasi("");
      setDeskripsi("");
      setTanggalKejadian("");
      setPreviewImages([]);
      setSelectedFiles([]);
      if (categories.length > 0) setSelectedCategoryId(categories[0].id);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Gagal mengirim laporan.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <div className="font-[Plus_Jakarta_Sans,sans-serif] w-full max-w-[720px]">
      <div className="bg-white rounded-[20px] border border-[#F0F0F0] overflow-hidden">

        {/* HEADER */}
        <div className="bg-[#B45743] px-7 py-[22px]">
          <p className="text-xs text-white/75 font-medium mb-1">Buat Laporan Baru</p>
          <h1 className="text-xl font-extrabold text-white">Sampaikan Laporan Anda</h1>
        </div>

        {/* BODY */}
        <div className="p-7 flex flex-col gap-[22px]">

          {/* ALERT SUCCESS */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
              </svg>
              {successMsg}
            </div>
          )}

          {/* ALERT ERROR */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* JUDUL */}
          <Field label="Judul Laporan">
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Jalan berlubang di depan pasar"
              className={inputClass}
            />
          </Field>

          {/* KATEGORI */}
          <Field label="Kategori">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`h-[34px] px-4 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-150 font-[inherit] border-[1.5px] ${
                    selectedCategoryId === cat.id
                      ? "border-[#B45743] bg-[#F9EAE7] text-[#8B3A2A]"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Field>

         {/* TANGGAL */}
<Field label="Tanggal Kejadian">
  <input
    type="date"
    value={tanggalKejadian}
    onChange={(e) =>
      setTanggalKejadian(e.target.value)
    }
    className={inputClass}
  />
</Field>

{/* LOKASI MAP */}
<Field label="Lokasi Kejadian">

  <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
    <MapPicker
      onSelectLocation={(alamat) => {
        setLokasi(alamat);
      }}
    />
  </div>
</Field>

          {/* DESKRIPSI */}
          <Field label="Deskripsi Lengkap">
            <textarea
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan kronologi dan detail lengkap kejadian yang ingin dilaporkan"
              className={`${inputClass} !h-auto py-[10px] resize-none leading-relaxed`}
            />
          </Field>

          {/* FOTO */}
          <Field label="Lampiran Foto">
            <p className="text-xs text-gray-400 -mt-1">
              Maksimal 3 foto · JPG atau PNG · Ukuran maks 5MB per foto
            </p>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="flex flex-wrap gap-3 mt-1">
              {previewImages.length < 3 && (
                <div
                  onClick={handleOpenFile}
                  className="w-[100px] h-[100px] rounded-[14px] border-2 border-dashed border-[#B45743] bg-[#F9EAE7] flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-[#F4DDD8] transition-colors duration-150"
                >
                  <span className="text-2xl text-[#B45743] leading-none">+</span>
                  <span className="text-xs text-[#8B3A2A] font-semibold">Tambah</span>
                </div>
              )}

              {previewImages.map((img, index) => (
                <div
                  key={index}
                  className="relative w-[100px] h-[100px] rounded-[14px] overflow-hidden border border-gray-200"
                >
                  <Image src={img} alt="preview" fill style={{ objectFit: "cover" }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-[5px] right-[5px] w-[22px] h-[22px] rounded-full bg-black/55 text-white text-sm border-none cursor-pointer flex items-center justify-center leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Field>

          {/* DIVIDER */}
          <div className="border-t border-gray-100" />

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`h-11 px-7 rounded-xl text-white text-sm font-extrabold border-none font-[inherit] flex items-center gap-2 transition-colors duration-150 ${
                loading ? "bg-[#C97A68] cursor-not-allowed" : "bg-[#B45743] cursor-pointer hover:bg-[#9E3D2C]"
              }`}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Kirim Laporan
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}