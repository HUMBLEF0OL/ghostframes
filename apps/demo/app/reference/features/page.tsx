import Link from "next/link";

const features = [
  {
    slug: "custom-slots",
    title: "Custom Slots",
    description: "Replace specific elements with custom skeleton UI via data-skeleton-slot.",
    icon: "🎨",
  },
  {
    slug: "ignore-elements",
    title: "Element Exclusion",
    description: "Keep interactive controls active with data-skeleton-ignore.",
    icon: "🚫",
  },
  {
    slug: "responsive",
    title: "Responsive Behavior",
    description: "Re-measure blueprints on resize with remeasureOnResize.",
    icon: "📏",
  },
  {
    slug: "callbacks",
    title: "Callbacks & Hooks",
    description: "Inspect generated blueprints with onMeasured.",
    icon: "🔔",
  },
  {
    slug: "caching",
    title: "Blueprint Caching",
    description: "Understand structural blueprint reuse for repeated layouts.",
    icon: "⚡",
  },
];

export default function FeaturesPage() {
  return (
    <div>
      <h1 className="mb-2 text-4xl font-bold text-white light:text-zinc-900">Features</h1>
      <p className="mb-8 text-lg text-zinc-500 light:text-zinc-600">
        Interactive examples for every feature available in the runtime.
      </p>

      <div className="grid gap-4">
        {features.map((feature) => (
          <Link
            key={feature.slug}
            href={`/reference/features/${feature.slug}`}
            className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-indigo-500/50 light:border-zinc-200 light:bg-zinc-100 light:hover:border-indigo-300"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{feature.icon}</span>
              <div className="flex-1">
                <h2 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-indigo-300 light:text-zinc-900 light:group-hover:text-indigo-600">
                  {feature.title}
                </h2>
                <p className="text-sm text-zinc-500 light:text-zinc-600">{feature.description}</p>
              </div>
              <span className="text-zinc-600 group-hover:text-zinc-400 light:text-zinc-400 light:group-hover:text-zinc-600">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 p-5 light:border-zinc-200 light:bg-zinc-50">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 light:text-zinc-400">
          Server Rendering
        </p>
        <Link href="/reference/ssr" className="text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200 light:text-indigo-700 light:hover:text-indigo-600">
          SSR & Static Blueprints →
        </Link>
      </div>
    </div>
  );
}
