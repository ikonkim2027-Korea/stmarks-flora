"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-ink">
      <Printer size={16} />
      Print this page
    </button>
  );
}
