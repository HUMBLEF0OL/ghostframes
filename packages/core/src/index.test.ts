import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG } from "./index";

describe("core index exports", () => {
  it("exports DEFAULT_CONFIG", () => {
    expect(DEFAULT_CONFIG).toBeDefined();
    expect(DEFAULT_CONFIG.animation).toBe("shimmer");
  });
});
