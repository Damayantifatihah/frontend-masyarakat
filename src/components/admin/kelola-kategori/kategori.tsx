"use client"

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Kategori {
  id: number;
  name: string;
}

interface FormData {
  nama: string;
}

interface ModalProps {
  onClose: () => void;
  editData: Kategori | null;
}

const IconFolder = ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconLayers = ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconFileText = ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconSearch = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconEdit = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const IconX = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconPlus = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconTag = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const BRAND = "#B45743";
const BRAND_LIGHT = "#F7EDE9";
const BRAND_MID = "#D4806A";

function Modal({ onClose, editData }: ModalProps) {
  const [form, setForm] = useState<FormData>(
  editData
    ? { nama: editData.name }
    : { nama: "" }
);

  const handleSubmit = async () => {
    try {
      if (!form.nama.trim()) {
        alert("Nama kategori wajib diisi");
        return;
      }
      if (editData) {
        await api.put(`/categories/${editData.id}`, { name: form.nama });
      } else {
        await api.post("/categories", { name: form.nama });
      }
      window.location.reload();
    } catch {
      alert("Gagal menyimpan kategori");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(15,10,8,0.45)",
      animation: "fadeIn 0.18s ease",
    }}>
      <div style={{
        width: 460, maxWidth: "92vw", background: "#fff",
        borderRadius: 18, overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.14)",
        animation: "slideUp 0.22s ease",
      }}>
        {/* Modal header strip */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_MID})` }} />

        <div style={{ padding: "24px 26px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: BRAND_LIGHT,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <IconTag size={17} color={BRAND} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1208", letterSpacing: "-0.2px" }}>
                  {editData ? "Edit Kategori" : "Tambah Kategori"}
                </h2>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#9CA3AF" }}>
                  {editData ? "Perbarui informasi kategori" : "Buat kategori laporan baru"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 8,
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
                cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <IconX size={14} color="#6B7280" />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 6, letterSpacing: "0.01em" }}>
                Nama Kategori
              </label>
              <input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Contoh: Infrastruktur"
                style={{
                  width: "100%", padding: "10px 14px",
                  borderRadius: 10, border: "1.5px solid #E5E7EB",
                  fontSize: 14, color: "#111827", outline: "none",
                  boxSizing: "border-box", background: "#fff",
                  fontFamily: "inherit",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = BRAND)}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: "22px 26px 26px", display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px",
              borderRadius: 10, border: "1.5px solid #E5E7EB",
              background: "#fff", fontSize: 13.5, fontWeight: 600,
              color: "#6B7280", cursor: "pointer",
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 2, padding: "10px",
              borderRadius: 10, border: "none",
              background: BRAND, fontSize: 13.5, fontWeight: 700,
              color: "#fff", cursor: "pointer",
            }}
          >
            {editData ? "Simpan Perubahan" : "Buat Kategori"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KelolaKategori() {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Kategori | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState<number | null>(null);

  useEffect(() => { fetchKategori(); }, []);

  const fetchKategori = async () => {
    try {
      const res = await api.get("/categories");
      setKategori(res.data.data || res.data);
    } catch {
      // silent
    }
  };

  const filtered = kategori.filter((k) =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHapus = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      setKategori((prev) => prev.filter((k) => k.id !== id));
      setKonfirmasiHapus(null);
    } catch {
      alert("Gagal menghapus kategori");
    }
  };

 const stats = [
  {
    label: "Total Kategori",
    value: kategori.length,
    sub: "Kategori tersedia",
    Icon: IconFolder,
    accent: BRAND,
    bg: BRAND_LIGHT,
  },
  {
    label: "Kategori Terbaru",
    value: kategori[0]?.id || "-",
    sub: "Data terbaru",
    Icon: IconLayers,
    accent: "#2563EB",
    bg: "#EFF6FF",
  },
];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes cardIn  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }

        .k-card { animation: cardIn 0.28s ease both; transition: box-shadow 0.2s, transform 0.2s; }
        .k-card:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.08) !important; }

        .btn-action { transition: all 0.15s; }
        .btn-edit:hover  { background: #EFF6FF !important; color: #2563EB !important; border-color: #BFDBFE !important; }
        .btn-hapus:hover { background: #FEF2F2 !important; color: #DC2626 !important; border-color: #FECACA !important; }

        .add-card { transition: all 0.2s; }
        .add-card:hover { border-color: ${BRAND} !important; background: ${BRAND_LIGHT} !important; }

        .primary-btn { transition: opacity 0.15s, transform 0.1s; }
        .primary-btn:hover { opacity: 0.9; }
        .primary-btn:active { transform: scale(0.98); }

        .search-input:focus { border-color: ${BRAND} !important; box-shadow: 0 0 0 3px ${BRAND_LIGHT}; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#F5F4F2",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: "36px 40px",
        maxWidth: 1100,
        margin: "0 auto",
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 13,
              background: BRAND_LIGHT,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <IconFolder size={22} color={BRAND} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1A1208", letterSpacing: "-0.4px" }}>
                Kelola Kategori
              </h1>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#9CA3AF" }}>
                Manajemen kategori laporan masyarakat
              </p>
            </div>
          </div>

          <button
            className="primary-btn"
            onClick={() => { setEditData(null); setShowModal(true); }}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 18px",
              background: BRAND, border: "none", borderRadius: 10,
              color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
            }}
          >
            <IconPlus size={15} color="#fff" />
            Tambah Kategori
          </button>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 26 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14,
              padding: "16px 18px",
              border: "1px solid #EBEBEB",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 11,
                background: s.bg, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <s.Icon size={20} color={s.accent} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {s.label}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 700, color: "#1A1208", lineHeight: 1.1 }}>
                  {s.value}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: s.accent, fontWeight: 500 }}>
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: 11, top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none",
              display: "flex",
            }}>
              <IconSearch size={15} color="#9CA3AF" />
            </span>
            <input
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kategori..."
              style={{
                padding: "9px 14px 9px 34px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 13, background: "#fff",
                color: "#111827", outline: "none",
                width: 240, fontFamily: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
          </div>

          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "#9CA3AF", fontWeight: 500 }}>
            {filtered.length} kategori ditemukan
          </span>
        </div>

        {/* ── Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {filtered.map((k, i) => (
            <div
              key={k.id}
              className="k-card"
              style={{
                background: "#fff", borderRadius: 14,
                border: "1px solid #EBEBEB",
                animationDelay: `${i * 0.05}s`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: 170,
              }}
            >
              {/* top accent bar */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${BRAND} 0%, ${BRAND_MID} 100%)` }} />

              <div style={{ padding: "20px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: BRAND_LIGHT,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <IconTag size={17} color={BRAND} />
                  </div>
                  <h3 style={{
                    margin: 0, fontSize: 15, fontWeight: 700,
                    color: "#1A1208", lineHeight: 1.3,
                  }}>
                    {k.name}
                  </h3>
                </div>

                <div style={{ height: "1px", background: "#F3F4F6", marginBottom: 16 }} />

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-action btn-edit"
                    onClick={() => { setEditData(k); setShowModal(true); }}
                    style={{
                      flex: 1, padding: "9px 0",
                      borderRadius: 8,
                      border: "1.5px solid #E5E7EB",
                      background: "#F9FAFB",
                      fontSize: 13, fontWeight: 600, color: "#374151",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      fontFamily: "inherit",
                    }}
                  >
                    <IconEdit size={14} />
                    Edit
                  </button>
                  <button
                    className="btn-action btn-hapus"
                    onClick={() => setKonfirmasiHapus(k.id)}
                    style={{
                      flex: 1, padding: "9px 0",
                      borderRadius: 8,
                      border: "1.5px solid #E5E7EB",
                      background: "#F9FAFB",
                      fontSize: 13, fontWeight: 600, color: "#374151",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      fontFamily: "inherit",
                    }}
                  >
                    <IconTrash size={14} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Card */}
          <div
            className="add-card"
            onClick={() => { setEditData(null); setShowModal(true); }}
            style={{
              borderRadius: 14,
              border: `2px dashed #DCDCDC`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 10, cursor: "pointer",
              minHeight: 170, background: "#fff",
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: BRAND_LIGHT,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <IconPlus size={18} color={BRAND} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#374151" }}>Tambah Kategori</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9CA3AF" }}>Klik untuk membuat baru</p>
            </div>
          </div>
        </div>

        {/* ── Delete Confirm ── */}
        {konfirmasiHapus !== null && (
          <div style={{
            position: "fixed", inset: 0,
            background: "rgba(15,10,8,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100, animation: "fadeIn 0.15s ease",
          }}>
            <div style={{
              background: "#fff", borderRadius: 18,
              padding: "32px 28px", width: 340, textAlign: "center",
              boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
              animation: "slideUp 0.2s ease",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "#FEF2F2",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <IconTrash size={22} color="#DC2626" />
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#1A1208" }}>
                Hapus Kategori?
              </h3>
              <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
                Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setKonfirmasiHapus(null)}
                  style={{
                    flex: 1, padding: "10px",
                    borderRadius: 10, border: "1.5px solid #E5E7EB",
                    background: "#fff", fontSize: 13.5, fontWeight: 600,
                    color: "#6B7280", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={() => handleHapus(konfirmasiHapus)}
                  style={{
                    flex: 1, padding: "10px",
                    borderRadius: 10, border: "none",
                    background: "#EF4444", fontSize: 13.5, fontWeight: 700,
                    color: "#fff", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <Modal onClose={() => setShowModal(false)} editData={editData} />
        )}
      </div>
    </>
  );
}