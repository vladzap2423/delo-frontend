"use client";

interface SignatureBlockProps {
  fio: string;
  cert?: string;
  date?: string;
  preview?: boolean; // для заглушки в схеме
}

export default function SignatureBlock({ fio, cert, date, preview }: SignatureBlockProps) {
  return (
    <div 
    className=" w-[400px] h-[100px] border-2 border-purple-700 rounded-3xl bg-white shadow-md flex flex-col p-2 text-[11px] text-purple-800 overflow-hidden">
      {/* Верхняя строка с логотипом и заголовком */}
      <div className="flex items-center gap-2 mb-1">
        <img src="/logo-png.png" alt="logo" className="w-8 h-8 object-contain" />
        <span className="font-bold text-[9px] leading-tight">
          ДОКУМЕНТ ПОДПИСАН УСИЛЕННОЙ КВАЛИФИЦИРОВАННОЙ ЭЛЕКТРОННОЙ ПОДПИСЬЮ
        </span>
      </div>

      {/* ФИО */}
      <div className="font-semibold text-xs mt-1">
        {fio}
      </div>

      {/* Сертификат */}
      <div className="text-[10px]">
        Сертификат: {cert || (preview ? "XXXX-XXXX-XXXX-XXXX" : "-")}
      </div>

      {/* Дата */}
      <div className="text-[10px]">
        Дата: {date || (preview ? new Date().toLocaleDateString() : "-")}
      </div>
    </div>
  );
}
