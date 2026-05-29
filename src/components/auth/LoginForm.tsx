"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Image from "next/image";

import Link from "next/link";

import {
  signIn,
  useSession,
} from "next-auth/react";

export default function LoginPage() {
  const router =
    useRouter();

  const {
    data: session,
    status,
  } = useSession();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  // ===================================
  // AUTO REDIRECT JIKA SUDAH LOGIN
  // ===================================

  useEffect(() => {
    if (
      status ===
      "authenticated"
    ) {
      const role =
        session?.user?.role;

      // ADMIN
      if (role === "admin") {
        router.replace(
          "/admin/dashboard"
        );

        return;
      }

      // SUPERADMIN
      if (
        role ===
        "superadmin"
      ) {
        router.replace(
          "/superadmin/dashboard"
        );

        return;
      }

      // USER
      router.replace("/user");
    }
  }, [
    session,
    status,
    router,
  ]);

  // ===================================
  // HANDLE LOGIN
  // ===================================

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result =
        await signIn(
          "credentials",
          {
            email,
            password,

            redirect: false,
          }
        );

      // LOGIN GAGAL
      if (result?.error) {
        alert(
          "Email atau password salah"
        );

        return;
      }

      // AMBIL SESSION
      const res = await fetch(
        "/api/auth/session"
      );

      const session =
        await res.json();

      const role =
        session?.user?.role;

      // =========================
      // REDIRECT ROLE
      // =========================

      // ADMIN
      if (role === "admin") {
        router.replace(
          "/admin/dashboard"
        );

        return;
      }

      // SUPERADMIN
      if (
        role ===
        "superadmin"
      ) {
        router.replace(
          "/superadmin/dashboard"
        );

        return;
      }

      // USER
      router.replace("/user");
    } catch (error) {
      console.log(error);

      alert("Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden font-[Poppins,sans-serif]">
      <div className="relative w-full h-screen flex">
        
        {/* BACKGROUND */}
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
            
            {/* HEADING */}
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