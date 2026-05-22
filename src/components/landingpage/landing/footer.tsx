import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="bg-[#F8F8F8] pt-16 pb-10 px-6 mt-10 border-t border-gray-100">
      <div className="max-w-[1100px] mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Logo & Desc */}
          <div>
            <img src="/images/logo.png" alt="LaporinAja" className="w-[190px] mb-5" />
            <p className="text-[15px] leading-[32px] text-gray-800 max-w-[280px]">
              Platform pengaduan masyarakat yang transparan dan terpercaya.
              Bersama wujudkan kota yang lebih baik untuk semua.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-[#E8734A] text-[16px] font-semibold mb-5 uppercase tracking-wide">Platform</h3>
            <ul className="space-y-4">
              {[
                { label: "Lapor Insiden", href: "/lapor" },
                { label: "Cek Status", href: "/status" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Aplikasi Mobile", href: "/mobile" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[15px] text-gray-800 hover:text-[#E8734A] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="text-[#E8734A] text-[16px] font-semibold mb-5 uppercase tracking-wide">Perusahaan</h3>
            <ul className="space-y-4">
              {[
                { label: "Tentang Kami", href: "/tentang" },
                { label: "Kebijakan Privasi", href: "/privasi" },
                { label: "Syarat & Ketentuan", href: "/syarat" },
                { label: "Kontak", href: "/kontak" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[15px] text-gray-800 hover:text-[#E8734A] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h3 className="text-[#E8734A] text-[16px] font-semibold mb-5 uppercase tracking-wide">Bantuan</h3>
            <ul className="space-y-4">
              {[
                { label: "Pusat Bantuan", href: "/pusat-bantuan" },
                { label: "Panduan Pengguna", href: "/panduan" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-[15px] text-gray-800 hover:text-[#E8734A] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-gray-500 text-center sm:text-left">
            © 2026 LaporinAja. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a href="#" className="text-gray-500 hover:text-[#E8734A] transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0022 12z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="text-gray-500 hover:text-[#E8734A] transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 1.8h8.5a3.95 3.95 0 013.95 3.95v8.5a3.95 3.95 0 01-3.95 3.95h-8.5a3.95 3.95 0 01-3.95-3.95v-8.5A3.95 3.95 0 017.75 3.8zm8.95 1.35a.9.9 0 100 1.8.9.9 0 000-1.8zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.8A3.2 3.2 0 1112 15.2 3.2 3.2 0 0112 8.8z" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a href="#" className="text-gray-500 hover:text-[#E8734A] transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0015.5 4a4.29 4.29 0 00-4.28 4.29c0 .34.04.67.11.99A12.18 12.18 0 013 5.15a4.28 4.28 0 001.33 5.72 4.24 4.24 0 01-1.94-.54v.05A4.29 4.29 0 005.82 14a4.3 4.3 0 01-1.93.07 4.29 4.29 0 004 2.98A8.6 8.6 0 012 19.54 12.14 12.14 0 008.58 21c7.9 0 12.22-6.55 12.22-12.22l-.01-.56A8.7 8.7 0 0022.46 6z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}