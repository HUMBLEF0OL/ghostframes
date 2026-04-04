# skelcore
Zero config skeleton loaders for React.

## Installation

```bash
pnpm add @skelcore/skelcore
```

```ts
import { AutoSkeleton } from "@skelcore/skelcore";
import { generateStaticBlueprint } from "@skelcore/skelcore/runtime";
```

## Build-Time Capture (Phase 3 MVP)

Generate demo manifest artifacts with:

```bash
pnpm capture:demo
```

This command runs `skelcore capture` with `apps/demo/skelcore.capture.config.mjs` and emits:

- `apps/demo/lib/skelcore/generated/manifest.json`
- `apps/demo/lib/skelcore/generated/manifest-loader.ts`
- `apps/demo/lib/skelcore/generated/capture-report.txt`

## CI Quality Gates

Run the full quality gate locally with:

```bash
pnpm quality:gate
```

This executes:

- `skelcore validate` to enforce schema, required key coverage derived from the captured manifest entries, invalid-entry budget, and artifact size.
- `skelcore diff` to produce deterministic drift output. In CI, pull requests diff the candidate manifest against the base branch snapshot.
- `skelcore report` to aggregate human/json outputs for CI.

Artifacts are written to `.tmp/skelcore/`.
