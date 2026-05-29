"use client";

import { useEffect, useRef, useState } from "react";

import {
  useSession,
} from "next-auth/react";
import api from "@/lib/axios";

export default function ProfilePage() {
  const {
  data: session,
  update,
} = useSession();

  const [isEditing, setIsEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    bio: "",
  });

  const [photo, setPhoto] = useState<
    string | null
  >(null);

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const videoRef =
    useRef<HTMLVideoElement | null>(
      null
    );

  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const streamRef =
    useRef<MediaStream | null>(null);

  // ==============================
  // LOAD USER
  // ==============================
useEffect(() => {
  if (session?.user) {
    const savedBio =
      localStorage.getItem(
        `bio_${session.user.email}`
      ) ||
      "Aktif melaporkan permasalahan lingkungan dan fasilitas umum.";

    setUser({
      ...session.user,
      bio: savedBio,
    });

    setForm({
      email:
        session.user.email || "",
      password: "",
      bio: savedBio,
    });

    const savedPhoto =
      localStorage.getItem(
        `profilePhoto_${session.user.email}`
      );

    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
  }
}, [session]);

  // ==============================
  // HANDLE INPUT
  // ==============================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ==============================
  // OPEN CAMERA
  // ==============================
  const openCamera = async () => {
    try {
      setCameraOpen(true);

      setTimeout(async () => {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode: "user",
                width: {
                  ideal: 1280,
                },
                height: {
                  ideal: 720,
                },
              },
              audio: false,
            }
          );

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;

          await videoRef.current.play();
        }
      }, 300);
    } catch (error) {
      console.log(error);

      alert(
        "Tidak dapat mengakses kamera"
      );
    }
  };

  // ==============================
  // STOP CAMERA
  // ==============================
  const stopCamera = () => {
    streamRef.current
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      );

    setCameraOpen(false);
  };

  // ==============================
  // CAPTURE PHOTO
  // ==============================
  const capturePhoto = () => {
    if (
      !videoRef.current ||
      !canvasRef.current
    )
      return;

    const video = videoRef.current;

    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height =
      video.videoHeight;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const imageData =
      canvas.toDataURL("image/png");

    setPhoto(imageData);

    const currentUser = session?.user;

    if (currentUser?.email) {
      localStorage.setItem(
        `profilePhoto_${currentUser.email}`,
        imageData
      );
    }

    // UPDATE SIDEBAR
    window.dispatchEvent(
      new Event("profileUpdated")
    );

    stopCamera();
  };

  // ==============================
  // REMOVE PHOTO
  // ==============================
  const removePhoto = () => {
    const currentUser = session?.user;

    if (!currentUser?.email)
      return;

    localStorage.removeItem(
      `profilePhoto_${currentUser.email}`
    );

    setPhoto(null);

    window.dispatchEvent(
      new Event("profileUpdated")
    );
  };

  // ==============================
  // CLEANUP CAMERA
  // ==============================
  useEffect(() => {
    return () => {
      streamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        );
    };
  }, []);

  // ==============================
  // INITIALS
  // ==============================
  const initials =
    user?.name
      ?.split(" ")
      .map(
        (word: string) => word[0]
      )
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  // ==============================
  // SAVE PROFILE
  // ==============================
