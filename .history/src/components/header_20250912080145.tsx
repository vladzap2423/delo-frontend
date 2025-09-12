"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

class Menu


export default function Header() {
  const { user, logout, token, hydrated } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="fixed top-2 left-1/2 -translate-x-1/2
        flex items-center justify-between
        w-[100%] max-w-6xl
        px-4 py-2
        bg-white text-black
        rounded-xl shadow-lg

        z-50">
      <div className="font-semibold text-lg">
        SIGned
      </div>

      <div>

      </div>

      {token && hydrated && user && (
        <div className="flex items-center gap-4">
            <span>
                {user.username}
            </span>
            <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-emerald-700 transition"
                title="Выйти"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      )}
    </header>
  );
}
