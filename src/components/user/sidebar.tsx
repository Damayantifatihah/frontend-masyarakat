"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, FileText, BarChart2, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import api from "@/lib/axios";

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Beranda",      href: "/user",              icon: Home      },
  { label: "Buat Laporan", href: "/user/buatlaporan",  icon: BarChart2 },
  { label: "Laporan Saya", href: "/user/laporan-saya", icon: FileText  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

function useProfile(email?: string | null) {
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

  const load = async () => {
  try {
    const res = await api.get("/auth/me");
    const user = res.data.user;

    console.log("USER:", user);

    setBio(user.bio || "");

    setPhoto(
      user.profile_photo || null
    );
  } catch (error) {
    console.log(error);
  }
};

    load();

    window.addEventListener(
      "profileUpdated",
      load
    );

    return () =>
      window.removeEventListener(
        "profileUpdated",
        load
      );
  }, [email]);

  return { bio, photo };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Avatar({
  photo,
  initials,
}: {
  photo: string | null;
  initials: string;
}) {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/25 flex items-center justify-center text-sm font-bold text-white shrink-0">
      {photo ? (
        <img
          src={photo}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

function NavItem({
  label,
  href,
  icon: Icon,
  active,
}: {
  label:  string;
  href:   string;
  icon:   React.ElementType;
  active: boolean;
}) {
  return (
    <button
      onClick={() => (window.location.href = href)}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] w-full border-none cursor-pointer transition-colors duration-200
        ${active
          ? "bg-[#B45743] text-white"
          : "bg-transparent text-[#374151] hover:bg-[#F9EAE7]"
        }`}
    >
      <Icon size={20} className={active ? "text-white" : "text-[#6B7280]"} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function ProfileCard({
  name,
  bio,
  photo,
  initials,
}: {
  name:     string;
  bio:      string;
  photo:    string | null;
  initials: string;
}) {
  return (
    <div className="bg-[#B45743] hover:bg-[#8B3A2A] rounded-[14px] px-3.5 py-3 flex items-center gap-3 cursor-pointer transition-colors duration-200">
      <Avatar photo={photo} initials={initials} />
      <div className="overflow-hidden flex-1">
        <p className="text-sm font-bold text-white truncate">{name}</p>
        {bio && (
          <p className="mt-0.5 text-[11px] text-white/75 truncate">{bio}</p>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const scrolled = useScrolled();
  const { bio, photo } = useProfile(session?.user?.email);

  const name     = session?.user?.name ?? "User";
  const initials = getInitials(name);

  return (
    <aside
      className= {` sticky top-0 w-[264px] min-h-screen bg-white border-r border-[#F0EFEF] flex flex-col shrink-0 overflow-hidden font-[Plus_Jakarta_Sans,Segoe_UI,sans-serif] transition-shadow duration-300
        ${scrolled ? "shadow-[4px_0_24px_rgba(180,87,67,0.10),2px_0_8px_rgba(0,0,0,0.06)]" : "shadow-none"}`}
    >
      {/* Logo */}
      <div
        className={`px-6 border-b border-[#F5F5F5] flex items-center transition-all duration-300
          ${scrolled ? "py-3.5 min-h-16" : "py-5 min-h-[78px]"}`}
      >
        <Image src="/images/logo.png" alt="LaporinAja" width={150} height={38} />
      </div>

      {/* Profile card */}
      <div className="px-4 pt-4 pb-3">
        <Link href="/user/profile" className="no-underline">
          <ProfileCard name={name} bio={bio} photo={photo} initials={initials} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-2 flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, icon }) => (
          <NavItem
            key={href}
            label={label}
            href={href}
            icon={icon}
            active={pathname === href}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] w-full border-none bg-transparent cursor-pointer text-sm font-medium text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}