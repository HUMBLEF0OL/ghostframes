import { describe, it, expect } from "vitest";
import {
    DEFAULT_RESOLUTION_POLICY,
    type ResolutionEvent,
    type ResolutionSource,
} from "../resolution-types.js";
import { resolveBlueprint, validatePrecomputed } from "../resolver.js";
import type { BlueprintManifest } from "@skelcore/core";

describe("resolution-types", () => {
    it("exposes runtime-only default policy", () => {
        expect(DEFAULT_RESOLUTION_POLICY.mode).toBe("runtime-only");
    });

    it("allows all declared source tags", () => {
        const source: ResolutionSource = "dynamic";
        const event: ResolutionEvent = {
            source,
            policyMode: "runtime-only",
            usedFallback: false,
            reason: "dynamic-default",
            timestamp: Date.now(),
        };
        expect(event.source).toBe("dynamic");
    });
});

describe("resolver", () => {
    it("prefers explicit blueprint over runtime path", () => {
        const blueprint = {
            version: 1,
            rootWidth: 10,
            rootHeight: 10,
            nodes: [],
            generatedAt: Date.now(),
            source: "static" as const,
        };

        const result = resolveBlueprint({ externalBlueprint: blueprint });
        expect(result.blueprint).toBe(blueprint);
        expect(result.event.source).toBe("explicit");
    });

    it("returns dynamic resolver intent by default", () => {
        const result = resolveBlueprint({});
        expect(result.blueprint).toBeNull();
        expect(result.event.source).toBe("dynamic");
        expect(result.event.policyMode).toBe("runtime-only");
    });

    it("accepts candidate validation as no-op in phase 1", () => {
        expect(validatePrecomputed(null, {}).valid).toBe(false);
    });
});

describe("resolver with manifest support", () => {
    const mockManifest: BlueprintManifest = {
        manifestVersion: 1,
        packageVersion: "0.1.0",
        build: { builtAt: Date.now(), appVersion: "1.0.0" },
        defaults: { ttlMs: 86400000 },
        entries: {
            MyComponent: {
                key: "MyComponent",
                blueprint: {
                    version: 1,
                    rootWidth: 200,
                    rootHeight: 100,
                    nodes: [],
                    generatedAt: Date.now(),
                    source: "dynamic",
                },
                structuralHash: "current_hash" as unknown as any,
                generatedAt: Date.now(),
                ttlMs: 86400000,
                quality: { confidence: 0.95, warnings: [] },
            },
        },
    };

    const mockDynamicBlueprint = {
        version: 1,
        rootWidth: 200,
        rootHeight: 100,
        nodes: [],
        generatedAt: Date.now(),
        source: "dynamic" as const,
    };

    it("prefers explicit blueprint over manifest", () => {
        const explicit = { ...mockDynamicBlueprint, source: "static" as const };
        const result = resolveBlueprint({
            externalBlueprint: explicit,
            manifest: mockManifest,
            skeletonKey: "MyComponent",
            policyOverride: { mode: "hybrid", strict: false },
        });
        expect(result.event.source).toBe("explicit");
        expect(result.blueprint).toEqual(explicit);
    });

    it("checks manifest when no explicit blueprint provided", () => {
        const result = resolveBlueprint({
            manifest: mockManifest,
            skeletonKey: "MyComponent",
            policyOverride: { mode: "hybrid", strict: false },
            structuralHash: "current_hash",
        });
        expect(result.event.source).toBe("manifest");
        expect(result.blueprint?.rootWidth).toBe(200);
    });

    it("falls back to dynamic when manifest lookup fails", () => {
        const result = resolveBlueprint({
            manifest: mockManifest,
            skeletonKey: "UnknownComponent",
            policyOverride: { mode: "hybrid", strict: false },
        });
        expect(result.event.source).toBe("dynamic");
        expect(result.blueprint).toBeNull();
    });

    it("skips manifest in runtime-only mode", () => {
        const result = resolveBlueprint({
            manifest: mockManifest,
            skeletonKey: "MyComponent",
            policyOverride: { mode: "runtime-only", strict: false },
        });
        expect(result.event.source).toBe("dynamic");
    });

    it("enforces strict manifest in precomputed-only mode", () => {
        const result = resolveBlueprint({
            manifest: mockManifest,
            skeletonKey: "MyComponent",
            policyOverride: { mode: "precomputed-only", strict: false },
            structuralHash: "current_hash",
        });
        expect(result.event.source).toBe("manifest");
    });

    it("returns placeholder when precomputed-only and manifest fails", () => {
        const result = resolveBlueprint({
            manifest: mockManifest,
            skeletonKey: "UnknownComponent",
            policyOverride: { mode: "precomputed-only", strict: false },
        });
        expect(result.event.source).toBe("placeholder");
        expect(result.blueprint).toBeNull();
    });
});
