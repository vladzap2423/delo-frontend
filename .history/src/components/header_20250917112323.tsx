"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { getCertificateInfo } from "@/services/cades";


export default function Header() {
  const { user, logout, token, hydrated } = useAuthStore();
  const router = useRouter();

  if (!token || !hydrated || !user) {
    return null
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  const handelCheckSigned = () => {
    const info = await get
  }

  return (
    <header className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center justify-between w-[100%] max-w-6xl px-4 py-2 bg-white text-black rounded-xl shadow-lg z-50">

      {/* Лого */}
      <div className="font-semibold text-lg">
        SIGned
      </div>

      {/* Меню */}
      <nav className="flex gap-6 text-sm font-medium">
        <Link href="/" className="hover:text-emerald-700 transition">
          Главная
        </Link>
        <Link href="/commissions" className="hover:text-emerald-700 transition">
          Комиссии
        </Link>
        {user?.role === "admin" && (
          <Link href="/admin" className="hover:text-emerald-700 transition">
            Админ панель
          </Link>
        )}
      </nav>

      {token && hydrated && user && (
        <div className="flex items-center gap-4">
            <span>
                {user.username}
            </span>
            <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-200 transition"
                title="Выйти"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      )}
    </header>
  );
}
