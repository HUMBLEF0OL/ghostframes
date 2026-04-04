import type { Blueprint, BlueprintManifest, ManifestEntryValidationResult } from "@skelcore/core";

export type ResolutionPolicyMode =
  | "runtime-only"
  | "hybrid"
  | "precomputed-only"
  | "strict-precomputed";

export type ResolutionSource =
  | "explicit"
  | "manifest"
  | "compatible-manifest"
  | "memory"
  | "session"
  | "dynamic"
  | "placeholder";

export type ManifestResolutionSource = Extract<
  ResolutionSource,
  "manifest" | "compatible-manifest" | "memory" | "session"
>;

export interface ResolutionPolicy {
  mode: ResolutionPolicyMode;
  strict: boolean;
}

export interface ResolverContext {
  skeletonKey?: string;
  externalBlueprint?: Blueprint;
  policyOverride?: Partial<ResolutionPolicy>;
  /** Precomputed manifest for manifest-based resolution */
  manifest?: BlueprintManifest;
  /** Current structural hash of the DOM for validation */
  structuralHash?: string;
  /** Current timestamp for TTL validation (defaults to Date.now()) */
  now?: number;
}

export interface ResolutionEvent {
  source: ResolutionSource;
  policyMode: ResolutionPolicyMode;
  usedFallback: boolean;
  reason: string;
  timestamp: number;
  /** Manifest-specific validation details if source is manifest-related */
  manifestValidation?: ManifestEntryValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface ResolutionResult {
  blueprint: Blueprint | null;
  event: ResolutionEvent;
}

export const DEFAULT_RESOLUTION_POLICY: ResolutionPolicy = {
  mode: "runtime-only",
  strict: false,
};
