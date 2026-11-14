/** Server-only dev affordances (model override, extra response fields). */
export function isServerDevToolsEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  return process.env.ENABLE_DEV_TOOLS === "true";
}
