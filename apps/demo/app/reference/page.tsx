import Link from "next/link";

const overviewCards = [
  {
    title: "Features",
    description: "Custom slots, element exclusion, responsive behavior, callbacks, and caching patterns.",
    href: "/reference/features",
  },
  {
    title: "SSR & Static Blueprints",
    description: "Generate a blueprint on the server and hand it to the runtime for an instant fast path.",
    href: "/reference/ssr",
  },
  {
    title: "Configuration",
    description: "Understand each config parameter and how it changes skeleton behavior.",
    href: "/reference/configuration",
  },
  {
    title: "Advanced",
    description: "Move from isolated examples to real workflows like forms and async data.",
    href: "/advanced",
  },
  {
    title: "Playground",
    description: "Build and test custom configs with live preview before production rollout.",
    href: "/config-playground",
  },
];

export default function ReferenceOverview() {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-bold text-white light:text-zinc-900">SkelCore Reference</h1>
      <p className="mb-8 text-lg text-zinc-500 light:text-zinc-600">
        Comprehensive guides for every core feature, integration pattern, and configuration path.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {overviewCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-indigo-500/50 light:border-zinc-200 light:bg-zinc-100 light:hover:border-indigo-300"
          >
            <h2 className="mb-2 text-lg font-bold text-white light:text-zinc-900">{card.title}</h2>
            <p className="text-sm text-zinc-500 light:text-zinc-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
