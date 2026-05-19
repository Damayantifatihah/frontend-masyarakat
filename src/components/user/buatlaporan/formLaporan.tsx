"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// SVG Icons
const IconPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconLocate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Z" strokeOpacity="0.3"/>
  </svg>
);

const categories = [
  "Infrastruktur",
  "Lalu Lintas",
  "Lingkungan",
];

export default function FormLaporan() {
  const [selectedCategory, setSelectedCategory] =
    useState("Infrastruktur");

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [alamat, setAlamat] = useState("");
  const [koordinat, setKoordinat] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLokasi, setLoadingLokasi] = useState(false);
  const [errorLokasi, setErrorLokasi] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Deteksi lokasi otomatis via GPS
  const handleDeteksiLokasi = () => {
    if (!navigator.geolocation) {
      setErrorLokasi("Browser tidak mendukung geolokasi.");
      return;
    }
    setLoadingLokasi(true);
    setErrorLokasi("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setKoordinat({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          setAlamat(data.display_name ?? `${latitude}, ${longitude}`);
        } catch {
          setAlamat(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
        setLoadingLokasi(false);
      },
      () => {
        setErrorLokasi("Gagal mendapatkan lokasi. Pastikan izin lokasi sudah diberikan.");
        setLoadingLokasi(false);
      }
    );
  };

  // Saat box tambah foto diklik
  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  // Saat user pilih foto — append ke existing, max 3
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = 3 - previewImages.length;
    if (remaining <= 0) return;

    const newImageUrls = Array.from(files)
      .slice(0, remaining)
      .map((file) => URL.createObjectURL(file));

    setPreviewImages((prev) => [...prev, ...newImageUrls]);

    // Reset input supaya foto yang sama bisa dipilih lagi kalau perlu
    e.target.value = "";
  };

  // Hapus foto dari preview
  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isMaxReached = previewImages.length >= 3;

  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#E8763A] px-7 py-5">
        <p className="text-white/75 text-sm font-medium mb-1">
          Buat Laporan Baru
        </p>
        <h1 className="text-white text-xl font-bold">
          Sampaikan Laporan Anda
        </h1>
      </div>

      {/* Form Body */}
      <div className="px-7 py-6 flex flex-col gap-6">
        {/* Judul */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Judul Laporan
          </label>
          <p className="text-xs text-gray-400 -mt-1">
            Tulis singkat dan jelas
          </p>

          <input
            type="text"
            placeholder="cth: Jalan berlubang di Jl. Margonda"
            className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20 transition"
          />
        </div>

        <hr className="border-gray-100" />

        {/* Kategori */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Kategori Masalah
          </label>

          <p className="text-xs text-gray-400 -mt-1">
            Pilih kategori yang paling sesuai
          </p>

          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedCategory(item)}
                className={`h-9 px-4 rounded-full border text-sm font-medium transition-all
                  ${
                    selectedCategory === item
                      ? "bg-[#FEF0E8] border-[#E8763A] text-[#C95E24]"
                      : "bg-white border-gray-300 text-gray-500 hover:border-[#E8763A] hover:text-[#C95E24] hover:bg-[#FEF0E8]"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Deskripsi */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Deskripsi Laporan
          </label>

          <p className="text-xs text-gray-400 -mt-1">
            Ceritakan detail masalah yang kamu temukan
          </p>

          {/* FIX: tambah text-gray-700 supaya tulisan keliatan */}
          <textarea
            rows={5}
            placeholder="cth: Terdapat lubang besar di tengah jalan yang membahayakan pengendara, sudah berlangsung selama 2 minggu..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20 transition resize-none"
          />
        </div>

        <hr className="border-gray-100" />

        {/* Lokasi */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Lokasi Kejadian
          </label>
          <p className="text-xs text-gray-400 -mt-1">
            Masukkan alamat atau gunakan lokasi saat ini
          </p>

          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconPin />
              </span>
              <input
                type="text"
                value={alamat}
                onChange={(e) => {
                  setAlamat(e.target.value);
                  setKoordinat(null);
                }}
                placeholder="cth: Jl. Margonda Raya No. 12, Depok"
                className="w-full h-12 rounded-xl border border-gray-300 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#E8763A] focus:ring-2 focus:ring-[#E8763A]/20 transition"
              />
            </div>
            <button
              type="button"
              onClick={handleDeteksiLokasi}
              disabled={loadingLokasi}
              className="h-12 px-4 rounded-xl border border-[#E8763A] text-[#C95E24] bg-[#FFF7F3] hover:bg-[#FEF0E8] text-xs font-semibold flex items-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <IconLocate />
              {loadingLokasi ? "Mendeteksi..." : "Lokasi Saya"}
            </button>
          </div>

          {/* Error */}
          {errorLokasi && (
            <p className="text-xs text-red-500 mt-1">{errorLokasi}</p>
          )}

          {/* Koordinat badge */}
          {koordinat && (
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                </svg>
                {koordinat.lat.toFixed(5)}, {koordinat.lng.toFixed(5)}
              </span>
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Upload Foto */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-800">
            Lampiran Foto
          </label>

          <p className="text-xs text-gray-400 -mt-1">
            Maks. 3 foto, format JPG/PNG ({previewImages.length}/3 foto dipilih)
          </p>

          {/* Input File Hidden */}
          {/* FIX: multiple tetap ada, limit ditangani di handler */}
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex flex-wrap gap-3 mt-2">
            {/* Tombol Tambah Foto — sembunyikan kalau sudah 3 foto */}
            {!isMaxReached && (
              <div
                onClick={handleOpenFile}
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-[#E8763A] bg-[#FFF7F3] flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#FEF0E8] transition"
              >
                <span className="text-[#E8763A] text-2xl">+</span>
                <span className="text-[#C95E24] text-xs font-medium">
                  Tambah Foto
                </span>
              </div>
            )}

            {/* Preview Foto dengan tombol hapus */}
            {previewImages.map((img, index) => (
              <div
                key={index}
                className="relative w-28 h-28 rounded-2xl overflow-hidden border border-gray-200 group"
              >
                <Image
                  src={img}
                  alt={`preview-${index}`}
                  fill
                  className="object-cover"
                />
                {/* Tombol hapus */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
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
          <button className="h-11 px-7 rounded-xl bg-[#E8763A] hover:bg-[#C95E24] text-white text-sm font-bold transition flex items-center gap-2">
            Kirim Laporan
          </button>
        </div>
      </div>
    </div>
  );
}