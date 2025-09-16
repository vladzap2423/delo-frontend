"use client";

interface SignatureBlockProps {
  fio: string;
  cert?: string;
  date?: string;
  preview?: boolean; // для заглушки в схеме
  style?: React.CSSProperties;
}

export default function SignatureBlock({ fio, cert, date, preview, style }: SignatureBlockProps) {
  return (
    <div className="w-80 border-2 border-purple-700 rounded-lg p-2 bg-white shadow-md flex flex-col text-[11px] select-none text-purple-800">
      {/* Верхняя строка с логотипом и заголовком */}
      <div className="flex items-center gap-2 mb-1">
        <img src="/logo-png.png" alt="logo" className="w-8 h-8 object-contain" />
        <span className="font-bold text-[11px] leading-tight">
          ДОКУМЕНТ ПОДПИСАН<br />УСИЛЕННОЙ КВАЛИФИЦИРОВАННОЙ<br />ЭЛЕКТРОННОЙ ПОДПИСЬЮ
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
