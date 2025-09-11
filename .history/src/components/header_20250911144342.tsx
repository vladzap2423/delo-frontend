"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout, token, hydrated } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between w-full px-6 py-3 bg-emerald-800 text-white shadow-md">
      <div className="font-semibold text-lg">
        SIGned
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
