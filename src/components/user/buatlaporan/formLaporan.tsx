"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/axios";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function FormLaporan() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

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

        if (data.length > 0) {
          setSelectedCategoryId(data[0].id);
        }
      } catch (error) {
        console.log(error);
        setErrorMsg("Gagal mengambil kategori");
      }
    };

    fetchCategories();
  }, []);

  // ─────────────────────────────────────────────
  // OPEN FILE
  // ─────────────────────────────────────────────

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  // ─────────────────────────────────────────────
  // HANDLE IMAGE
  // ─────────────────────────────────────────────

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    // VALIDASI MAX FOTO
    if (selectedFiles.length + newFiles.length > 3) {
      setErrorMsg("Maksimal upload 3 foto.");
      return;
    }

    // VALIDASI TYPE
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    for (const file of newFiles) {
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg("File harus JPG atau PNG.");
        return;
      }

      // VALIDASI SIZE
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Ukuran file maksimal 5MB.");
        return;
      }
    }

    setErrorMsg("");

    // SAVE FILES
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // PREVIEW
    const previews = newFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages((prev) => [...prev, ...previews]);

    // RESET INPUT
    e.target.value = "";
  };

  // ─────────────────────────────────────────────
  // REMOVE IMAGE
  // ─────────────────────────────────────────────

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setSelectedFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────

  const handleSubmit = async () => {
    try {
      setLoading(true);

      setErrorMsg("");
      setSuccessMsg("");

      // VALIDASI
      if (!judul.trim()) {
        setLoading(false);
        return setErrorMsg("Judul laporan wajib diisi.");
      }

      if (!lokasi.trim()) {
        setLoading(false);
        return setErrorMsg("Alamat / lokasi wajib diisi.");
      }

      if (!deskripsi.trim()) {
        setLoading(false);
        return setErrorMsg("Deskripsi laporan wajib diisi.");
      }

      if (!tanggalKejadian) {
        setLoading(false);
        return setErrorMsg("Tanggal kejadian wajib diisi.");
      }

      if (!selectedCategoryId) {
        setLoading(false);
        return setErrorMsg("Pilih kategori terlebih dahulu.");
      }

      // FORM DATA
      const formData = new FormData();

      formData.append(
        "category_id",
        String(selectedCategoryId)
      );

      formData.append(
        "judul_laporan",
        judul
      );

      formData.append(
        "isi_laporan",
        deskripsi
      );

      formData.append(
        "tanggal_kejadian",
        tanggalKejadian
      );

      formData.append(
        "lokasi",
        lokasi
      );

      // APPEND FILES
      selectedFiles.forEach((file) => {
        formData.append("gambar", file);
      });

      // DEBUG
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // REQUEST
      const res = await api.post(
        "/laporan",
        formData
      );

      console.log("SUCCESS:", res.data);

      // SUCCESS
      setSuccessMsg(
        "Laporan berhasil dikirim!"
      );

      // RESET
      setJudul("");
      setLokasi("");
      setDeskripsi("");
      setTanggalKejadian("");

      setPreviewImages([]);
      setSelectedFiles([]);

      if (categories.length > 0) {
        setSelectedCategoryId(
          categories[0].id
        );
      }

    } catch (err: any) {

      console.log("ERROR FULL:", err);

      console.log(
        "ERROR RESPONSE:",
        err?.response
      );

      console.log(
        "ERROR DATA:",
        err?.response?.data
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal mengirim laporan.";

      setErrorMsg(message);

    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="bg-[#E8763A] px-7 py-5">
        <p className="text-white/75 text-sm font-medium mb-1">
          Buat Laporan Baru
        </p>

        <h1 className="text-white text-xl font-bold">
          Sampaikan Laporan Anda
        </h1>
      </div>

      {/* BODY */}
      <div className="px-7 py-6 flex flex-col gap-6">

        {/* ALERT SUCCESS */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
            ✓ {successMsg}
          </div>
        )}

        {/* ALERT ERROR */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            ✕ {errorMsg}
          </div>
        )}

        {/* JUDUL */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Judul Laporan
          </label>

          <input
            type="text"
            value={judul}
            onChange={(e) =>
              setJudul(e.target.value)
            }
            placeholder="Contoh: Jalan berlubang"
            className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20"
          />
        </div>

        {/* KATEGORI */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Kategori
          </label>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setSelectedCategoryId(cat.id)
                }
                className={`h-9 px-4 rounded-full border text-sm font-medium transition ${
                  selectedCategoryId === cat.id
                    ? "bg-[#FEF0E8] border-[#E8763A] text-[#C95E24]"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* LOKASI */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Lokasi
          </label>

          <textarea
            rows={3}
            value={lokasi}
            onChange={(e) =>
              setLokasi(e.target.value)
            }
            placeholder="Masukkan lokasi kejadian"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none resize-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20"
          />
        </div>

        {/* TANGGAL */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Tanggal Kejadian
          </label>

          <input
            type="date"
            value={tanggalKejadian}
            onChange={(e) =>
              setTanggalKejadian(
                e.target.value
              )
            }
            className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20"
          />
        </div>

        {/* DESKRIPSI */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Deskripsi
          </label>

          <textarea
            rows={5}
            value={deskripsi}
            onChange={(e) =>
              setDeskripsi(e.target.value)
            }
            placeholder="Jelaskan detail laporan"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none resize-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20"
          />
        </div>

        {/* FOTO */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Lampiran Foto
          </label>

          <p className="text-xs text-gray-400">
            Maksimal 3 foto
          </p>

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            multiple
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex flex-wrap gap-3 mt-2">

            {/* BUTTON TAMBAH */}
            {previewImages.length < 3 && (
              <div
                onClick={handleOpenFile}
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-[#E8763A] bg-[#FFF7F3] flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-2xl text-[#E8763A]">
                  +
                </span>

                <span className="text-xs text-[#C95E24]">
                  Tambah
                </span>
              </div>
            )}

            {/* PREVIEW */}
            {previewImages.map((img, index) => (
              <div
                key={index}
                className="relative w-28 h-28 rounded-2xl overflow-hidden border"
              >
                <Image
                  src={img}
                  alt="preview"
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(index)
                  }
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="h-11 px-7 rounded-xl bg-[#E8763A] hover:bg-[#C95E24] text-white text-sm font-bold disabled:opacity-60"
          >
            {loading
              ? "Mengirim..."
              : "Kirim Laporan"}
          </button>
        </div>

      </div>
    </div>
  );
}