import type { ManifestEntry } from "@skelcore/core";

export interface CliIo {
    log: (message: string) => void;
    error: (message: string) => void;
}

export interface CaptureConfig {
    baseUrl: string;
    routes: string[];
    breakpoints: number[];
    viewportHeight: number;
    outputDir: string;
    manifestFileName: string;
    loaderFileName: string;
    selector: string;
    waitForMs: number;
    retries: number;
}

export interface CapturedArtifact {
    key: string;
    entry: ManifestEntry;
}

export interface CaptureRunResult {
    ok: boolean;
    artifacts: CapturedArtifact[];
    fatalError?: string;
}

export interface CaptureReport {
    routesVisited: number;
    breakpoints: number[];
    targetsDiscovered: number;
    artifactsEmitted: number;
}