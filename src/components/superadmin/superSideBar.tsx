"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  LayoutDashboard,
  Users,
  UserCog,
  LogOut,
} from "lucide-react";

import { signOut } from "next-auth/react";

const menus = [
  {
    label: "Dashboard",
    href: "/superadmin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manajemen Admin",
    href: "/superadmin/manajemen-admin",
    icon: UserCog,
  },
  {
    label: "Manajemen User",
    href: "/superadmin/manajemen-user",
    icon: Users,
  },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[270px] bg-white border-r border-gray-100 flex flex-col min-h-screen">
      
      {/* LOGO */}
      <div className="h-[80px] border-b border-gray-100 flex items-center px-6">
        <Image
          src="/images/logo.png"
          alt="LaporinAja"
          width={160}
          height={40}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* MENU */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-2">
        {menus.map((item) => {
          const active =
            pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${
                active
                  ? "bg-[#B45743] text-white shadow-sm"
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

      {/* PROFILE SUPER ADMIN */}
      <div className="px-4 pb-4">
        <div className="bg-[#FEF0E8] rounded-2xl p-4 flex items-center gap-3">
          
          <div className="w-12 h-12 rounded-full bg-[#B45743] flex items-center justify-center text-white font-bold text-lg">
            S
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              Super Admin
            </h3>

            <p className="text-sm text-gray-500">
              Full Access Control
            </p>
          </div>
        </div>
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => signOut()}
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