"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    GhostframesProvider,
    diffResolverTelemetryCounters,
    derivePolicyForPath,
    evaluateHybridConfidenceGate,
    getResolverTelemetryCounters,
} from "@ghostframes/runtime";
import { ThemeProvider } from "../lib/theme-context";
import generatedManifest from "../lib/ghostframes/generated/manifest-loader";

const EMPTY_COUNTERS: ReturnType<typeof getResolverTelemetryCounters> = {
    explicitHits: 0,
    manifestHits: 0,
    manifestMisses: 0,
    sessionHits: 0,
    dynamicFallbacks: 0,
    placeholderFallbacks: 0,
    invalidations: 0,
    shadowHits: 0,
    shadowMisses: 0,
    shadowInvalids: 0,
};

type TelemetrySnapshot = {
    route: string;
    timestamp: number;
    counters: {
        cumulative: ReturnType<typeof getResolverTelemetryCounters>;
        window: ReturnType<typeof getResolverTelemetryCounters>;
    };
    ratios: {
        manifestHitRatio: number;
        invalidationRate: number;
        fallbackRatio: number;
        cumulativeManifestHitRatio: number;
        cumulativeInvalidationRate: number;
    };
    gate: {
        status: "pass" | "hold" | "rollback";
        pass: boolean;
        promotionEligible: boolean;
        rollbackRecommended: boolean;
        reasons: string[];
        manifestAttempts: number;
    };
};

type TelemetrySink = {
    latest: TelemetrySnapshot | null;
    snapshots: TelemetrySnapshot[];
    getLatest: () => TelemetrySnapshot | null;
    clear: () => void;
};

declare global {
    interface Window {
        __SKEL_TELEMETRY__?: TelemetrySink;
    }
}

export function ClientProviders({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    const pathname = usePathname();
    const telemetrySinkEnabled = process.env.NEXT_PUBLIC_SKEL_TELEMETRY_SINK === "true";

    const strictEnabled = process.env.NEXT_PUBLIC_SKEL_STRICT_MODE === "true";
    const strictPrefixes = (process.env.NEXT_PUBLIC_SKEL_STRICT_PATHS ?? "")
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean);

    const serveEnabled = process.env.NEXT_PUBLIC_SKEL_SERVE_HYBRID === "true";
    const servePrefixes = (process.env.NEXT_PUBLIC_SKEL_SERVE_PATHS ?? "")
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean);
    const serveBlockPrefixes = (process.env.NEXT_PUBLIC_SKEL_SERVE_BLOCK_PATHS ?? "")
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean);

    const shadowEnabled = process.env.NEXT_PUBLIC_SKEL_SHADOW_TELEMETRY === "true";
    const allowedPrefixes = (process.env.NEXT_PUBLIC_SKEL_SHADOW_PATHS ?? "")
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean);

    const policy = derivePolicyForPath({
        pathname,
        strictEnabled,
        strictPaths: strictPrefixes,
        serveEnabled,
        servePaths: servePrefixes,
        serveBlockPaths: serveBlockPrefixes,
        shadowEnabled,
        shadowPaths: allowedPrefixes,
    });

    useEffect(() => {
        if (!telemetrySinkEnabled) {
            return;
        }

        const cumulativeCounters = getResolverTelemetryCounters();
        const sink: TelemetrySink = window.__SKEL_TELEMETRY__ ?? {
            latest: null,
            snapshots: [],
            getLatest() {
                return this.latest;
            },
            clear() {
                this.latest = null;
                this.snapshots = [];
            },
        };

        const latestForRoute = [...sink.snapshots]
            .reverse()
            .find((snapshot) => snapshot.route === pathname);
        const baselineCounters = latestForRoute?.counters.cumulative ?? EMPTY_COUNTERS;
        const windowCounters = diffResolverTelemetryCounters(cumulativeCounters, baselineCounters);
        const currentGate = evaluateHybridConfidenceGate({
            counters: windowCounters,
            previousWindowPass: latestForRoute?.gate.pass,
        });

        const windowManifestAttempts = currentGate.metrics.manifestAttempts;
        const cumulativeManifestAttempts =
            cumulativeCounters.manifestHits +
            cumulativeCounters.manifestMisses +
            cumulativeCounters.invalidations;

        const snapshot: TelemetrySnapshot = {
            route: pathname,
            timestamp: Date.now(),
            counters: {
                cumulative: cumulativeCounters,
                window: windowCounters,
            },
            ratios: {
                manifestHitRatio:
                    windowManifestAttempts > 0
                        ? windowCounters.manifestHits / windowManifestAttempts
                        : 0,
                invalidationRate:
                    windowManifestAttempts > 0
                        ? windowCounters.invalidations / windowManifestAttempts
                        : 0,
                fallbackRatio:
                    currentGate.metrics.servedCount > 0
                        ? (windowCounters.sessionHits +
                            windowCounters.dynamicFallbacks +
                            windowCounters.placeholderFallbacks) /
                        currentGate.metrics.servedCount
                        : 0,
                cumulativeManifestHitRatio:
                    cumulativeManifestAttempts > 0
                        ? cumulativeCounters.manifestHits / cumulativeManifestAttempts
                        : 0,
                cumulativeInvalidationRate:
                    cumulativeManifestAttempts > 0
                        ? cumulativeCounters.invalidations / cumulativeManifestAttempts
                        : 0,
            },
            gate: {
                status: currentGate.status,
                pass: currentGate.pass,
                promotionEligible: currentGate.promotionEligible,
                rollbackRecommended: currentGate.rollbackRecommended,
                reasons: currentGate.reasons,
                manifestAttempts: windowManifestAttempts,
            },
        };

        sink.latest = snapshot;
        sink.snapshots.push(snapshot);
        window.__SKEL_TELEMETRY__ = sink;

        console.info("[ghostframes][telemetry] resolver snapshot", snapshot);
    }, [pathname, telemetrySinkEnabled]);

    return (
        <ThemeProvider>
            <GhostframesProvider manifest={generatedManifest} policy={policy}>
                {children}
            </GhostframesProvider>
        </ThemeProvider>
    );
}
