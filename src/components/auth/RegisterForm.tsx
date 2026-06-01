"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import SplashTransition from "@/components/splashTransition";

export default function RegisterPage() {
  const router = useRouter();

   const [showSplash, setShowSplash] =
    useState(false);


  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] =
    useState("");

  const [no_tlp, setNoTlp] =
    useState("");

  const [nik, setNik] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  // ======================================
  // HANDLE REGISTER
  // ======================================

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // VALIDASI NAMA
    if (name.trim().length < 3) {
      return alert(
        "Nama minimal 3 karakter"
      );
    }

    // VALIDASI EMAIL
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return alert(
        "Format email tidak valid"
      );
    }

    // VALIDASI NO TELP
    const phoneRegex =
      /^[0-9]{10,15}$/;

    if (!phoneRegex.test(no_tlp)) {
      return alert(
        "Nomor telepon harus 10-15 digit angka"
      );
    }

    // VALIDASI NIK
    const nikRegex = /^[0-9]{16}$/;

    if (!nikRegex.test(nik)) {
      return alert(
        "NIK harus 16 digit angka"
      );
    }

    // VALIDASI PASSWORD
    if (password.length < 6) {
      return alert(
        "Password minimal 6 karakter"
      );
    }

    // KONFIRMASI PASSWORD
    if (
      password !== confirmPassword
    ) {
      return alert(
        "Konfirmasi password tidak cocok"
      );
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          nik,
          no_tlp,
        }
      );

      alert(res.data.message);

      router.push("/auth/login");
    } catch (error: any) {
      alert(
        error.response?.data
          ?.message ||
          "Register gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen w-full bg-white overflow-hidden font-[Poppins,sans-serif]">
      <div className="relative w-full min-h-screen flex">
        {/* BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/regist.png"
            alt="Background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* LEFT CONTENT */}
        <div className="relative z-10 hidden lg:flex w-[45%] shrink-0 items-center">
          <div className="pl-14 max-w-[400px]">
            <div className="mb-8">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>

            <p className="text-[#A3A3A3] text-[18px] font-medium mb-3">
              Bergabunglah Sekarang
            </p>

            <h2 className="text-[#E8734A] text-[38px] font-extrabold leading-tight mb-5">
              Jadilah bagian
              <br />
              dari perubahan
            </h2>

            <p className="text-[#A3A3A3] text-[15px] leading-relaxed mb-10">
              Daftar gratis dan
              mulai laporkan masalah
              <br />
              di lingkunganmu hari
              ini.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-[600px]">
            <h1 className="text-white text-[36px] font-extrabold text-center mb-10 tracking-wide drop-shadow">
              DAFTAR
            </h1>

            <form
              onSubmit={
                handleRegister
              }
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"
            >
              {/* NAMA */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[13px]">
                  Nama Lengkap
                </label>

                <input
                  type="text"
                  placeholder="Nama lengkap kamu"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  className="w-full h-[50px] rounded-xl bg-white px-4 text-[14px] text-gray-900 outline-none"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[13px]">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full h-[50px] rounded-xl bg-white px-4 text-[14px] text-gray-900 outline-none"
                  required
                />
              </div>

              {/* NO TELP */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[13px]">
                  No. Telp Aktif
                </label>

                <input
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  value={no_tlp}
                  onChange={(e) =>
                    setNoTlp(
                      e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      )
                    )
                  }
                  className="w-full h-[50px] rounded-xl bg-white px-4 text-[14px] text-gray-900 outline-none"
                  required
                />
              </div>

              {/* NIK */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[13px]">
                  NIK
                </label>

                <input
                  type="text"
                  placeholder="Masukkan NIK"
                  value={nik}
                  maxLength={16}
                  onChange={(e) =>
                    setNik(
                      e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      )
                    )
                  }
                  className="w-full h-[50px] rounded-xl bg-white px-4 text-[14px] text-gray-900 outline-none"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[13px]">
                  Kata Sandi
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Min. 8 karakter"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="w-full h-[50px] rounded-xl bg-white px-4 pr-11 text-[14px] text-gray-900 outline-none"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[13px]">
                  Konfirmasi Kata
                  Sandi
                </label>

                <div className="relative">
                  <input
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    placeholder="Ulangi kata sandi"
                    value={
                      confirmPassword
                    }
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className="w-full h-[50px] rounded-xl bg-white px-4 pr-11 text-[14px] text-gray-900 outline-none"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(
                        !showConfirm
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <div className="md:col-span-2 flex flex-col items-center mt-5 gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] rounded-xl bg-[#E8734A] hover:bg-[#d4603a] text-white font-bold transition disabled:opacity-60"
                >
                  {loading
                    ? "Loading..."
                    : "Daftar"}
                </button>

                <Link
                  href="/"
                  className="w-full h-[52px] rounded-xl bg-white/20 hover:bg-white/30 border border-white/40 transition-all duration-300 text-white font-semibold text-[14px] flex items-center justify-center tracking-wide"
                >
                  Kembali ke
                  Halaman Depan
                </Link>

                <p className="text-white/70 text-[13px] mt-1">
                  Sudah punya akun?{" "}
               <button
                  type="button"
                  onClick={() => {
                    setShowSplash(true);

                    setTimeout(() => {
                      router.push("/auth/login");
                    }, 1200);
                  }}
                  className="text-white font-bold hover:underline"
                >
                  Masuk
                </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

     <AnimatePresence>
      {showSplash && (
        <SplashTransition />
      )}
    </AnimatePresence>
    </>
  );
}