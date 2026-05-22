const layananList = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <rect x="4" y="28" width="32" height="5" rx="1" stroke="#374151" strokeWidth="2" fill="none" />
        <rect x="10" y="16" width="8" height="12" rx="1" stroke="#374151" strokeWidth="2" fill="none" />
        <rect x="22" y="16" width="8" height="12" rx="1" stroke="#374151" strokeWidth="2" fill="none" />
        <path d="M8 16 L20 8 L32 16" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    title: "Infrastruktur",
    desc: "Jalan berlubang, Jemabatan rusak, fasilitas umum yang perlu perbaikan.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <rect x="13" y="4" width="14" height="32" rx="4" stroke="#374151" strokeWidth="2" fill="none" />
        <circle cx="20" cy="13" r="3.5" fill="#EF4444" />
        <circle cx="20" cy="22" r="3.5" fill="#EAB308" />
        <circle cx="20" cy="31" r="3.5" fill="#22C55E" />
      </svg>
    ),
    title: "Lalu Lintas",
    desc: "Jalan berlubang, Jemabatan rusak, fasilitas umum yang perlu perbaikan.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <path d="M20 36 C20 36 8 27 8 17 C8 10.5 13.5 6 20 8 C26.5 6 32 10.5 32 17 C32 27 20 36 20 36Z" fill="#22C55E" opacity="0.9" />
        <path d="M20 36 L20 18" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 26 L14 20" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 30 L26 24" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Lingkungan",
    desc: "Pohon tumbang, Saluran tersumbat, Kali menguap, dan titik banjir langganan tiap musim hujan khususnya di Depok",
  },
];

export default function LayananSection() {
  return (
    <section id="layanan" className="bg-white py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="text-center text-[28px] sm:text-[32px] font-bold text-gray-900 mb-12">
          Layanan Kami
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {layananList.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-10 h-10 mb-4">{icon}</div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}