"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import {
  DEMO_CLIENT_CHANGED_EVENT,
  useDevMode,
} from "@/components/dev/DevModeProvider";
import { applyDocumentTitle } from "@/lib/client-config/apply-document-title";

import { resolveImageGeneratorPageTitle } from "./resolve-image-generator-page-title";

/**
 * Soft navigation does not always refresh root `generateMetadata`; keep the tab title
 * aligned with the dev-panel demo client and re-apply after Next commits metadata.
 */
export function ImageGeneratorDocumentTitle() {
  const devMode = useDevMode();
  const fallbackTitleRef = useRef(
    typeof document !== "undefined" ? document.title : "Image generator",
  );

  const title = useMemo(
    () =>
      resolveImageGeneratorPageTitle(
        devMode?.demoClient,
        fallbackTitleRef.current,
      ),
    [devMode?.demoClient],
  );

  const applyTitle = useCallback(() => {
    applyDocumentTitle(title);
  }, [title]);

  useLayoutEffect(() => {
    applyTitle();
  }, [applyTitle]);

  useEffect(() => {
    const titleEl = document.querySelector("title");
    if (!titleEl) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (titleEl.textContent !== title) {
        applyDocumentTitle(title);
      }
    });
    observer.observe(titleEl, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [title]);

  useEffect(() => {
    const onDemoClientChanged = () => {
      applyTitle();
      requestAnimationFrame(applyTitle);
      window.setTimeout(applyTitle, 0);
      window.setTimeout(applyTitle, 50);
    };
    window.addEventListener(DEMO_CLIENT_CHANGED_EVENT, onDemoClientChanged);
    return () => {
      window.removeEventListener(DEMO_CLIENT_CHANGED_EVENT, onDemoClientChanged);
    };
  }, [applyTitle]);

  return null;
}
