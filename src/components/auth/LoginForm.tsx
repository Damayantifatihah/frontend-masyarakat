"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ===================================
  // AUTO REDIRECT JIKA SUDAH LOGIN
  // ===================================
  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const user =
      localStorage.getItem("user");

    if (token && user) {
      const parsedUser =
        JSON.parse(user);

      if (
        parsedUser.role === "admin"
      ) {
        router.replace(
          "/admin/dashboard"
        );

        return;
      }

      if (
        parsedUser.role ===
        "superadmin"
      ) {
        router.replace(
          "/superadmin/dashboard"
        );

        return;
      }

      router.replace("/user");
    }
  }, [router]);

  // ===================================
  // HANDLE LOGIN
  // ===================================
  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log(res.data);

      // =========================
      // AMBIL DATA
      // =========================
      const token =
        res.data?.token;

      const user =
        res.data?.user;

      // =========================
      // VALIDASI
      // =========================
      if (!token || !user) {
        alert(
          "Data login tidak valid"
        );

        return;
      }

      // =========================
      // SIMPAN TOKEN
      // =========================
      localStorage.setItem(
        "token",
        token
      );

      // =========================
      // SIMPAN USER
      // =========================
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // =========================
      // SIMPAN COOKIE
      // =========================
      document.cookie = `token=${token}; path=/`;

      // =========================
      // REDIRECT ROLE
      // =========================
      if (
        user.role === "admin"
      ) {
        router.replace(
          "/admin/dashboard"
        );

        return;
      }

      if (
        user.role ===
        "superadmin"
      ) {
        router.replace(
          "/superadmin/dashboard"
        );

        return;
      }

      // default user
      router.replace("/user");
    } catch (error: any) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Login gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden font-[Poppins,sans-serif]">
      <div className="relative w-full h-screen flex">
        
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg.png"
            alt="Background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* LEFT */}
        <div className="relative z-10 w-1/2 hidden lg:flex flex-col justify-center pl-20">
          <div className="max-w-xs">
            
            <div className="mb-10">
              <Image
                src="/images/logo.png"
                alt="LaporinAja"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>

            <h2 className="text-[40px] font-extrabold text-[#E8734A] leading-tight mb-4">
              Suaramu penting
              <br />
              untuk kotamu.
            </h2>

            <p className="text-[#c45e33] text-[15px] leading-relaxed">
              Laporkan masalah di
              sekitarmu dan
              <br />
              pantau penanganannya
              secara transparan.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-[420px]">
            
            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-[36px] font-extrabold text-white mb-1 drop-shadow">
                Selamat Datang!
              </h1>

              <p className="text-white/75 text-[15px]">
                Masuk ke akun
                LaporinAja-mu
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleLogin
              }
              className="flex flex-col gap-5"
            >
              
              {/* EMAIL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[14px]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="contoh@email.com"
                  required
                  className="w-full h-[52px] rounded-xl px-4 text-[14px] text-gray-700 bg-white outline-none border-2 border-transparent focus:border-[#E8734A] shadow-md transition placeholder-gray-300"
                />
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[14px]">
                  Kata Sandi
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Masukkan kata sandi"
                    required
                    className="w-full h-[52px] rounded-xl px-4 pr-12 text-[14px] text-gray-700 bg-white outline-none border-2 border-transparent focus:border-[#E8734A] shadow-md transition placeholder-gray-300"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    👁
                  </button>
                </div>

                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-[12px] text-white/70 hover:text-white transition"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] rounded-xl bg-[#E8734A] hover:bg-[#d4603a] text-white font-bold text-[15px] shadow-lg transition-all duration-300 hover:scale-[1.02] mt-1 disabled:opacity-60"
              >
                {loading
                  ? "Loading..."
                  : "Masuk"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/30" />

              <span className="text-white/60 text-[12px] whitespace-nowrap">
                atau lanjutkan dengan
              </span>

              <div className="flex-1 h-px bg-white/30" />
            </div>

            {/* GOOGLE */}
            <button className="w-full h-[52px] bg-white rounded-xl flex items-center justify-center gap-3 shadow-md hover:scale-[1.02] transition-all duration-300">
              <span className="text-[14px] font-semibold text-gray-700">
                Masuk dengan Google
              </span>
            </button>

            {/* REGISTER */}
            <p className="text-center text-[13px] text-white/70 mt-7">
              Belum punya akun?{" "}
              
              <Link
                href="/auth/register"
                className="font-bold text-white hover:underline"
              >
                Daftar Gratis
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}