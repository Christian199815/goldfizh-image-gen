/** Keeps `document.title` and the managed `<title>` node in sync (App Router can reset the latter). */
export function applyDocumentTitle(title: string): void {
  if (typeof document === "undefined") {
    return;
  }
  const next = title.trim() || "Image generator";
  if (document.title !== next) {
    document.title = next;
  }
  const titleEl = document.querySelector("title");
  if (titleEl && titleEl.textContent !== next) {
    titleEl.textContent = next;
  }
}
