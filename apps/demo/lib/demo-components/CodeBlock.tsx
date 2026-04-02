"use client";

import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  copyable?: boolean;
}

export function CodeBlock({ code, language = "tsx", copyable = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 light:border-zinc-300 light:bg-zinc-100">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2 light:border-zinc-300 light:bg-zinc-200">
        <span className="font-mono text-xs text-zinc-500 light:text-zinc-600">{language}</span>
        {copyable ? (
          <button
            onClick={handleCopy}
            className="rounded px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 light:text-zinc-600 light:hover:bg-zinc-300"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>

      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-xs text-zinc-300 light:text-zinc-700">{code}</code>
      </pre>
    </div>
  );
}
