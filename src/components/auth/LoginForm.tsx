"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      console.log(res.data);

      // simpan token
      localStorage.setItem("token", res.data.token);

      // simpan data user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // pindah ke homepage user
      router.push("/user");
    } catch (error: any) {
      console.log(error);

      alert(error.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden font-[Poppins,sans-serif]">
      <div className="relative w-full h-screen flex">

        {/* ── Background ── */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg.png"
            alt="Background"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* ── LEFT — Logo & Tagline ── */}
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
              Laporkan masalah di sekitarmu dan
              <br />
              pantau penanganannya secara transparan.
            </p>
          </div>
        </div>

        {/* ── RIGHT — Form ── */}
        <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-[420px]">

            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="text-[36px] font-extrabold text-white mb-1 drop-shadow">
                Selamat Datang!
              </h1>
              <p className="text-white/75 text-[15px]">
                Masuk ke akun LaporinAja-mu
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[14px]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  required
                  className="w-full h-[52px] rounded-xl px-4 text-[14px] text-gray-700 bg-white outline-none border-2 border-transparent focus:border-[#E8734A] shadow-md transition placeholder-gray-300"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-white font-semibold text-[14px]">
                  Kata Sandi
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    required
                    className="w-full h-[52px] rounded-xl px-4 pr-12 text-[14px] text-gray-700 bg-white outline-none border-2 border-transparent focus:border-[#E8734A] shadow-md transition placeholder-gray-300"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
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

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-[52px] rounded-xl bg-[#E8734A] hover:bg-[#d4603a] text-white font-bold text-[15px] shadow-lg transition-all duration-300 hover:scale-[1.02] mt-1"
              >
                Masuk
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

            {/* Google */}
            <button className="w-full h-[52px] bg-white rounded-xl flex items-center justify-center gap-3 shadow-md hover:scale-[1.02] transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.03 29.5 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.19 5.58C12.6 13.35 17.85 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.52 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.68c-.55 2.97-2.2 5.48-4.67 7.17l7.18 5.57C43.54 37.45 46.52 31.4 46.52 24.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.83 28.42A14.6 14.6 0 019.5 24c0-1.54.26-3.03.72-4.42L3.03 14C1.1 17.74 0 21.74 0 26c0 4.26 1.1 8.26 3.03 12l7.8-6.05z"
                />
                <path
                  fill="#34A853"
                  d="M24 47c5.5 0 10.12-1.82 13.5-4.94l-7.18-5.57C28.46 38.13 26.36 39 24 39c-6.15 0-11.4-3.85-13.17-9.28l-7.8 6.05C6.97 43.52 14.82 47 24 47z"
                />
              </svg>

              <span className="text-[14px] font-semibold text-gray-700">
                Masuk dengan Google
              </span>
            </button>

            {/* Register */}
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