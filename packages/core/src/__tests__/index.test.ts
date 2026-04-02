import { describe, it, expect } from "vitest";
import * as core from "../index.js";

describe("core index exports", () => {
  it("exports DEFAULT_CONFIG", () => {
    expect(core.DEFAULT_CONFIG).toBeDefined();
    expect(core.DEFAULT_CONFIG.animation).toBe("shimmer");
  });

  it("exports key runtime APIs", () => {
    expect(typeof core.inferRole).toBe("function");
    expect(typeof core.generateStaticBlueprint).toBe("function");
    expect(typeof core.generateDynamicBlueprint).toBe("function");
    expect(typeof core.computeStructuralHash).toBe("function");
    expect(typeof core.djb2).toBe("function");
    expect(typeof core.animationSystem).toBe("object");
    expect(typeof core.AnimationSystem).toBe("function");
    expect(typeof core.blueprintCache.get).toBe("function");
    expect(typeof core.blueprintCache.set).toBe("function");
    expect(typeof core.blueprintCache.invalidate).toBe("function");
  });

  it("exports STATIC_DEFAULTS with expected shape", () => {
    expect(core.STATIC_DEFAULTS).toBeDefined();
    expect(typeof core.STATIC_DEFAULTS.text.width).toBe("number");
    expect(typeof core.STATIC_DEFAULTS.text.height).toBe("number");
  });
});
