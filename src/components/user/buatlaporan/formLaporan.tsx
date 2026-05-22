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
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        width: "100%",
        maxWidth: "720px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "1px solid #F0F0F0",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div style={{ backgroundColor: "#B45743", padding: "22px 28px" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 500, marginBottom: "4px" }}>
            Buat Laporan Baru
          </p>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#fff" }}>
            Sampaikan Laporan Anda
          </h1>
        </div>

        {/* BODY */}
        <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>

          {/* ALERT SUCCESS */}
          {successMsg && (
            <div
              style={{
                backgroundColor: "#F0FDF4",
                border: "1px solid #BBF7D0",
                color: "#15803D",
                fontSize: "14px",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
              </svg>
              {successMsg}
            </div>
          )}

          {/* ALERT ERROR */}
          {errorMsg && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
                fontSize: "14px",
                borderRadius: "12px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* JUDUL */}
          <Field label="Judul Laporan" icon="📋">
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Jalan berlubang di depan pasar"
              style={inputStyle}
            />
          </Field>

          {/* KATEGORI */}
          <Field label="Kategori" icon="🏷️">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  style={{
                    height: "34px",
                    padding: "0 16px",
                    borderRadius: "100px",
                    border: `1.5px solid ${selectedCategoryId === cat.id ? "#B45743" : "#E5E7EB"}`,
                    backgroundColor: selectedCategoryId === cat.id ? "#F9EAE7" : "#fff",
                    color: selectedCategoryId === cat.id ? "#8B3A2A" : "#6B7280",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Field>

          {/* LOKASI + TANGGAL — 2 kolom */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Lokasi Kejadian" icon="📍">
              <textarea
                rows={3}
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Masukkan alamat atau deskripsi lokasi kejadian"
                style={{ ...inputStyle, height: "auto", padding: "10px 14px", resize: "none", lineHeight: 1.6 }}
              />
            </Field>
            <Field label="Tanggal Kejadian" icon="📅">
              <input
                type="date"
                value={tanggalKejadian}
                onChange={(e) => setTanggalKejadian(e.target.value)}
                style={inputStyle}
              />
            </Field>
          </div>

          {/* DESKRIPSI */}
          <Field label="Deskripsi Lengkap" icon="📝">
            <textarea
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan kronologi dan detail lengkap kejadian yang ingin dilaporkan"
              style={{ ...inputStyle, height: "auto", padding: "10px 14px", resize: "none", lineHeight: 1.6 }}
            />
          </Field>

          {/* FOTO */}
          <Field label="Lampiran Foto" icon="🖼️">
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "-4px" }}>
              Maksimal 3 foto · JPG atau PNG · Ukuran maks 5MB per foto
            </p>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
              {previewImages.length < 3 && (
                <div
                  onClick={handleOpenFile}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "14px",
                    border: "2px dashed #B45743",
                    backgroundColor: "#F9EAE7",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontSize: "24px", color: "#B45743", lineHeight: 1 }}>+</span>
                  <span style={{ fontSize: "12px", color: "#8B3A2A", fontWeight: 600 }}>Tambah</span>
                </div>
              )}

              {previewImages.map((img, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    borderRadius: "14px",
                    overflow: "hidden",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Image src={img} alt="preview" fill style={{ objectFit: "cover" }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.55)",
                      color: "#fff",
                      fontSize: "14px",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </Field>

          {/* DIVIDER */}
          <div style={{ borderTop: "1px solid #F3F4F6" }} />

          {/* SUBMIT */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                height: "44px",
                padding: "0 28px",
                borderRadius: "12px",
                backgroundColor: loading ? "#C97A68" : "#B45743",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 800,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.15s",
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
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

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  borderRadius: "12px",
  border: "1.5px solid #E5E7EB",
  padding: "0 14px",
  fontSize: "14px",
  color: "#111827",
  outline: "none",
  fontFamily: "inherit",
  backgroundColor: "#fff",
};

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#374151",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span style={{ fontSize: "15px" }}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}