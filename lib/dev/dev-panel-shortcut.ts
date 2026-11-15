/** Modifier+Shift+D — open dev panel (Mac: ⌘⇧D, Windows/Linux: Ctrl+Shift+D). */
export function isDevPanelKeyboardShortcut(event: KeyboardEvent): boolean {
  if (!(event.metaKey || event.ctrlKey) || !event.shiftKey) {
    return false;
  }
  if (event.key.toLowerCase() !== "d" || event.altKey) {
    return false;
  }
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return true;
  }
  if (target.isContentEditable) {
    return false;
  }
  const tag = target.tagName;
  return tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT";
}