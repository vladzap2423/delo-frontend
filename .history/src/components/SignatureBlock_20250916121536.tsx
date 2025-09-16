"use client";

interface SignatureBlockProps {
  fio: string;
  cert?: string;
  date?: string;
  preview?: boolean; // если true — показываем "ПОДПИСЬ" как заглушку
}

export default function SignatureBlock({ fio, cert, date, preview }: SignatureBlockProps) {
  return (
    <div className="w-80 h-25 border border-gray-700 rounded p-1 bg-white shadow-md flex flex-col justify-between text-[10px] select-none">
        <span>Документ подписан усиленой квалифицированной подписью</span>
        <div className="font-semibold text-xs truncate">{fio}</div>
        <div className="text-[9px] text-gray-600">
            Сертификат: {cert || (preview ? "XXXX-XXXX" : "-")}
        </div>
        <div className="text-[9px] text-gray-600">
            Дата: {date || (preview ? new Date().toLocaleDateString() : "-")}
        </div>
    </div>
  );
}