const handleSave = async () => {
  try {
    setLoading(true);

    const res = await api.put(
      "/auth/profile",
      {
        email: form.email,
        password: form.password,
        bio: form.bio,
      }
    );

    const updatedUser = {
      ...user,
      ...res.data.user,
      bio: form.bio,
    };

    // =========================
    // SAVE BIO
    // =========================
    localStorage.setItem(
      `bio_${updatedUser.email}`,
      form.bio
    );

    // pindahin bio lama kalau email berubah
    if (
      user.email !== updatedUser.email
    ) {
      localStorage.removeItem(
        `bio_${user.email}`
      );
    }

    // =========================
    // SAVE PHOTO
    // =========================
    if (photo) {
      localStorage.setItem(
        `profilePhoto_${updatedUser.email}`,
        photo
      );

      if (
        user.email !==
        updatedUser.email
      ) {
        localStorage.removeItem(
          `profilePhoto_${user.email}`
        );
      }
    }

    // =========================
    // UPDATE STATE
    // =========================
    setUser(updatedUser);

    setForm({
      email: updatedUser.email,
      password: "",
      bio: form.bio,
    });

    // =========================
    // UPDATE SESSION
    // =========================
    await update({
      ...session,
      user: {
        ...session?.user,
        email: updatedUser.email,
      },
    });

    // =========================
    // TRIGGER SIDEBAR UPDATE
    // =========================
    window.dispatchEvent(
      new Event("profileUpdated")
    );

    setIsEditing(false);

    alert(
      "Profil berhasil diperbarui"
    );
  } catch (error: any) {
    console.log(error);

    alert(
      error?.response?.data
        ?.message ||
        "Gagal update profile"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-3xl p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Profil Saya
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Kelola informasi akun
          kamu
        </p>
      </div>

      {/* CARD */}
      <div
        className="
        overflow-hidden rounded-3xl
        border border-gray-100
        bg-white shadow-sm
      "
      >
        <div className="px-6 pb-6">
          {/* TOP */}
          <div
            className="
            mt-10 mb-6
            flex items-start justify-between
          "
          >
            <div className="flex items-center gap-4">
              {/* AVATAR */}
              <div className="relative">
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="
                      h-24 w-24 rounded-full
                      border-4 border-white
                      object-cover shadow-md
                    "
                  />
                ) : (
                  <div
                    className="
                    flex h-24 w-24
                    items-center justify-center
                    rounded-full border-4 border-white
                    bg-[#C95E24]
                    text-3xl font-bold text-white
                    shadow-md
                  "
                  >
                    {initials}
                  </div>
                )}

                {/* ACTION */}
                {isEditing && (
                  <>
                    {/* CAMERA */}
                    <button
                      onClick={
                        openCamera
                      }
                      className="
                        absolute -right-1 -bottom-1
                        flex h-9 w-9
                        items-center justify-center
                        rounded-full
                        bg-[#E8763A]
                        shadow-md transition
                        hover:bg-[#C95E24]
                      "
                    >
                      📷
                    </button>

                    {/* DELETE */}
                    {photo && (
                      <button
                        onClick={
                          removePhoto
                        }
                        className="
                          absolute -bottom-1 -left-1
                          flex h-9 w-9
                          items-center justify-center
                          rounded-full
                          bg-red-500
                          text-white shadow-md
                          transition hover:bg-red-600
                        "
                      >
                        🗑️
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* USER */}
              <div>
                <h2
                  className="
                  text-2xl font-bold
                  text-gray-800
                "
                >
                  {user?.name ||
                    "Loading..."}
                </h2>

                <p
                  className="
                  mt-2 max-w-sm
                  text-xs text-gray-400
                "
                >
                  Nama pengguna
                  mengikuti data NIK
                  dan tidak dapat
                  diubah.
                </p>
              </div>
            </div>

            {/* BUTTON EDIT */}
            <button
              onClick={() =>
                setIsEditing(
                  !isEditing
                )
              }
              className={`h-10 rounded-xl border px-5 text-sm font-semibold transition-all duration-200
              ${
                isEditing
                  ? "border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200"
                  : "border-[#E8763A] bg-[#FEF0E8] text-[#C95E24] hover:bg-[#FDDCCA]"
              }`}
            >
              {isEditing
                ? "Batal"
                : "Edit Profil"}
            </button>
          </div>

          <hr className="mb-6 border-gray-100" />

          {/* FORM */}
          <div className="flex flex-col gap-5">
            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label
                className="
                text-xs font-semibold
                tracking-wide text-gray-500 uppercase
              "
              >
                Email
              </label>

              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    h-11 rounded-xl
                    border border-gray-300
                    px-4 text-sm
                    text-gray-700 outline-none
                    transition
                    focus:border-[#E8763A]
                    focus:ring-4
                    focus:ring-[#E8763A]/10
                  "
                />
              ) : (
                <div
                  className="
                  flex h-11 items-center
                  rounded-xl border
                  border-gray-100 bg-gray-50
                  px-4 text-sm
                  font-medium text-gray-800
                "
                >
                  {form.email}
                </div>
              )}
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-2">
              <label
                className="
                text-xs font-semibold
                tracking-wide text-gray-500 uppercase
              "
              >
                Password
              </label>

              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Masukkan password baru"
                  className="
                    h-11 rounded-xl
                    border border-gray-300
                    px-4 text-sm
                    text-gray-700 outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-[#E8763A]
                    focus:ring-4
                    focus:ring-[#E8763A]/10
                  "
                />
              ) : (
                <div
                  className="
                  flex h-11 items-center
                  rounded-xl border
                  border-gray-100 bg-gray-50
                  px-4 text-sm
                  font-medium text-gray-400
                "
                >
                  ••••••••••
                </div>
              )}
            </div>

            {/* BIO */}
            <div className="flex flex-col gap-2">
              <label
                className="
                text-xs font-semibold
                tracking-wide text-gray-500 uppercase
              "
              >
                Bio Singkat
              </label>

              {isEditing ? (
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={
                    handleChange
                  }
                  rows={4}
                  placeholder="Tulis deskripsi singkat..."
                  className="
                    resize-none rounded-xl
                    border border-gray-300
                    px-4 py-3 text-sm
                    text-gray-700 outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-[#E8763A]
                    focus:ring-4
                    focus:ring-[#E8763A]/10
                  "
                />
              ) : (
                <div
                  className="
                  rounded-xl border
                  border-gray-100 bg-gray-50
                  px-4 py-3 text-sm
                  leading-relaxed text-gray-700
                "
                >
                  {form.bio}
                </div>
              )}
            </div>
          </div>

          {/* SAVE */}
          {isEditing && (
            <>
              <hr className="mt-6 mb-5 border-gray-100" />

              <div className="flex justify-end">
                <button
                  onClick={
                    handleSave
                  }
                  disabled={loading}
                  className="
                    h-11 rounded-xl
                    bg-[#E8763A]
                    px-6 text-sm
                    font-bold text-white
                    shadow-sm transition-all
                    duration-200
                    hover:bg-[#C95E24]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loading
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CAMERA MODAL */}
      {cameraOpen && (
        <div
          className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/80 p-4
        "
        >
          <div
            className="
            w-full max-w-md
            rounded-3xl bg-white p-4
          "
          >
            <h2
              className="
              mb-4 text-lg
              font-bold text-gray-800
            "
            >
              Ambil Foto Profil
            </h2>

            <div
              className="
              overflow-hidden rounded-2xl
              bg-black
            "
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="
                  h-[400px] w-full
                  rounded-2xl object-cover
                "
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={
                  stopCamera
                }
                className="
                  h-11 flex-1 rounded-xl
                  border border-gray-300
                  font-semibold text-gray-600
                  transition hover:bg-gray-100
                "
              >
                Batal
              </button>

              <button
                onClick={
                  capturePhoto
                }
                className="
                  h-11 flex-1 rounded-xl
                  bg-[#E8763A]
                  font-semibold text-white
                  transition hover:bg-[#C95E24]
                "
              >
                Ambil Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN CANVAS */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
}