
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import LaporanCard from "./laporanCard";

interface Laporan {
  id: number;
  judul_laporan: string;
  isi_laporan: string;
  lokasi: string;
  status: string;
  gambar: string[];
  user_name: string;
  created_at?: string;
}

export default function LaporanFeed() {
  const [laporan, setLaporan] = useState<
    Laporan[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // GET LAPORAN
  // =========================

  const fetchLaporan = async () => {
    try {
      const res = await api.get(
        "/laporan"
      );

      setLaporan(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
          padding: "40px",
        }}
      >
        <p>Loading laporan...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {laporan.map((item) => (
        <LaporanCard
          key={item.id}
          laporan={item}
        />
      ))}
    </div>
  );
}

