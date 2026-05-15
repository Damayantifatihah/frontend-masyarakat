export default function StatsBar() {
  return (
    <section className="bg-white py-7 border-b border-gray-100">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">

          <div className="flex items-center gap-3 px-10 py-3 sm:py-0">
            <div className="w-12 h-12 rounded-full bg-[#E8734A] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="white" />
                <path d="M9 12l2 2 4-4" stroke="#E8734A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-gray-800 whitespace-nowrap">Aman & Terpecaya</span>
          </div>

          <div className="flex items-center gap-3 px-10 py-3 sm:py-0">
            <div className="w-12 h-12 rounded-full bg-[#E8734A] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-gray-800 whitespace-nowrap">Respon Cepat</span>
          </div>

          <div className="flex items-center gap-3 px-10 py-3 sm:py-0">
            <div className="w-12 h-12 rounded-full bg-[#E8734A] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="3" stroke="white" strokeWidth="2" />
                <circle cx="15" cy="7" r="3" stroke="white" strokeWidth="2" />
                <path d="M3 19c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-gray-800 whitespace-nowrap">Mudah Digunakan</span>
          </div>

        </div>
      </div>
    </section>
  );
}