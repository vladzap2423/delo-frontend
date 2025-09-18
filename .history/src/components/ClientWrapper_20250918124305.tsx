"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import Header from "@/components/header";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init(); // инициализация user из cookie
  }, [init]);

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-20 pb-6 text-center">
        {children}
      </main>
    </>
  );
}
