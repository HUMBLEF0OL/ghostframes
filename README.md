# skelcore
Zero config skeleton loaders for React.

## Build-Time Capture (Phase 3 MVP)

Generate demo manifest artifacts with:

```bash
pnpm capture:demo
```

This command runs `skelcore capture` with `apps/demo/skelcore.capture.config.mjs` and emits:

- `apps/demo/lib/skelcore/generated/manifest.json`
- `apps/demo/lib/skelcore/generated/manifest-loader.ts`
- `apps/demo/lib/skelcore/generated/capture-report.txt`
