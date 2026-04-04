"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SkelcoreProvider } from "@skelcore/react";
import { ThemeProvider } from "../lib/theme-context";
import generatedManifest from "../lib/skelcore/generated/manifest-loader";

export function ClientProviders({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    const pathname = usePathname();
    const shadowEnabled = process.env.NEXT_PUBLIC_SKEL_SHADOW_TELEMETRY === "true";
    const allowedPrefixes = (process.env.NEXT_PUBLIC_SKEL_SHADOW_PATHS ?? "")
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean);

    const isShadowRoute =
        shadowEnabled &&
        allowedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

    const policy = isShadowRoute
        ? { mode: "hybrid" as const, shadowTelemetryOnly: true }
        : { mode: "hybrid" as const };

    return (
        <ThemeProvider>
            <SkelcoreProvider manifest={generatedManifest} policy={policy}>
                {children}
            </SkelcoreProvider>
        </ThemeProvider>
    );
}
