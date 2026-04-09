import { describe, expect, it } from "vitest";
import { isCliDirectInvocationPath } from "../index";

describe("isCliDirectInvocationPath", () => {
  it("matches cli index entrypoints", () => {
    expect(isCliDirectInvocationPath("/repo/packages/cli/dist/index.js")).toBe(true);
    expect(isCliDirectInvocationPath("/repo/packages/cli/dist/index.cjs")).toBe(true);
  });

  it("matches packaged runtime build entrypoints", () => {
    expect(isCliDirectInvocationPath("/repo/packages/ghostframes/dist/build.js")).toBe(true);
    expect(isCliDirectInvocationPath("/repo/packages/ghostframes/dist/build.cjs")).toBe(true);
  });

  it("rejects non-entry files", () => {
    expect(isCliDirectInvocationPath("/repo/packages/ghostframes/dist/runtime.js")).toBe(false);
    expect(isCliDirectInvocationPath("/repo/packages/ghostframes/dist/chunk-ABC123.js")).toBe(
      false
    );
  });
});
