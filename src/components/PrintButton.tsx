"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-green-900 font-semibold text-sm hover:bg-green-50 transition-colors shadow"
    >
      <Printer size={16} />
      Print This Page
    </button>
  );
}
