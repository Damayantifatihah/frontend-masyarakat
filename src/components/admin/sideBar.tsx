"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  LogOut,
} from "lucide-react";

import { signOut } from "next-auth/react";

const menus = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Kelola Laporan",
    href: "/admin/kelola-laporan",
    icon: FileText,
  },
  {
    label: "Kelola Kategori",
    href: "/admin/kelola-kategori",
    icon: FolderKanban,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className=" sticky top-0 h-screen w-[270px] bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="h-[80px] border-b border-gray-100 flex items-center px-6">
        <Image
          src="/images/logo.png"
          alt="LaporinAja"
          width={160}
          height={40}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-2">
        {menus.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${
                active
                  ? "bg-[#B45743] text-white"
                  : "text-gray-600 hover:bg-[#FEF0E8] hover:text-[#E8763A]"
              }`}
            >
              <item.icon size={20} />

              <span className="font-semibold text-[15px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

     {/* Logout */}
      <div className="p-4 border-t border-gray-100">
            <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
    >
          <LogOut size={20} />

          <span className="font-semibold text-[15px]">
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}