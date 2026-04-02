"use client";

import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
  codeLabel?: string;
}

export function FeatureCard({ title, description, badge, children, codeLabel }: FeatureCardProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 light:border-zinc-200 light:bg-white">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="mb-1 text-xl font-bold text-white light:text-zinc-900">{title}</h2>
          <p className="text-sm text-zinc-500 light:text-zinc-600">{description}</p>
        </div>
        {badge ? (
          <span className="shrink-0 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-1 text-xs font-semibold text-indigo-300 light:border-indigo-200 light:bg-indigo-50 light:text-indigo-700">
            {badge}
          </span>
        ) : null}
      </header>

      <div className="border-t border-zinc-800 pt-4 light:border-zinc-200">{children}</div>

      {codeLabel ? (
        <p className="mt-4 border-t border-zinc-800 pt-4 font-mono text-xs text-zinc-500 light:border-zinc-200 light:text-zinc-400">
          {codeLabel}
        </p>
      ) : null}
    </section>
  );
}