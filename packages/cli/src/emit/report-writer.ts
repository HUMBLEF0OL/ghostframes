import type { CaptureConfig, CaptureReport, CapturedArtifact } from "../types";

export function buildCaptureReport(
  config: CaptureConfig,
  artifacts: CapturedArtifact[]
): CaptureReport {
  return {
    routesVisited: config.routes.length,
    breakpoints: config.breakpoints,
    targetsDiscovered: artifacts.length,
    artifactsEmitted: artifacts.length,
  };
}

export function renderCaptureReport(report: CaptureReport): string {
  return [
    "Skelcore Capture Report",
    `Routes visited: ${report.routesVisited}`,
    `Breakpoints: ${report.breakpoints.join(", ")}`,
    `Targets discovered: ${report.targetsDiscovered}`,
    `Artifacts emitted: ${report.artifactsEmitted}`,
    "",
  ].join("\n");
}
