const steps = [
  {
    number: "01",
    title: "Buat Laporan",
    desc: "Sampaikan keluhan atau aspirasi Anda secara jelas dan lengkap agar mudah diproses.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="4" width="20" height="24" rx="3" stroke="white" strokeWidth="2" fill="none" />
        <path d="M10 10h12M10 14h12M10 18h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <rect x="13" y="2" width="6" height="4" rx="1" fill="white" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Verifikasi Admin",
    desc: "Tim admin akan memeriksa dan memvalidasi laporan sebelum diteruskan.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 3L4 8v8c0 7 5.33 13.47 12 15 6.67-1.53 12-8 12-15V8L16 3z" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <path d="M11 16l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Proses Tindak Lanjut",
    desc: "Laporan diteruskan kepada pihak terkait untuk segera ditangani dan ditindaklanjuti.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4 A12 12 0 1 1 4 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M4 10 L4 16 L10 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Beri Tanggapan",
    desc: "Anda dapat memberikan tanggapan terhadap laporan yang telah ditindaklanjuti oleh pihak terkait dalam waktu 3 hari",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 6 C4 4.9 4.9 4 6 4 H26 C27.1 4 28 4.9 28 6 V20 C28 21.1 27.1 22 26 22 H18 L12 28 V22 H6 C4.9 22 4 21.1 4 20 Z" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <circle cx="11" cy="13" r="1.5" fill="white" />
        <circle cx="16" cy="13" r="1.5" fill="white" />
        <circle cx="21" cy="13" r="1.5" fill="white" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Selesai",
    desc: "Laporan telah selesai diproses dan Anda dapat melihat hasil tindak lanjut yang diberikan.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="2" fill="none" />
        <path d="M10 16l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function CaraKerjaSection() {
  return (
    <section id="cara-kerja" className="bg-white py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-[26px] sm:text-[32px] font-bold text-gray-900 mb-3">
            Cara Kerja LaporinAja
          </h2>
          <p className="text-[#CC664F] text-[14px] sm:text-[15px] font-medium leading-relaxed">
            Lima langkah sederhana dari laporan hingga masalah<br className="hidden sm:block" /> selesai ditangani
          </p>
        </div>

        <div className="relative">
          {/* Dashed connector line (desktop only) */}
          <div className="hidden lg:block absolute top-[36px] left-[10%] right-[10%] h-[2px] z-0">
            <svg width="100%" height="2">
              <line x1="0" y1="1" x2="100%" y2="1" stroke="#CC664F" strokeWidth="2" strokeDasharray="8 6" opacity="0.4" />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map(({ number, title, desc, icon }) => (
              <div key={number} className="flex flex-col items-center text-center">
                <div className="w-[72px] h-[72px] rounded-full bg-[#CC664F] flex items-center justify-center mb-4 shadow-md">
                  {icon}
                </div>
                <span className="text-[13px] text-gray-400 font-semibold mb-1">{number}</span>
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}