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
    <div
      style={style}
      className="border-2 border-purple-700 rounded-2xl bg-white shadow-md flex flex-row items-center p-2 text-[11px] text-purple-800 overflow-hidden"
    >
      {/* Логотип слева */}
      <img
        src="/logo-png.png"
        alt="logo"
        className="w-12 h-12 object-contain mr-3"
      />

      {/* Текст справа */}
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-[9px] whitespace-normal">
          ДОКУМЕНТ ПОДПИСАН УСИЛЕННОЙ КВАЛИФИЦИРОВАННОЙ ЭЛЕКТРОННОЙ ПОДПИСЬЮ
        </span>

        <div className="font-semibold text-xs truncate">{fio}</div>

        <div className="text-[10px]">
          Сертификат: {cert || (preview ? "XXXX-XXXX-XXXX-XXXX" : "-")}
        </div>

        <div className="text-[10px]">
          Дата: {date || (preview ? new Date().toLocaleDateString() : "-")}
        </div>
      </div>
    </div>
  );
}
