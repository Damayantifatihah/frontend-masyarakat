import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="relative overflow-hidden rounded-[30px]">

          {/* Background Image */}
          <img
            src="/images/cta-bg.png"
            alt="CTA Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-white/10" />

          {/* Content */}
          <div className="relative z-10 px-8 sm:px-14 py-14 flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* Left */}
            <div className="max-w-[420px]">
              <h2 className="text-[32px] sm:text-[40px] font-extrabold leading-tight text-[#C65B38] mb-5">
                Siap Melaporkan Masalah di Sekitar Anda?
              </h2>
              <p className="text-[15px] leading-relaxed text-gray-700">
                Laporan Anda sangat berarti bagi perbaikan kualitas hidup di
                lingkungan kita. Bergabunglah dengan ribuan masyarakat lainnya
                yang telah berkontribusi.
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-4">
             <Link
              href="/auth/login"
              className="bg-[#FE7951] hover:bg-[#e56f47] text-white font-bold text-[15px] px-8 py-4 rounded-xl shadow-md transition-all duration-300 text-center"
            >
              Buat Laporan Anda Sekarang
            </Link>
              <button className="bg-[#FE7951] hover:bg-[#e56f47] text-white font-bold text-[15px] px-8 py-4 rounded-xl shadow-md transition-all duration-300">
                Pelajari Selengkapnya
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}