"use client";

import { useEffect, useRef, useState } from "react";

const user = {
  name: "Ahmad Fauzi",
  email: "ahmadfauzi@gmail.com",
  bio: "Aktif melaporkan permasalahan lingkungan dan fasilitas umum.",
  joinDate: "Januari 2024",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    email: user.email,
    password: "",
    bio: user.bio,
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open Camera
  const openCamera = async () => {
    try {
      setCameraOpen(true);

      setTimeout(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = async () => {
            await videoRef.current?.play();
          };
        }
      }, 300);
    } catch (error) {
      console.error(error);
      alert("Tidak dapat mengakses kamera");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraOpen(false);
  };

  // Capture Photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    setPhoto(imageData);

    stopCamera();
  };

  // Cleanup Camera
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Profil Saya
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Kelola informasi akun kamu
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-start justify-between mt-10 mb-6">
            <div className="flex items-center gap-4">
              {/* Profile Photo */}
              <div className="relative">
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#C95E24] border-4 border-white flex items-center justify-center text-white text-3xl font-bold shadow-md">
                    AF
                  </div>
                )}

                {/* Camera Button */}
                {isEditing && (
                  <button
                    onClick={openCamera}
                    className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#E8763A] hover:bg-[#C95E24] flex items-center justify-center shadow-md transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7h4l2-2h6l2 2h4v12H3V7z"
                      />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="pt-10">
                <h2 className="text-xl font-bold text-gray-800">
                  {user.name}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Bergabung sejak {user.joinDate}
                </p>

                <p className="text-xs text-gray-400 mt-2 max-w-sm">
                  Nama pengguna mengikuti data NIK dan tidak dapat diubah.
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`h-10 px-5 rounded-xl text-sm font-semibold border transition-all duration-200
              ${
                isEditing
                  ? "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"
                  : "bg-[#FEF0E8] border-[#E8763A] text-[#C95E24] hover:bg-[#FDDCCA]"
              }`}
            >
              {isEditing ? "Batal" : "Edit Profil"}
            </button>
          </div>

          {/* Divider */}
          <hr className="border-gray-100 mb-6" />

          {/* Form */}
          <div className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Email
              </label>

              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  // FIX: tambah text-gray-700 supaya tulisan keliatan
                  className="h-11 rounded-xl border border-gray-300 px-4 text-sm text-gray-700 outline-none focus:border-[#E8763A] focus:ring-4 focus:ring-[#E8763A]/10 transition"
                />
              ) : (
                <div className="h-11 rounded-xl bg-gray-50 border border-gray-100 px-4 flex items-center text-sm text-gray-800 font-medium">
                  {form.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password
              </label>

              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password baru"
                  // FIX: tambah text-gray-700 supaya tulisan keliatan
                  className="h-11 rounded-xl border border-gray-300 px-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#E8763A] focus:ring-4 focus:ring-[#E8763A]/10 transition"
                />
              ) : (
                <div className="h-11 rounded-xl bg-gray-50 border border-gray-100 px-4 flex items-center text-sm text-gray-400 font-medium">
                  ••••••••••
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Bio Singkat
              </label>

              {isEditing ? (
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tulis deskripsi singkat..."
                  // FIX: tambah text-gray-700 supaya tulisan keliatan
                  className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none resize-none focus:border-[#E8763A] focus:ring-4 focus:ring-[#E8763A]/10 transition"
                />
              ) : (
                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-700 leading-relaxed">
                  {form.bio}
                </div>
              )}
            </div>
          </div>

          {/* Save */}
          {isEditing && (
            <>
              <hr className="border-gray-100 mt-6 mb-5" />

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    // Simpan hanya bio — nama tidak disimpan supaya tidak override data auth
                    localStorage.setItem(
                      "userProfile",
                      JSON.stringify({ bio: form.bio })
                    );

                    window.dispatchEvent(new Event("storage"));

                    setIsEditing(false);
                  }}
                  className="h-11 px-6 rounded-xl bg-[#E8763A] hover:bg-[#C95E24] text-white text-sm font-bold shadow-sm transition-all duration-200"
                >
                  Simpan Perubahan
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-5 bg-white rounded-3xl border border-red-100 shadow-sm px-6 py-5">
        <p className="text-sm font-semibold text-gray-800 mb-1">
          Hapus Akun
        </p>

        <p className="text-xs text-gray-400 mb-4">
          Akun yang dihapus tidak dapat dipulihkan kembali.
        </p>

        <button className="h-10 px-4 rounded-xl border border-red-200 bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100 transition">
          Hapus Akun Saya
        </button>
      </div>

      {/* Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-4 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Ambil Foto Profil
            </h2>

            <div className="overflow-hidden rounded-2xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-[400px] object-cover rounded-2xl"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={stopCamera}
                className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition"
              >
                Batal
              </button>

              <button
                onClick={capturePhoto}
                className="flex-1 h-11 rounded-xl bg-[#E8763A] hover:bg-[#C95E24] text-white font-semibold transition"
              >
                Ambil Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}