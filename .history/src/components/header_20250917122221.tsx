"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { LogOut, PencilLine } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCertificateInfo } from "@/services/getCertInfo";

export default function Header() {
  const { user, logout, token, hydrated } = useAuthStore();
  const router = useRouter();
  const [certInfo, setCertInfo] = useState<any>(null);
  const [certMatch, setCertMatch] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token || !hydrated || !user) return;

    const fetchCert = async () => {
      try {
        const info = await getCertificateInfo();
        setCertInfo(info);

        if (info) {
          // Ищем ФИО в subjectName
          const fioFromCert = extractFio(info.subjectName);
          if (fioFromCert && user.fio) {
            setCertMatch(user.fio.includes(fioFromCert.split(" ")[0])); 
          } else {
            setCertMatch(false);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCert();
  }, [token, hydrated, user]);

  if (!token || !hydrated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center justify-between w-[100%] max-w-6xl px-4 py-2 bg-white text-black rounded-xl shadow-lg z-50">
      {/* Лого */}
      <div className="font-semibold text-lg">SIGned</div>

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

      <div className="flex items-center gap-4">
        {/* Значок ЭЦП */}
        {certInfo && (
          <div className="relative group">
            <PencilLine
              className={`w-6 h-6 cursor-pointer ${
                certMatch ? "text-green-600" : "text-red-600"
              }`}
            />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 p-3 bg-white border rounded-lg shadow-md text-sm opacity-0 group-hover:opacity-100 transition">
              <p><b>ФИО:</b> {extractFio(certInfo.subjectName)}</p>
              <p><b>Сертификат:</b> {certInfo.thumbprint}</p>
              <p><b>Действует до:</b> {formatDate(certInfo.validTo)}</p>
            </div>
          </div>
        )}

        <span>{user.username}</span>
        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-red-200 transition"
          title="Выйти"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

// Вытаскиваем ФИО из subjectName (берём CN)
function extractFio(subjectName: string): string | null {
  const cnMatch = subjectName.match(/CN=([^,]+)/);
  return cnMatch ? cnMatch[1] : null;
}

// Форматируем дату в ДД.ММ.ГГГГ
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU");
}
