"use client";

import { ArrowLeft } from "lucide-react";

export default function BackButton({ fallback, label }: { fallback: string; label: string }) {
  function goBack() {
    if (window.history.length > 1) window.history.back();
    else window.location.assign(fallback);
  }

  return <button type="button" className="header-back" onClick={goBack} aria-label={label}>
    <ArrowLeft size={18} aria-hidden="true" /><span>{label}</span>
  </button>;
}
