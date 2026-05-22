"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Search, MapPin, Clock, CheckCircle2, XCircle,
  Construction, Lightbulb, Recycle, TriangleAlert,
  Palette, FileX, MessageSquareMore, CalendarDays,
} from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const PRIMARY      = "#B45743";
const PRIMARY_DARK = "#8B3A2A";
const PRIMARY_BG   = "#F9EAE7";
const PRIMARY_BORDER = "#F0D0C8";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Laporan {
  id: number;
  user_id: number;
  judul_laporan: string;
  isi_laporan: string;
  lokasi: string;
  tanggal_kejadian: string;
  status: "verifikasi" | "proses" | "selesai" | "ditolak";
  gambar?: string[];
  category_name: string;
  tanggapan?: string;
}

type StatusKey = "Verifikasi" | "Diproses" | "Selesai" | "Ditolak";

// ─────────────────────────────────────────────
// CATEGORY CONFIG
// ─────────────────────────────────────────────

const catCfg: Record<string, {
  Icon: React.ElementType;
  barColor: string;
  iconBg: string;
  iconColor: string;
  tagBg: string;
  tagColor: string;
  tagBorder: string;
  leftBorder: string;
}> = {
  Infrastruktur: { Icon: Construction,     barColor: "#F97316", iconBg: "#FFF7ED", iconColor: "#EA580C", tagBg: "#FFF7ED", tagColor: "#C2410C", tagBorder: "#FED7AA", leftBorder: "#FED7AA" },
  Penerangan:    { Icon: Lightbulb,         barColor: "#EAB308", iconBg: "#FEFCE8", iconColor: "#CA8A04", tagBg: "#FEFCE8", tagColor: "#92400E", tagBorder: "#FEF08A", leftBorder: "#FEF08A" },
  Kebersihan:    { Icon: Recycle,           barColor: "#22C55E", iconBg: "#F0FDF4", iconColor: "#16A34A", tagBg: "#F0FDF4", tagColor: "#166534", tagBorder: "#BBF7D0", leftBorder: "#BBF7D0" },
  Kedaruratan:   { Icon: TriangleAlert,     barColor: "#EF4444", iconBg: "#FEF2F2", iconColor: "#DC2626", tagBg: "#FEF2F2", tagColor: "#991B1B", tagBorder: "#FECACA", leftBorder: "#FECACA" },
  Keindahan:     { Icon: Palette,           barColor: "#A855F7", iconBg: "#FAF5FF", iconColor: "#9333EA", tagBg: "#FAF5FF", tagColor: "#6B21A8", tagBorder: "#E9D5FF", leftBorder: "#E9D5FF" },
  Lingkungan:    { Icon: Recycle,           barColor: "#10B981", iconBg: "#ECFDF5", iconColor: "#059669", tagBg: "#ECFDF5", tagColor: "#065F46", tagBorder: "#A7F3D0", leftBorder: "#A7F3D0" },
  "Lalu Lintas": { Icon: Construction,     barColor: "#0EA5E9", iconBg: "#F0F9FF", iconColor: "#0284C7", tagBg: "#F0F9FF", tagColor: "#075985", tagBorder: "#BAE6FD", leftBorder: "#BAE6FD" },
  Pengaduan:     { Icon: MessageSquareMore, barColor: "#F59E0B", iconBg: "#FFFBEB", iconColor: "#D97706", tagBg: "#FFFBEB", tagColor: "#92400E", tagBorder: "#FDE68A", leftBorder: "#FDE68A" },
};

const defaultCat = {
  Icon: MessageSquareMore,
  barColor: "#9CA3AF", iconBg: "#F9FAFB", iconColor: "#6B7280",
  tagBg: "#F3F4F6", tagColor: "#374151", tagBorder: "#E5E7EB", leftBorder: "#E5E7EB",
};

// ─────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────

