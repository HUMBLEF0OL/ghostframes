import { describe, expect, it, vi } from "vitest";
import { runCli } from "../index";
import { runCaptureCommand } from "../commands/capture-command";

describe("runCli", () => {
    it("returns non-zero for unknown command", async () => {
        const exitCode = await runCli(["unknown"], {
            log: vi.fn(),
            error: vi.fn(),
        });

        expect(exitCode).toBe(1);
    });

    it("returns 1 when capture run fails", async () => {
        const exitCode = await runCaptureCommand(
            ["--config", "../../apps/demo/skelcore.capture.config.mjs", "--baseUrl", "http://localhost:3999"],
            {
                log: vi.fn(),
                error: vi.fn(),
            },
            {
                runCapture: vi.fn().mockResolvedValue({
                    ok: false,
                    artifacts: [],
                    fatalError: "connection refused",
                }),
            }
        );

        expect(exitCode).toBe(1);
    });
});