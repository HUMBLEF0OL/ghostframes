# @ghostframe/runtime

> Unified runtime package that re-exports the React facade and CLI entry points.

[![npm version](https://img.shields.io/npm/v/@ghostframe/runtime)](https://www.npmjs.com/package/@ghostframe/runtime)
[![license](https://img.shields.io/npm/l/@ghostframe/runtime)](../../LICENSE)

`@ghostframe/runtime` is the package to install in application projects. It re-exports the React APIs from `@ghostframe/react` and ships a `ghostframe` CLI binary for capture/report workflows.

## Installation

```bash
# npm
npm install @ghostframe/runtime

# pnpm
pnpm add @ghostframe/runtime

# yarn
yarn add @ghostframe/runtime
```

## React Usage

```tsx
import { AutoSkeleton } from "@ghostframe/runtime";

function UserCard({ loading }: { loading: boolean }) {
  return (
    <AutoSkeleton loading={loading}>
      <article>
        <h2>Profile</h2>
        <p>Runtime facade over @ghostframe/react.</p>
      </article>
    </AutoSkeleton>
  );
}
```

## CLI Usage

The package exposes a `ghostframe` command:

```bash
ghostframe capture --config ghostframe.capture.config.mjs
ghostframe validate --manifest .ghostframe/generated/manifest.json --json-out .ghostframe/validate.json
ghostframe report --validate-json .ghostframe/validate.json --diff-json .ghostframe/diff.json
```

Run these commands in order in your consumer app:

1. `capture`: visits routes in your config and generates Ghostframe artifacts.
2. `validate`: checks the generated manifest for schema and quality thresholds.
3. `report`: combines machine-readable outputs (validate/diff) into a CI-friendly summary.

### What Each Command Needs

- `ghostframe capture --config <path-to-capture-config>`
  - Use when: creating or refreshing generated artifacts.
  - Requires: a capture config and a running app at the configured base URL.
  - Produces: manifest and related generated files (for example under `.ghostframe/generated/`).

- `ghostframe validate --manifest <path-to-manifest> --json-out <path-to-validate-json>`
  - Use when: enforcing manifest quality gates.
  - Requires: a manifest file produced by `capture`.
  - Produces: terminal output plus JSON output used by `report`.

- `ghostframe report --validate-json <path-to-validate-json> --diff-json <path-to-diff-json>`
  - Use when: creating one final quality report for local checks or CI.
  - Requires: validate JSON and (optionally, if your workflow includes diff checks) diff JSON.
  - Produces: consolidated text/json report output.

## Related Packages

- `@ghostframe/react`: React components and hooks.
- `@ghostframe/core`: framework-agnostic blueprint and analyzer engine.
- `@ghostframe/cli`: low-level CLI implementation used by the runtime binary.
