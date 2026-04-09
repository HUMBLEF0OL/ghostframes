import { CodeBlock, FeatureCard } from "../../../lib/demo-components";

const installCommands = `# Install the single published package
pnpm add @ghostframes/runtime

# Use the runtime surface in your app
import { AutoSkeleton, GhostframesProvider } from "@ghostframes/runtime";`;

const buildScripts = `{
  "scripts": {
    "skeleton:generate": "ghostframes capture --config ghostframes.capture.config.mjs",
    "skeleton:validate": "ghostframes validate --manifest .ghostframes/generated/manifest.json --json-out .ghostframes/validate.json",
    "prebuild": "pnpm skeleton:generate",
    "build": "next build"
  }
}`;

const artifactPaths = `# Build-time artifacts produced by the consumer app
.ghostframes/generated/manifest.json
.ghostframes/generated/manifest-loader.ts
.ghostframes/validate.json
.ghostframes/diff.json
.ghostframes/report.json`;

const runtimeExample = `import { AutoSkeleton, GhostframesProvider } from "@ghostframes/runtime";
import generatedManifest from "../.ghostframes/generated/manifest-loader";

export function AppShell({ loading }: { loading: boolean }) {
  return (
    <GhostframesProvider manifest={generatedManifest} policy={{ mode: "hybrid" }}>
      <AutoSkeleton loading={loading} skeletonKey="ProductCard">
        <ProductCard />
      </AutoSkeleton>
    </GhostframesProvider>
  );
}`;

const flowSummary = `1. Install @ghostframes/runtime in the consumer app.
2. Run skeleton:generate and skeleton:validate before the app build.
3. Ship the generated manifest and loader with the app bundle.
4. Let AutoSkeleton resolve from the manifest first, then fall back only when needed.`;

export default function GettingStartedReferencePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="mb-2 text-4xl font-bold text-white light:text-zinc-900">Getting Started</h1>
        <p className="text-lg text-zinc-500 light:text-zinc-600">
          Consumer-first guide for installing the runtime package, generating artifacts at build
          time, and letting AutoSkeleton use them at runtime.
        </p>
      </header>

      <FeatureCard
        title="1. Install the runtime package"
        description="Use the single published package in your app"
        badge="Runtime"
      >
        <CodeBlock code={installCommands} language="bash" />
      </FeatureCard>

      <FeatureCard
        title="2. Add build-time generation commands"
        description="Keep the consumer surface to generation plus validation"
        badge="Build time"
      >
        <CodeBlock code={buildScripts} language="json" />
      </FeatureCard>

      <FeatureCard
        title="3. Ship the generated artifacts"
        description="The app deploys the manifest and loader, not the expensive generation pipeline"
        badge="Deploy"
      >
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 light:text-zinc-600">
            The consumer app should bundle the generated files alongside the app so runtime only
            needs to read and resolve them.
          </p>
          <CodeBlock code={artifactPaths} language="bash" />
        </div>
      </FeatureCard>

      <FeatureCard
        title="4. Wire AutoSkeleton at runtime"
        description="Provide the generated manifest once, then render by skeleton key"
        badge="Runtime"
      >
        <div className="space-y-4">
          <ul className="space-y-2 text-sm text-zinc-500 light:text-zinc-600">
            <li>GhostframesProvider makes the manifest available to the tree.</li>
            <li>AutoSkeleton resolves the matching blueprint by skeletonKey.</li>
            <li>When the manifest has a hit, the precomputed skeleton renders immediately.</li>
            <li>
              When it misses or is invalid, AutoSkeleton falls back to live measurement or the
              configured fallback path.
            </li>
          </ul>
          <CodeBlock code={runtimeExample} language="tsx" />
        </div>
      </FeatureCard>

      <FeatureCard
        title="Minimal consumer contract"
        description="The recommended public surface stays small"
        badge="2 commands"
      >
        <ul className="space-y-2 text-sm text-zinc-500 light:text-zinc-600">
          <li>
            <span className="font-semibold text-white light:text-zinc-900">skeleton:generate</span>{" "}
            creates the manifest and loader during prebuild or CI.
          </li>
          <li>
            <span className="font-semibold text-white light:text-zinc-900">skeleton:validate</span>{" "}
            gates the generated output before deployment.
          </li>
          <li>
            <span className="font-semibold text-white light:text-zinc-900">build</span> remains the
            app build only and should not own capture logic.
          </li>
          <li>
            <span className="font-semibold text-white light:text-zinc-900">report</span> stays
            optional for deeper CI diagnostics or debugging sessions.
          </li>
        </ul>
      </FeatureCard>

      <FeatureCard
        title="End-to-end flow"
        description="One view of the full consumer app lifecycle"
        badge="Checklist"
      >
        <CodeBlock code={flowSummary} language="text" />
      </FeatureCard>
    </div>
  );
}
