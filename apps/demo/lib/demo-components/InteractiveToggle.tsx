"use client";

import React from "react";

interface InteractiveToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function InteractiveToggle({
  label,
  checked,
  onChange,
  description,
}: InteractiveToggleProps) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3 rounded-lg bg-zinc-800 p-3 light:bg-zinc-100">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white light:text-zinc-900">{label}</p>
        {description ? (
          <p className="mt-1 text-xs text-zinc-500 light:text-zinc-600">{description}</p>
        ) : null}
      </div>

      <button
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`shrink-0 flex h-6 w-10 items-center rounded-full px-1 transition-colors ${checked ? "bg-emerald-500" : "bg-zinc-700 light:bg-zinc-300"}`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}
