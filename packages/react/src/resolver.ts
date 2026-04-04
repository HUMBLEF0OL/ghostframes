import type { Blueprint } from "@skelcore/core";
import {
  DEFAULT_RESOLUTION_POLICY,
  type ResolverContext,
  type ResolutionResult,
  type ValidationResult,
} from "./resolution-types";
import { resolveManifestEntry } from "./manifest-resolver";

export function validatePrecomputed(
  candidate: Blueprint | null,
  _context: ResolverContext
): ValidationResult {
  if (!candidate) return { valid: false, reason: "missing-candidate" };
  return { valid: true };
}

export function resolveBlueprint(context: ResolverContext): ResolutionResult {
  const policyMode = context.policyOverride?.mode ?? DEFAULT_RESOLUTION_POLICY.mode;
  const strict = context.policyOverride?.strict ?? DEFAULT_RESOLUTION_POLICY.strict;
  const shadowTelemetryOnly =
    policyMode === "hybrid" && context.policyOverride?.shadowTelemetryOnly === true;

  // 1. EXPLICIT: provided blueprint always wins
  if (context.externalBlueprint) {
    return {
      blueprint: context.externalBlueprint,
      event: {
        source: "explicit",
        policyMode,
        usedFallback: false,
        reason: "external-blueprint",
        timestamp: Date.now(),
      },
    };
  }

  // 2. MANIFEST: check precomputed if policy allows and manifest is provided
  if (
    context.manifest &&
    context.skeletonKey &&
    (policyMode === "hybrid" ||
      policyMode === "precomputed-only" ||
      policyMode === "strict-precomputed")
  ) {
    const manifestResult = resolveManifestEntry(context.manifest, context.skeletonKey, {
      structuralHash: context.structuralHash,
      now: context.now,
      strictStyleDrift: strict,
    });

    if (shadowTelemetryOnly) {
      if (manifestResult.accepted) {
        return {
          blueprint: null,
          event: {
            source: "dynamic",
            policyMode,
            usedFallback: false,
            reason: "shadow-hit",
            timestamp: Date.now(),
            candidateSource: "manifest",
            manifestValidation: {
              valid: true,
              entry: manifestResult.entry,
            },
          },
        };
      }

      const rejectionReason = manifestResult.reason ?? "unknown-rejection";
      const isMiss = /not found|no-skeleton-key|no-manifest/i.test(rejectionReason);

      return {
        blueprint: null,
        event: {
          source: "dynamic",
          policyMode,
          usedFallback: false,
          reason: isMiss ? "shadow-miss" : `shadow-invalid: ${rejectionReason}`,
          timestamp: Date.now(),
          candidateSource: isMiss ? "none" : "manifest",
          rejectionCategory: isMiss ? "miss" : "invalid",
          rejectionReason,
        },
      };
    }

    if (manifestResult.accepted && manifestResult.entry) {
      return {
        blueprint: manifestResult.entry.blueprint,
        event: {
          source: "manifest",
          policyMode,
          usedFallback: false,
          reason: "manifest-entry-valid",
          timestamp: Date.now(),
          manifestValidation: {
            valid: true,
            entry: manifestResult.entry,
          },
        },
      };
    }

    // In strict-precomputed and precomputed-only modes, don't fall back to dynamic
    if (policyMode === "strict-precomputed" || policyMode === "precomputed-only") {
      return {
        blueprint: null,
        event: {
          source: "placeholder",
          policyMode,
          usedFallback: true,
          reason: `manifest-validation-failed: ${manifestResult.reason}`,
          timestamp: Date.now(),
        },
      };
    }
  }

  // 3. DYNAMIC: fall back to runtime measurement
  return {
    blueprint: null,
    event: {
      source: "dynamic",
      policyMode,
      usedFallback: false,
      reason: "dynamic-default",
      timestamp: Date.now(),
    },
  };
}
