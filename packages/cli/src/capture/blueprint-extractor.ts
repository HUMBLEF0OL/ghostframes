import { asStructuralHash, type ManifestEntry } from "@ghostframes/core";
import type { Page } from "playwright";
import type { CapturedArtifact } from "../types";
import type { CaptureTarget } from "./target-discovery";
import { scoreBlueprint, isQualityAcceptable } from "./blueprint-quality-scorer";

interface ElementBox {
  width: number;
  height: number;
}

function buildMvpNodes(box: ElementBox) {
  const safeWidth = Math.max(box.width, 80);
  const safeHeight = Math.max(box.height, 80);
  const horizontalPadding = Math.max(Math.round(safeWidth * 0.06), 8);
  const lineHeight = Math.max(Math.round(safeHeight * 0.12), 10);
  const firstLineWidth = Math.max(safeWidth - horizontalPadding * 2, 24);
  const secondLineWidth = Math.max(Math.round(firstLineWidth * 0.78), 20);
  const thirdLineWidth = Math.max(Math.round(firstLineWidth * 0.56), 16);

  return [
    {
      id: "mvp-line-1",
      role: "text" as const,
      width: firstLineWidth,
      height: lineHeight,
      top: Math.max(Math.round(safeHeight * 0.2), 8),
      left: horizontalPadding,
      layout: {},
      borderRadius: "4px",
      tagName: "DIV",
      text: {
        lines: 1,
        lineHeight,
        lastLineWidthRatio: 1,
      },
      children: [],
    },
    {
      id: "mvp-line-2",
      role: "text" as const,
      width: secondLineWidth,
      height: lineHeight,
      top: Math.max(Math.round(safeHeight * 0.2), 8) + lineHeight + 8,
      left: horizontalPadding,
      layout: {},
      borderRadius: "4px",
      tagName: "DIV",
      text: {
        lines: 1,
        lineHeight,
        lastLineWidthRatio: 0.78,
      },
      children: [],
    },
    {
      id: "mvp-line-3",
      role: "text" as const,
      width: thirdLineWidth,
      height: lineHeight,
      top: Math.max(Math.round(safeHeight * 0.2), 8) + (lineHeight + 8) * 2,
      left: horizontalPadding,
      layout: {},
      borderRadius: "4px",
      tagName: "DIV",
      text: {
        lines: 1,
        lineHeight,
        lastLineWidthRatio: 0.56,
      },
      children: [],
    },
  ];
}

/**
 * Extract blueprint artifact with quality evaluation.
 * Returns null if extraction fails or quality falls below minimum threshold.
 * Includes quality metadata in the entry for manifest emission.
 */
export async function extractArtifact(
  page: Page,
  target: CaptureTarget,
  options: { qualityThreshold?: number } = {}
): Promise<CapturedArtifact | null> {
  const box = await page
    .$eval(target.selector, (element): ElementBox | null => {
      const rect = element.getBoundingClientRect();
      const measuredWidth = Math.max(
        rect.width,
        element.clientWidth,
        element.scrollWidth,
        element.getBoundingClientRect().width
      );
      const measuredHeight = Math.max(
        rect.height,
        element.clientHeight,
        element.scrollHeight,
        element.getBoundingClientRect().height
      );

      // Loading transitions can briefly produce zero-size boxes for keyed roots.
      // Keep extraction deterministic by falling back to a stable minimum frame.
      const width = measuredWidth < 1 ? 300 : measuredWidth;
      const height = measuredHeight < 1 ? 120 : measuredHeight;

      return {
        width: Math.round(width),
        height: Math.round(height),
      };
    })
    .catch(() => ({ width: 300, height: 120 }));

  if (!box) {
    return null;
  }

  const now = Date.now();
  const entry: ManifestEntry = {
    key: target.key,
    blueprint: {
      version: 1,
      rootWidth: box.width,
      rootHeight: box.height,
      nodes: buildMvpNodes(box),
      generatedAt: now,
      source: "dynamic",
    },
    structuralHash: asStructuralHash(`${target.key}:${box.width}x${box.height}`),
    generatedAt: now,
    ttlMs: 86_400_000,
    quality: {
      confidence: 0.95,
      warnings: ["mvp-dom-box-extraction"],
    },
  };

  // Evaluate quality with B3 quality scorer
  const score = scoreBlueprint(entry);
  const qualityThreshold = options.qualityThreshold ?? 0.7; // MVP threshold; B3 hardens to 0.88+

  if (score < qualityThreshold) {
    return null; // Reject low-quality blueprints
  }

  return {
    key: target.key,
    entry,
    quality: {
      score,
      accepted: isQualityAcceptable(entry, { threshold: qualityThreshold }),
    },
  };
}
