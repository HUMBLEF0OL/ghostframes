import { describe, expect, it } from "vitest";
import { parseManifest } from "@skelcore/core";
import { buildManifestDocument } from "../emit/manifest-writer";

describe("buildManifestDocument", () => {
  it("produces manifest v1 accepted by parseManifest", () => {
    const manifest = buildManifestDocument({
      packageVersion: "0.1.0",
      appVersion: "demo",
      captureResults: [],
    });

    const parsed = parseManifest(manifest);
    expect(parsed.success).toBe(true);
  });
});
