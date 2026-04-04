import { globalRolloutCollector } from "@skelcore/core";
import type { RolloutEnvironment } from "@skelcore/core";

export interface SafetyGateConfig {
    maxRollbacksInWindow: number;
    windowDurationMs: number;
    errorRateThreshold: number;
}

export interface SafetyCheckInput {
    environment: RolloutEnvironment;
    routeKey: string;
    errorRate: number;
    p99LatencyMs: number;
}

export interface SafetyGateDecision {
    allowed: boolean;
    reason: string;
}

export class RolloutDecisionGate {
    constructor(private config: SafetyGateConfig) { }

    checkSafetyGates(input: SafetyCheckInput): SafetyGateDecision {
        // Check error rate
        if (input.errorRate > this.config.errorRateThreshold) {
            return {
                allowed: false,
                reason: `error-rate-${(input.errorRate * 100).toFixed(2)}%-exceeds-threshold`,
            };
        }

        // Check rollback frequency in window
        const now = Date.now();
        const windowStart = now - this.config.windowDurationMs;
        const recentRollbacks = globalRolloutCollector
            .getEventsByEnvironment(input.environment)
            .filter(
                (e) =>
                    e.type === "rollback-triggered" &&
                    e.timestamp >= windowStart &&
                    e.timestamp <= now
            );

        if (recentRollbacks.length >= this.config.maxRollbacksInWindow) {
            return {
                allowed: false,
                reason: `rollback-limit-${this.config.maxRollbacksInWindow}-exceeded-in-${this.config.windowDurationMs}ms`,
            };
        }

        return {
            allowed: true,
            reason: "all-safety-gates-passed",
        };
    }
}
