import Link from "next/link";


export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden"
      style={{ minHeight: "calc(100vh - 76px)" }}
    >
      <img
        src="/images/landing.png"
        alt="hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4"
        style={{ minHeight: "calc(100vh - 76px)" }}
      >
        <h1
          className="text-[44px] sm:text-[58px] lg:text-[64px] font-extrabold leading-tight mb-5"
          style={{ color: "#FE7951" }}
        >
          Layanan Pengaduan
          <br />
          Masyarakat
        </h1>
        <p className="text-gray-600 text-[15px] sm:text-[17px] max-w-[500px] leading-relaxed mb-10">
          Sampaikan aspirasi Anda dengan mudah dan transparan. Kami memastikan
          setiap suara didengar dan ditindaklanjuti
        </p>
     <Link
        href="/auth/login"
        className="group inline-flex items-center gap-3 bg-[#CC664F] hover:bg-[#d4603a] text-white font-bold text-[16px] px-9 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-[1.03]"
        >
        Laporkan Sekarang

        <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            </svg>
        </span>
        </Link>
      </div>
    </section>
  );
}