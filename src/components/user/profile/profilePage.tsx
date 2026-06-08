"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { Camera, Trash2, Pencil, X, Save, Mail, Lock, FileText, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [user, setUser]           = useState<any>(null);
  const [photo, setPhoto]         = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const [form, setForm] = useState({ email: "", password: "", bio: "" });


  const fetchProfile = async () => {
  try {
    const res = await api.get("/auth/me");

    const userData = res.data.user;

    setUser(userData);

    setForm({
      email: userData.email || "",
      password: "",
      bio: userData.bio || "",
    });


    setPhoto(
  userData.profile_photo || null
);
  } catch (error) {
    console.log(error);
  }
};

    useEffect(() => {
  if (session) {
    fetchProfile();
  }
}, [session]);

  const videoRef  = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);



  const openCamera = async () => {
    try {
      setCameraOpen(true);
      setTimeout(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      }, 300);
    } catch {
      alert("Tidak dapat mengakses kamera");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
   const imageData =
  canvas.toDataURL("image/png");

setPhoto(imageData);
    window.dispatchEvent(new Event("profileUpdated"));
    stopCamera();
  };

  const removePhoto = () => {
    if (!session?.user?.email) return;
    setPhoto(null);
    window.dispatchEvent(new Event("profileUpdated"));
  };

  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await api.put("/auth/profile", {
        email: form.email,
        password: form.password,
        bio: form.bio,
        profile_photo: photo,
      });
      const updatedUser =
      res.data.user;
      setUser(updatedUser);
      setForm({
      email: updatedUser.email,
      password: "",
      bio: updatedUser.bio || "",
    });
      await update({ ...session, user: { ...session?.user, email: updatedUser.email } });
      window.dispatchEvent(new Event("profileUpdated"));
      setIsEditing(false);
      alert("Profil berhasil diperbarui");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal update profile");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "U";

  const inputClass =
    "w-full h-11 rounded-xl border-[1.5px] border-gray-200 px-4 text-sm text-gray-800 outline-none bg-white focus:border-[#B45743] focus:ring-2 focus:ring-[#B45743]/10 transition-colors";
  const readonlyClass =
    "w-full h-11 rounded-xl border-[1.5px] border-gray-100 bg-gray-50 px-4 text-sm font-medium text-gray-700 flex items-center";

  return (
    <div className="w-full h-full p-7 flex flex-col gap-6">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Profil Saya</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">Kelola informasi akun kamu</p>
      </div>

      {/* MAIN GRID: left card + right sidebar */}
      <div className="flex gap-5 items-start">

        {/* ── LEFT: Main Profile Card ── */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-[#B45743]" />

          <div className="p-6">

            {/* Avatar + Name Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {photo ? (
                    <img
                      src={photo} alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-[#F0D0C8]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#B45743] flex items-center justify-center text-white text-2xl font-bold shadow-md ring-2 ring-[#F0D0C8]">
                      {initials}
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <button
                        onClick={openCamera}
                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#B45743] hover:bg-[#8B3A2A] flex items-center justify-center shadow-md border-2 border-white transition-colors"
                      >
                        <Camera size={13} color="#fff" />
                      </button>
                      {photo && (
                        <button
                          onClick={removePhoto}
                          className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-md border-2 border-white transition-colors"
                        >
                          <Trash2 size={13} color="#fff" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">{user?.name || "Loading..."}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Nama mengikuti data NIK dan tidak dapat diubah.
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-violet-100 text-violet-700 ring-1 ring-violet-200">
                    <ShieldCheck size={11} />
                    {user?.role || "Warga"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 h-9 px-4 rounded-xl border-[1.5px] text-sm font-semibold transition-all shrink-0 ${
                  isEditing
                    ? "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                    : "border-[#B45743] bg-[#F9EAE7] text-[#B45743] hover:bg-[#F0D0C8]"
                }`}
              >
                {isEditing ? <><X size={14} /> Batal</> : <><Pencil size={14} /> Edit Profil</>}
              </button>
            </div>

            <div className="border-t border-gray-100 mb-6" />

            {/* Form Fields */}
            <div className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <Mail size={11} /> Email
                </label>

                <div className={readonlyClass}>
                  {form.email}
                </div>
              </div>
              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <Lock size={11} /> Password
                </label>
                {isEditing ? (
                  <input
                    type="password" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    className={`${inputClass} placeholder:text-gray-300`}
                  />
                ) : (
                  <div className={`${readonlyClass} tracking-widest text-gray-400`}>••••••••</div>
                )}
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <FileText size={11} /> Bio Singkat
                </label>
                {isEditing ? (
                  <textarea
                    value={form.bio} rows={3}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tulis deskripsi singkat tentang kamu..."
                    className="w-full rounded-xl border-[1.5px] border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none resize-none bg-white focus:border-[#B45743] focus:ring-2 focus:ring-[#B45743]/10 transition-colors leading-relaxed placeholder:text-gray-300"
                  />
                ) : (
                  <div className="w-full rounded-xl border-[1.5px] border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed">
                    {form.bio}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <>
                <div className="border-t border-gray-100 mt-6 mb-5" />
                <div className="flex justify-end">
                  <button
                    onClick={handleSave} disabled={loading}
                    className="flex items-center gap-2 h-10 px-6 rounded-xl bg-[#B45743] hover:bg-[#8B3A2A] text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Menyimpan...</>
                      : <><Save size={14} /> Simpan Perubahan</>
                    }
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Info Sidebar ── */}
        <div className="w-72 shrink-0 flex flex-col gap-4">

          {/* Account Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Info Akun</p>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Status</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 ring-1 ring-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Aktif
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Role</span>
                <span className="text-xs font-semibold text-gray-700 capitalize">{user?.role || "Warga"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Nama</span>
                <span className="text-xs font-semibold text-gray-700">{user?.name || "-"}</span>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-[#FAECE7] rounded-2xl border border-[#F0997B]/30 px-5 py-4 flex flex-col gap-2">
            <p className="text-xs font-bold text-[#B45743] uppercase tracking-widest">Tips Keamanan</p>
            <ul className="flex flex-col gap-2 mt-1">
              {[
                "Gunakan password yang kuat dan unik",
                "Jangan bagikan password ke siapapun",
                "Perbarui email secara berkala",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#993C1D] leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#B45743] shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Photo Tips */}
          {!photo && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Foto Profil</p>
              <p className="text-xs text-gray-400 leading-relaxed mt-1">
                Tambahkan foto profil agar akunmu lebih mudah dikenali. Klik <span className="font-semibold text-gray-600">Edit Profil</span> lalu ikon kamera.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* CAMERA MODAL */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#B45743] px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-white">Ambil Foto Profil</h2>
                <p className="text-xs text-white/70 mt-0.5">Posisikan wajah di tengah frame</p>
              </div>
              <button
                onClick={stopCamera}
                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X size={16} color="#fff" />
              </button>
            </div>
            <div className="bg-black">
              <video ref={videoRef} autoPlay playsInline muted
                className="w-full h-[320px] object-cover" />
            </div>
            <div className="flex gap-3 p-4">
              <button
                onClick={stopCamera}
                className="flex-1 h-10 rounded-xl border-[1.5px] border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={capturePhoto}
                className="flex-[2] h-10 rounded-xl bg-[#B45743] hover:bg-[#8B3A2A] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Camera size={15} /> Ambil Foto
              </button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}