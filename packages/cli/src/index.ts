#!/usr/bin/env node
import { runCaptureCommand } from "./commands/capture-command";
import { runDiffCommand } from "./commands/diff-command";
import { runReportCommand } from "./commands/report-command";
import { runRolloutCommand } from "./commands/rollout-command";
import { runValidateCommand } from "./commands/validate-command";
import type { CliIo } from "./types";

const defaultIo: CliIo = {
  log: (message) => console.log(message),
  error: (message) => console.error(message),
};

const DIRECT_INVOCATION_PATH_RE = /[\\/]dist[\\/](index|build)\.(js|cjs)$/;

export function isCliDirectInvocationPath(invokedPath: string): boolean {
  return DIRECT_INVOCATION_PATH_RE.test(invokedPath);
}

export async function runCli(argv: string[], io: CliIo = defaultIo): Promise<number> {
  const [command, ...rest] = argv;

  switch (command) {
    case undefined:
    case "capture":
      return runCaptureCommand(rest, io);
    case "validate":
      return runValidateCommand(rest, io);
    case "diff":
      return runDiffCommand(rest, io);
    case "report":
      return runReportCommand(rest, io);
    case "rollout":
      return runRolloutCommand(rest, io);
    default:
      io.error(`Unknown command: ${command}`);
      io.error("Supported commands: capture, validate, diff, report, rollout");
      return 1;
  }
}

const invokedPath = process.argv[1] ?? "";
const isDirectInvocation =
  (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) ||
  isCliDirectInvocationPath(invokedPath);

if (isDirectInvocation) {
  runCli(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}

export type { CaptureConfig, CliIo } from "./types";
