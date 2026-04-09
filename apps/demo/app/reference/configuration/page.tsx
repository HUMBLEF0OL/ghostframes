import { CodeBlock, FeatureCard } from "../../../lib/demo-components";

const configOptions = [
  {
    name: "animation",
    type: '"pulse" | "shimmer" | "none"',
    defaultValue: '"shimmer"',
    description: "Animation style for skeleton elements.",
  },
  {
    name: "baseColor",
    type: "string",
    defaultValue: "var(--skeleton-base)",
    description: "Base color for skeleton surfaces.",
  },
  {
    name: "highlightColor",
    type: "string",
    defaultValue: "var(--skeleton-highlight)",
    description: "Shimmer highlight color.",
  },
  {
    name: "borderRadius",
    type: "number",
    defaultValue: "4",
    description: "Corner radius for non-text blocks.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    description: "Animation speed multiplier.",
  },
  {
    name: "minTextHeight",
    type: "number",
    defaultValue: "12",
    description: "Minimum text line block height in px.",
  },
  {
    name: "maxDepth",
    type: "number",
    defaultValue: "12",
    description: "Maximum analyzer traversal depth.",
  },
  {
    name: "lastLineRatio",
    type: "number",
    defaultValue: "0.7",
    description: "Relative width of the last line in multiline text.",
  },
  {
    name: "iconMaxSize",
    type: "number",
    defaultValue: "32",
    description: "Largest icon size in px before classified as image.",
  },
  {
    name: "minImageArea",
    type: "number",
    defaultValue: "900",
    description: "Smallest image area required for image classification.",
  },
  {
    name: "transitionDuration",
    type: "number",
    defaultValue: "300",
    description: "Fade transition duration in ms.",
  },
];

export default function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="mb-2 text-4xl font-bold text-white light:text-zinc-900">
          Configuration Options
        </h1>
        <p className="text-lg text-zinc-500 light:text-zinc-600">
          Complete reference for tuning runtime behavior.
        </p>
      </header>

      <FeatureCard title="All Options" description="Type, default, and intent for each config key">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 light:border-zinc-200">
                <th className="px-3 py-2 text-zinc-400 light:text-zinc-600">Option</th>
                <th className="px-3 py-2 text-zinc-400 light:text-zinc-600">Type</th>
                <th className="px-3 py-2 text-zinc-400 light:text-zinc-600">Default</th>
                <th className="px-3 py-2 text-zinc-400 light:text-zinc-600">Description</th>
              </tr>
            </thead>
            <tbody>
              {configOptions.map((option) => (
                <tr key={option.name} className="border-b border-zinc-800/60 light:border-zinc-200">
                  <td className="px-3 py-2 font-mono text-xs text-indigo-300 light:text-indigo-700">
                    {option.name}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-zinc-400 light:text-zinc-600">
                    {option.type}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-zinc-500 light:text-zinc-500">
                    {option.defaultValue}
                  </td>
                  <td className="px-3 py-2 text-xs text-zinc-400 light:text-zinc-600">
                    {option.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FeatureCard>

      <FeatureCard title="Quick Start" description="Create and pass a partial config">
        <CodeBlock
          code={`const config = {
  animation: "pulse",
  baseColor: "#e5e7eb",
  highlightColor: "#f8fafc",
  borderRadius: 8,
  speed: 1.3,
};

<AutoSkeleton loading={loading} config={config}>
  <YourContent />
</AutoSkeleton>`}
        />
      </FeatureCard>
    </div>
  );
}