const stCfg: Record<StatusKey, {
  Icon: React.ElementType;
  barColor: string;
  iconColor: string;
  bg: string;
  color: string;
  border: string;
  numColor: string;
  iconBg: string;
  label: string;
}> = {
  Verifikasi: { Icon: Clock,         barColor: "#3B82F6", iconColor: "#3B82F6", bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", numColor: "#2563EB", iconBg: "#DBEAFE", label: "Menunggu Verifikasi" },
  Diproses:   { Icon: Clock,         barColor: "#F59E0B", iconColor: "#D97706", bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", numColor: "#D97706", iconBg: "#FEF3C7", label: "Sedang Diproses"     },
  Selesai:    { Icon: CheckCircle2,  barColor: "#22C55E", iconColor: "#16A34A", bg: "#F0FDF4", color: "#166534", border: "#BBF7D0", numColor: "#16A34A", iconBg: "#DCFCE7", label: "Selesai"             },
  Ditolak:    { Icon: XCircle,       barColor: "#EF4444", iconColor: "#DC2626", bg: "#FEF2F2", color: "#991B1B", border: "#FECACA", numColor: "#DC2626", iconBg: "#FEE2E2", label: "Ditolak"             },
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const formatTanggal = (raw: string) => {
  if (!raw) return "-";
  try {
    return new Date(raw).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch { return raw; }
};

const formatStatus = (status: string): StatusKey => {
  switch (status?.toLowerCase()) {
    case "proses":
    case "diproses": return "Diproses";
    case "selesai":  return "Selesai";
    case "ditolak":  return "Ditolak";
    default:         return "Verifikasi";
  }
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function LaporanSaya() {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("Semua");
  const [search, setSearch]   = useState("");

  const statuses = ["Semua", "Verifikasi", "Diproses", "Selesai", "Ditolak"];

  // ── Fetch ──
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) { setLaporan([]); return; }

        const res  = await api.get("/laporan/saya", { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data?.data || [];

        const formatted = data.map((item: any) => {
          let parsedGambar: string[] = [];
          if (Array.isArray(item.gambar)) {
            parsedGambar = item.gambar;
          } else if (typeof item.gambar === "string") {
            try { const p = JSON.parse(item.gambar); parsedGambar = Array.isArray(p) ? p : [item.gambar]; }
            catch { parsedGambar = item.gambar.trim() ? [item.gambar] : []; }
          }
          return { ...item, gambar: parsedGambar };
        });

        setLaporan(formatted);
      } catch (error) {
        console.error("ERROR FETCH LAPORAN:", error);
        setLaporan([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLaporan();
  }, []);

  const countOf = (s: string) => laporan.filter((r) => formatStatus(r.status) === s).length;

  const filtered = laporan.filter((r) => {
    const sf = formatStatus(r.status);
    const matchStatus = filter === "Semua" || sf === filter;
    const matchSearch = !search ||
      r.judul_laporan?.toLowerCase().includes(search.toLowerCase()) ||
      r.lokasi?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F8F8F8", fontFamily: "'Plus Jakarta Sans', sans-serif", padding: "32px 36px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Laporan Saya</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>
            Pantau semua status laporan yang telah Anda kirimkan
          </p>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {(["Verifikasi", "Diproses", "Selesai", "Ditolak"] as StatusKey[]).map((s) => {
            const c = stCfg[s];
            return (
              <div key={s} style={{
                background: "#fff", borderRadius: 14, padding: "16px 18px",
                border: "1px solid #F0F0F0", overflow: "hidden", position: "relative",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.barColor }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <c.Icon size={18} color={c.iconColor} />
                  </div>
                  <span style={{ fontSize: 26, fontWeight: 800, color: c.numColor, lineHeight: 1 }}>{countOf(s)}</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s}</p>
              </div>
            );
          })}
        </div>

        {/* ── SEARCH & FILTER ── */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0F0F0", padding: "16px", marginBottom: 24 }}>
          {/* Search input */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <Search size={16} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px 10px 40px", borderRadius: 10,
                border: "1.5px solid #E5E7EB", fontSize: 13, outline: "none",
                background: "#F9FAFB", color: "#111827", fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
            {statuses.map((s) => {
              const active = filter === s;
              return (
                <button key={s} onClick={() => setFilter(s)} style={{
                  padding: "7px 16px", borderRadius: 100,
                  border: `1.5px solid ${active ? PRIMARY : "#E5E7EB"}`,
                  background: active ? PRIMARY : "#fff",
                  color: active ? "#fff" : "#6B7280",
                  fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}>
                  {s}{s !== "Semua" ? ` (${countOf(s)})` : ""}
                </button>
              );
            })}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#9CA3AF", alignSelf: "center" }}>
              {filtered.length} laporan
            </span>
          </div>
        </div>

        {/* ── LIST ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
            <div style={{
              width: 32, height: 32, border: `3px solid ${PRIMARY_BG}`,
              borderTopColor: PRIMARY, borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
            }} />
            <p style={{ fontSize: 13, fontWeight: 500 }}>Memuat laporan...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 16, border: "1px solid #F0F0F0",
            padding: "60px 24px", textAlign: "center",
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <FileX size={28} color="#D1D5DB" />
            </div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#374151" }}>Tidak ada laporan ditemukan</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#9CA3AF" }}>Coba sesuaikan kata kunci atau filter status.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map((r) => {
              const sf = formatStatus(r.status);
              const cc = catCfg[r.category_name] ?? defaultCat;
              const sc = stCfg[sf];

              return (
                <div key={r.id} style={{
                  background: "#fff", borderRadius: 16,
                  border: "1px solid #F0F0F0",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  {/* Top accent bar */}
                  <div style={{ height: 4, background: cc.barColor }} />

                  <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Top row: category + status */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: cc.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <cc.Icon size={16} color={cc.iconColor} />
                        </div>
                        <span style={{
                          fontSize: 12, fontWeight: 700, padding: "4px 12px",
                          borderRadius: 100, background: cc.tagBg,
                          color: cc.tagColor, border: `1px solid ${cc.tagBorder}`,
                        }}>
                          {r.category_name}
                        </span>
                      </div>

                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "5px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700,
                        background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                      }}>
                        <sc.Icon size={13} color={sc.iconColor} />
                        {sc.label}
                      </span>
                    </div>

                    {/* Judul */}
                    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>
                      {r.judul_laporan}
                    </h2>

                    {/* Lokasi + Tanggal */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        { Icon: MapPin,       color: PRIMARY,    label: "Lokasi",           value: r.lokasi || "-" },
                        { Icon: CalendarDays, color: "#2563EB",  label: "Tanggal Kejadian", value: formatTanggal(r.tanggal_kejadian) },
                      ].map(({ Icon, color, label, value }) => (
                        <div key={label} style={{
                          background: "#F9FAFB", borderRadius: 12, padding: "12px 14px",
                          display: "flex", alignItems: "center", gap: 10,
                          border: "1px solid #F0F0F0",
                        }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #F0F0F0" }}>
                            <Icon size={16} color={color} />
                          </div>
                          <div style={{ overflow: "hidden" }}>
                            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Deskripsi */}
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Deskripsi Laporan
                      </p>
                      <div style={{
                        background: "#F9FAFB", borderRadius: 12, padding: "14px 16px",
                        borderLeft: `4px solid ${cc.leftBorder}`,
                        border: `1px solid #F0F0F0`,
                        borderLeftColor: cc.leftBorder,
                      }}>
                        <p style={{ margin: 0, fontSize: 13, color: "#4B5563", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                          {r.isi_laporan}
                        </p>
                      </div>
                    </div>

                    {/* Foto */}
                    {r.gambar && r.gambar.length > 0 && (
                      <div>
                        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Foto Lampiran ({r.gambar.length})
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                          {r.gambar.map((img, idx) => (
                            <div key={idx} style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", border: "1px solid #F0F0F0", background: "#F3F4F6" }}>
                              <img
                                src={img}
                                alt={`Foto ${idx + 1}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.png"; }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tanggapan admin */}
                    {r.tanggapan?.trim() && (
                      <div style={{
                        background: PRIMARY_BG, borderRadius: 12, padding: "14px 16px",
                        border: `1px solid ${PRIMARY_BORDER}`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#F0D0C8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <MessageSquareMore size={14} color={PRIMARY} />
                          </div>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: PRIMARY_DARK }}>
                            Tanggapan Resmi Admin
                          </p>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: "#4B5563", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                          {r.tanggapan}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}