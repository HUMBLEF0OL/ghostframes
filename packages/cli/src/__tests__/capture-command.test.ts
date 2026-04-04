import { describe, expect, it, vi } from "vitest";
import { runCli } from "../index";
import { runCaptureCommand } from "../commands/capture-command";

describe("runCli", () => {
  it("returns non-zero for unknown command", async () => {
    const io = {
      log: vi.fn(),
      error: vi.fn(),
    };

    const exitCode = await runCli(["unknown"], {
      log: io.log,
      error: io.error,
    });

    expect(exitCode).toBe(1);
    expect(io.error).toHaveBeenCalledWith("Supported commands: capture, validate, diff, report");
  });

  it("returns 1 when capture run fails", async () => {
    const exitCode = await runCaptureCommand(
      [
        "--config",
        "../../apps/demo/skelcore.capture.config.mjs",
        "--baseUrl",
        "http://localhost:3999",
      ],
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
