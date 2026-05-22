"use client"

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Kategori {
  id: number;
  name: string;
}

interface FormData {
  nama: string;
  prioritas: string;
  aktif: boolean;
}

interface ModalProps {
  onClose: () => void;
  editData: Kategori | null;
}

function Modal({ onClose, editData }: ModalProps) {
  const [form, setForm] = useState<FormData>(
    editData
      ? {
          nama: editData.name,
          prioritas: "AKTIF",
          aktif: true,
        }
      : {
          nama: "",
          prioritas: "AKTIF",
          aktif: true,
        }
  );

  const handleSubmit = async () => {
    try {
      if (!form.nama.trim()) {
        alert("Nama kategori wajib diisi");
        return;
      }

      if (editData) {
        await api.put(`/categories/${editData.id}`, {
          name: form.nama,
        });
      } else {
        await api.post("/categories", {
          name: form.nama,
        });
      }

      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Gagal menyimpan kategori");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
      animation: "fadeIn 0.15s ease",
    }}>
      <div style={{
        width: 460, maxWidth: "92vw", background: "#fff",
        borderRadius: 20, overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        animation: "slideUp 0.2s ease",
      }}>
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>
                {editData ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>
                {editData ? "Perbarui informasi kategori" : "Buat kategori laporan baru"}
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                background: "#F9FAFB",
                cursor: "pointer",
                fontSize: 16,
                color: "#6B7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Nama Kategori
              </label>

              <input
                value={form.nama}
                onChange={(e) =>
                  setForm({ ...form, nama: e.target.value })
                }
                placeholder="Contoh: Infrastruktur"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #E5E7EB",
                  fontSize: 14,
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#fff",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Status
              </label>

              <div style={{ display: "flex", gap: 8 }}>
                {(["AKTIF", "NON-AKTIF", "PRIORITAS TINGGI"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, prioritas: s })}
                    style={{
                      flex: 1,
                      padding: "9px 6px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      border:
                        form.prioritas === s
                          ? "1.5px solid #F97316"
                          : "1.5px solid #E5E7EB",
                      background:
                        form.prioritas === s
                          ? "#FFF7F0"
                          : "#F9FAFB",
                      color:
                        form.prioritas === s
                          ? "#F97316"
                          : "#9CA3AF",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 28px 28px", display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 10,
              border: "1.5px solid #E5E7EB",
              background: "#fff",
              fontSize: 14,
              fontWeight: 600,
              color: "#6B7280",
              cursor: "pointer",
            }}
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            style={{
              flex: 2,
              padding: "11px",
              borderRadius: 10,
              border: "none",
              background: "#F97316",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
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
  const [filter, setFilter] = useState("SEMUA");

  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState<number | null>(null);

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const res = await api.get("/categories");

      const data = res.data.data || res.data;

      setKategori(data);
    } catch (error) {
      console.log(error);
    }
  };

  const filtered = kategori.filter((k) => {
    const matchSearch = k.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchSearch;
  });

  const handleHapus = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);

      setKategori((prev) =>
        prev.filter((k) => k.id !== id)
      );

      setKonfirmasiHapus(null);
    } catch (error) {
      console.log(error);
      alert("Gagal menghapus kategori");
    }
  };

  const totalLaporan = kategori.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeIn  {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px)
          }
          to {
            opacity: 1;
            transform: translateY(0)
          }
        }

        @keyframes cardIn  {
          from {
            opacity: 0;
            transform: translateY(10px)
          }
          to {
            opacity: 1;
            transform: translateY(0)
          }
        }

        .k-card {
          animation: cardIn 0.3s ease both;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }

        .k-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.09) !important;
        }

        .btn-edit:hover  {
          background: #EFF6FF !important;
          color: #2563EB !important;
          border-color: #BFDBFE !important;
        }

        .btn-hapus:hover {
          background: #FEF2F2 !important;
          color: #DC2626 !important;
          border-color: #FECACA !important;
        }

        .btn-edit, .btn-hapus {
          transition: all 0.15s ease;
        }

        .add-card {
          transition: all 0.2s ease;
        }

        .add-card:hover {
          border-color: #F97316 !important;
          background: #FFFBF8 !important;
        }

        .tambah-btn {
          transition: opacity 0.15s ease;
        }

        .tambah-btn:hover {
          opacity: 0.88;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#F9FAFB",
        fontFamily: "'Inter', sans-serif",
        padding: "36px 40px",
        maxWidth: 1100,
        margin: "0 auto",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827", letterSpacing: "-0.3px" }}>
              Kelola Kategori
            </h1>

            <p style={{ margin: "5px 0 0", fontSize: 14, color: "#9CA3AF" }}>
              Manajemen kategori laporan masyarakat
            </p>
          </div>

          <button
            className="tambah-btn"
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "#F97316",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span>
            Tambah Kategori
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
          {[
            {
              label: "Total Kategori",
              value: String(kategori.length),
              sub: "Data kategori tersedia",
              icon: "📁",
              color: "#F97316",
              bg: "#FFF7F0"
            },
            {
              label: "Data Kategori",
              value: kategori.length,
              sub: "Kategori tersedia",
              icon: "🗂️",
              color: "#2563EB",
              bg: "#EFF6FF"
            },
            {
              label: "Total Laporan",
              value: totalLaporan.toLocaleString("id-ID"),
              sub: "Semua kategori",
              icon: "📋",
              color: "#16A34A",
              bg: "#F0FDF4"
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "18px 20px",
                border: "1px solid #F3F4F6",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}>
                {s.icon}
              </div>

              <div>
                <p style={{
                  margin: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em"
                }}>
                  {s.label}
                </p>

                <p style={{
                  margin: "2px 0 0",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.2
                }}>
                  {s.value}
                </p>

                <p style={{
                  margin: "2px 0 0",
                  fontSize: 12,
                  color: s.color,
                  fontWeight: 500
                }}>
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div style={{ position: "relative", maxWidth: 280 }}>
            <span style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14,
              color: "#9CA3AF",
              pointerEvents: "none",
            }}>
              🔍
            </span>

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kategori..."
              style={{
                padding: "9px 14px 9px 36px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 13.5,
                background: "#fff",
                color: "#111827",
                outline: "none",
                width: 260,
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{
            display: "flex",
            background: "#fff",
            border: "1.5px solid #E5E7EB",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            {["SEMUA", "AKTIF", "NON-AKTIF"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "8px 18px",
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: filter === f ? "#F97316" : "transparent",
                  color: filter === f ? "#fff" : "#6B7280",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <span style={{ marginLeft: "auto", fontSize: 13, color: "#9CA3AF" }}>
            {filtered.length} kategori
          </span>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {filtered.map((k, i) => {
            return (
              <div
                key={k.id}
                className="k-card"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1px solid #F3F4F6",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  animationDelay: `${i * 0.06}s`,
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "16px 18px 18px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 14
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#111827"
                    }}>
                      {k.name}
                    </h3>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditData(k);
                        setShowModal(true);
                      }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: 8,
                        border: "1.5px solid #E5E7EB",
                        background: "#F9FAFB",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="btn-hapus"
                      onClick={() => setKonfirmasiHapus(k.id)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: 8,
                        border: "1.5px solid #E5E7EB",
                        background: "#F9FAFB",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#374151",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                      }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Card */}
          <div
            className="add-card"
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
            style={{
              borderRadius: 16,
              border: "2px dashed #E5E7EB",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              cursor: "pointer",
              minHeight: 260,
              background: "#fff",
            }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#FFF7F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "#F97316",
              fontWeight: 700,
            }}>
              +
            </div>

            <div style={{ textAlign: "center" }}>
              <p style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "#374151"
              }}>
                Tambah Kategori
              </p>

              <p style={{
                margin: "3px 0 0",
                fontSize: 12,
                color: "#9CA3AF"
              }}>
                Klik untuk membuat baru
              </p>
            </div>
          </div>
        </div>

        {/* Delete Confirm */}
        {konfirmasiHapus !== null && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            animation: "fadeIn 0.15s ease",
          }}>
            <div style={{
              background: "#fff",
              borderRadius: 18,
              padding: "36px 32px",
              width: 360,
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              animation: "slideUp 0.2s ease",
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#FEF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                margin: "0 auto 16px",
              }}>
                🗑️
              </div>

              <h3 style={{
                margin: "0 0 8px",
                fontSize: 17,
                fontWeight: 700,
                color: "#111827"
              }}>
                Hapus Kategori?
              </h3>

              <p style={{
                margin: "0 0 24px",
                fontSize: 13.5,
                color: "#6B7280",
                lineHeight: 1.6
              }}>
                Tindakan ini tidak dapat dibatalkan.
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setKonfirmasiHapus(null)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    background: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#6B7280",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>

                <button
                  onClick={() => handleHapus(konfirmasiHapus)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    border: "none",
                    background: "#EF4444",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <Modal
            onClose={() => setShowModal(false)}
            editData={editData}
          />
        )}
      </div>
    </>
  );
}