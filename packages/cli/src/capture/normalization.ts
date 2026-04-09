import type { Blueprint, BlueprintManifest, BlueprintNode, ManifestEntry } from "@ghostframes/core";

/**
 * Canonical normalization rules for deterministic manifest generation.
 * Removes entropy while preserving semantic content.
 */

export function normalizeManifestEntry(entry: ManifestEntry): ManifestEntry {
  return {
    ...entry,
    generatedAt: 0,
    quality: {
      ...entry.quality,
      warnings: [...entry.quality.warnings].sort(),
    },
    blueprint: normalizeBlueprint(entry.blueprint),
  };
}

export function normalizeBlueprint(blueprint: Blueprint): Blueprint {
  return {
    ...blueprint,
    generatedAt: 0,
    nodes: normalizeNodeArray(blueprint.nodes),
    rootWidth: canonicalizeNumber(blueprint.rootWidth),
    rootHeight: canonicalizeNumber(blueprint.rootHeight),
  };
}

export function normalizeNodeArray(nodes: BlueprintNode[]): BlueprintNode[] {
  return [...nodes]
    .map((node) => normalizeNode(node))
    .sort((left, right) => {
      const keyLeft = left.slotKey ?? left.id;
      const keyRight = right.slotKey ?? right.id;
      return keyLeft.localeCompare(keyRight);
    });
}

export function normalizeNode(node: BlueprintNode): BlueprintNode {
  return {
    ...node,
    width: canonicalizeNumber(node.width),
    height: canonicalizeNumber(node.height),
    top: canonicalizeNumber(node.top),
    left: canonicalizeNumber(node.left),
    layout: normalizeObject(node.layout),
    text: node.text ? normalizeObject(node.text) : node.text,
    children: normalizeNodeArray(node.children),
  };
}

export function canonicalizeNumber(value: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return value;
  }

  return Math.round(value * 1000) / 1000;
}

function normalizeObject<T extends Record<string, unknown>>(value: T): T {
  const normalizedEntries = Object.entries(value)
    .map(([key, entryValue]) => [key, normalizeValue(entryValue)] as const)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));

  return Object.fromEntries(normalizedEntries) as T;
}

function normalizeValue(value: unknown): unknown {
  if (typeof value === "number") {
    return canonicalizeNumber(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item));
  }

  if (value && typeof value === "object") {
    return normalizeObject(value as Record<string, unknown>);
  }

  return value;
}

export function normalizeManifest(manifest: BlueprintManifest): BlueprintManifest {
  return {
    ...manifest,
    build: {
      ...manifest.build,
      builtAt: 0,
    },
    entries: Object.fromEntries(
      Object.entries(manifest.entries)
        .sort(([keyLeft], [keyRight]) => keyLeft.localeCompare(keyRight))
        .map(([key, entry]) => [key, normalizeManifestEntry(entry)])
    ),
  };
}

/**
 * Compare two manifests for structural changes.
 * Returns list of diffs that are expected vs unexpected.
 */
export function classifyManifestDiffs(
  old: BlueprintManifest,
  new_: BlueprintManifest,
  expectedChangedKeys: Set<string> = new Set()
): Array<{ key: string; field: string; classification: "expected" | "unexpected" }> {
  const diffs: Array<{ key: string; field: string; classification: "expected" | "unexpected" }> =
    [];

  const oldEntries = old.entries ?? {};
  const newEntries = new_.entries ?? {};

  const allKeys = new Set([...Object.keys(oldEntries), ...Object.keys(newEntries)]);

  for (const key of allKeys) {
    const oldEntry = oldEntries[key];
    const newEntry = newEntries[key];

    if (!oldEntry && newEntry) {
      diffs.push({
        key,
        field: "entry",
        classification: expectedChangedKeys.has(key) ? "expected" : "unexpected",
      });
      continue;
    }

    if (oldEntry && !newEntry) {
      diffs.push({
        key,
        field: "entry",
        classification: expectedChangedKeys.has(key) ? "expected" : "unexpected",
      });
      continue;
    }

    if (oldEntry && newEntry) {
      const oldJson = JSON.stringify(oldEntry);
      const newJson = JSON.stringify(newEntry);

      if (oldJson !== newJson) {
        diffs.push({
          key,
          field: "content",
          classification: expectedChangedKeys.has(key) ? "expected" : "unexpected",
        });
      }
    }
  }

  return diffs;
}
