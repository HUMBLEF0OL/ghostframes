#!/usr/bin/env node

import { pathToFileURL } from "node:url";
import { runCaptureCommand } from "./commands/capture-command";
import type { CliIo } from "./types";

const defaultIo: CliIo = {
  log: (message) => console.log(message),
  error: (message) => console.error(message),
};

export async function runCli(argv: string[], io: CliIo = defaultIo): Promise<number> {
  const [command, ...rest] = argv;
  if (!command || command === "capture") {
    return runCaptureCommand(rest, io);
  }

  io.error(`Unknown command: ${command}`);
  io.error("Supported commands: capture");
  return 1;
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (invokedUrl === import.meta.url) {
  runCli(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}

export type { CaptureConfig, CliIo } from "./types";
