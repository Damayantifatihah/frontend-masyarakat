const testimonials = [
  {
    text: "Laporan jalan berlubang saya ditindaklanjuti dalam 3 hari! Dulu saya pikir laporan warga tidak akan pernah direspons, ternyata salah besar.",
    name: "Andi Saputra",
    location: "Depok, Jawa Barat",
    initials: "AS",
    avatarBg: "#4B9CD3",
  },
  {
    text: "Akhirnya ada platform yang benar-benar menjembatani warga dan pemerintah. Mudah dipakai dan bisa pantau progresnya secara langsung.",
    name: "Rina Puspita",
    location: "Depok, Jawa Barat",
    initials: "RP",
    avatarBg: "#E8734A",
  },
  {
    text: "Setiap musim hujan RT kami selalu banjir. Sejak pakai LaporinAja, drainase jalan akhirnya diperbaiki dan sekarang air sudah tidak menggenang lagi.",
    name: "Muhamad Prasetya",
    location: "Depok, Jawa Barat",
    initials: "MP",
    avatarBg: "#9B59B6",
  },
];

export default function TestimoniSection() {
  return (
    <section id="testimoni" className="bg-white py-16">
      <div className="max-w-[1100px] mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-[26px] sm:text-[32px] font-bold text-gray-900 mb-3">
            Apa Kata Masyarakat
          </h2>
          <p className="text-[#E8734A] text-[14px] sm:text-[15px] font-medium leading-relaxed max-w-[480px] mx-auto">
            Testimoni dari warga yang telah merasakan manfaat dari Sistem Pelaporan
            Masyarakat dalam membangun kota yang lebih baik.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(({ text, name, location, initials, avatarBg }) => (
            <div
              key={name}
              className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#FFD700">
                    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p className="text-[13px] text-gray-600 leading-relaxed italic flex-1">
                "{text}"
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: avatarBg }}
                >
                  <span className="text-white text-[12px] font-bold">{initials}</span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#E8734A]">{name}</p>
                  <p className="text-[12px] text-gray-400">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}