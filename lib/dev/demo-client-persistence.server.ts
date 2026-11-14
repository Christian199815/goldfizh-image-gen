import "server-only";

import fs from "node:fs";
import path from "node:path";

import { isServerDevToolsEnabled } from "@/lib/dev/server-dev";

const DEV_STATE_DIR = path.join(process.cwd(), ".local");
const DEV_CLIENT_FILE = path.join(DEV_STATE_DIR, "demo-client.json");

export function readPersistedDemoClientId(): string | null {
  if (!isServerDevToolsEnabled()) {
    return null;
  }
  try {
    const raw = fs.readFileSync(DEV_CLIENT_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "clientId" in parsed &&
      typeof (parsed as { clientId: unknown }).clientId === "string"
    ) {
      const clientId = (parsed as { clientId: string }).clientId.trim();
      return clientId || null;
    }
  } catch {
    return null;
  }
  return null;
}

export function writePersistedDemoClientId(clientId: string): void {
  fs.mkdirSync(DEV_STATE_DIR, { recursive: true });
  fs.writeFileSync(
    DEV_CLIENT_FILE,
    `${JSON.stringify({ clientId }, null, 2)}\n`,
    "utf8",
  );
}

export function clearPersistedDemoClientId(): void {
  try {
    fs.unlinkSync(DEV_CLIENT_FILE);
  } catch {
    // missing file
  }
}
