"use client";

import React, { useMemo, useState } from "react";
import { AutoSkeleton } from "../../lib/skelcore/react";
import type { AnimationMode, SkeletonConfig } from "../../lib/skelcore/core";
import { CodeBlock, FeatureCard } from "../../lib/demo-components";

function PreviewCard() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 light:border-zinc-200 light:bg-white">
      <div className="mb-4 flex gap-4">
        <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
        <div className="flex-1">
          <h3 className="mb-1 text-sm font-bold text-white light:text-zinc-900">Enterprise Plan</h3>
          <p className="text-xs text-zinc-500 light:text-zinc-600">Best for teams managing multiple projects</p>
        </div>
        <p className="text-lg font-bold text-emerald-400">$99</p>
      </div>
      <div className="flex gap-2 text-xs">
        <span className="rounded bg-zinc-800 px-2 py-1 text-zinc-300 light:bg-zinc-100 light:text-zinc-700">Priority</span>
        <span className="rounded bg-zinc-800 px-2 py-1 text-zinc-300 light:bg-zinc-100 light:text-zinc-700">Analytics</span>
      </div>
    </div>
  );
}

export default function ConfigPlaygroundPage() {
  const [loading, setLoading] = useState(true);
  const [animation, setAnimation] = useState<AnimationMode>("shimmer");
  const [baseColor, setBaseColor] = useState("#2525a8");
  const [highlightColor, setHighlightColor] = useState("#090c46");
  const [borderRadius, setBorderRadius] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [minTextHeight, setMinTextHeight] = useState(12);

  const config: Partial<SkeletonConfig> = useMemo(
    () => ({
      animation,
      baseColor,
      highlightColor,
      borderRadius,
      speed,
      minTextHeight,
    }),
    [animation, baseColor, borderRadius, highlightColor, minTextHeight, speed],
  );

  return (
    <div className="min-h-screen bg-zinc-950 p-6 light:bg-white md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="mb-2 text-4xl font-bold text-white light:text-zinc-900">Configuration Playground</h1>
          <p className="text-zinc-500 light:text-zinc-600">Tune config values and preview skeleton behavior in real time.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <FeatureCard title="Controls" description="Adjust animation, color, radius, and speed">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500 light:text-zinc-600">Animation</label>
                  <div className="flex gap-2">
                    {(["shimmer", "pulse", "none"] as AnimationMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setAnimation(mode)}
                        className={`rounded border px-3 py-2 text-xs font-semibold uppercase transition-colors ${
                          animation === mode
                            ? "border-indigo-500 bg-indigo-500/20 text-indigo-200 light:border-indigo-400 light:bg-indigo-50 light:text-indigo-700"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500 light:border-zinc-300 light:text-zinc-600 light:hover:border-zinc-400"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500 light:text-zinc-600">Base Color</label>
                  <input type="color" value={baseColor} onChange={(event) => setBaseColor(event.target.value)} className="h-10 w-full cursor-pointer" />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500 light:text-zinc-600">Highlight Color</label>
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={(event) => setHighlightColor(event.target.value)}
                    className="h-10 w-full cursor-pointer"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500 light:text-zinc-600">Border Radius: {borderRadius}px</label>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    value={borderRadius}
                    onChange={(event) => setBorderRadius(Number(event.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500 light:text-zinc-600">Speed: {speed.toFixed(1)}x</label>
                  <input
                    type="range"
                    min={0.5}
                    max={2.5}
                    step={0.1}
                    value={speed}
                    onChange={(event) => setSpeed(Number(event.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500 light:text-zinc-600">
                    Min Text Height: {minTextHeight}px
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={24}
                    value={minTextHeight}
                    onChange={(event) => setMinTextHeight(Number(event.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={() => setLoading((current) => !current)}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {loading ? "Stop Loading" : "Start Loading"}
                </button>
              </div>
            </FeatureCard>
          </div>

          <div className="space-y-4">
            <FeatureCard title="Live Preview" description="The preview updates as controls change">
              <AutoSkeleton loading={loading} config={config}>
                <PreviewCard />
              </AutoSkeleton>
            </FeatureCard>

            <FeatureCard title="Generated Config" description="Copy and use this config in your app">
              <CodeBlock
                code={`const config = ${JSON.stringify(config, null, 2)};

<AutoSkeleton loading={loading} config={config}>
  <YourComponent />
</AutoSkeleton>`}
              />
            </FeatureCard>
          </div>
        </div>
      </div>
    </div>
  );
}