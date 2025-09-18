"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { LogOut, PencilLine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getCertificateInfo } from "@/services/getCertInfo";


export default function Header() {
  const { user, logout, token, hydrated } = useAuthStore();
  const router = useRouter();
  const [certInfo, setCertInfo] = useState<any>(null);
  const [certMatch, setCertMatch] = useState<boolean | null>(null);

  if (!token || !hydrated || !user) {
    return null
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  const handelCheckSigned = async () => {
    try {
      const info = await getCertificateInfo()
      setCertInfo(info)
      console.log("Информация с ЭЦП: ", info)
    } catch (err) {
      console.error(err)
    }
  
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
