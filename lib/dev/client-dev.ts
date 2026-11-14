/** Client-visible dev tools (panel, spend tracking). */
export function isClientDevToolsEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  return process.env.NEXT_PUBLIC_ENABLE_DEV_TOOLS === "true";
}
