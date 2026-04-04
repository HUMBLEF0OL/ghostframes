"use client";

import React from "react";
import { SkelcoreProvider } from "@skelcore/react";
import { ThemeProvider } from "../lib/theme-context";
import generatedManifest from "../lib/skelcore/generated/manifest-loader";

export function ClientProviders({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    return (
        <ThemeProvider>
            <SkelcoreProvider manifest={generatedManifest} policy={{ mode: "hybrid" }}>
                {children}
            </SkelcoreProvider>
        </ThemeProvider>
    );
}
