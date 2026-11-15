"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  DEMO_CLIENT_CHANGED_EVENT,
  useDevMode,
} from "@/components/dev/DevModeProvider";
import { contextApiResponseSchema } from "@/lib/context/context-api-schema";
import { downloadGeneratedImage } from "@/lib/generation/download-generated-image";
import type { BrandColor, BrandSegment, PageListItem } from "@/types/context";
import type {
  GeneratedImage,
  GenerationErrorResponse,
  GenerationResponse,
  GenerationStatus,
  ImageGenerationInput,
} from "@/types/generation";

export type ContextLoadState = "loading" | "ready" | "error";

function revokeObjectDisplayUrl(image: GeneratedImage | null | undefined) {
  const url = image?.displayUrl;
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function generatedImageFromResponse(response: GenerationResponse): GeneratedImage {
  const { mimeType, base64, displayUrl } = response.image;

  const prompt = response.prompt;

  if (displayUrl) {
    return {
      mimeType,
      displayUrl,
      base64,
      metadata: response.metadata,
      prompt,
    };
  }

  if (!base64) {
    return { mimeType, metadata: response.metadata, prompt };
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  return {
    mimeType,
    base64,
    displayUrl: URL.createObjectURL(blob),
    metadata: response.metadata,
    prompt,
  };
}

function parseGenerationErrorBody(json: unknown): string {
  if (json && typeof json === "object" && "error" in json) {
    const message = (json as GenerationErrorResponse).error;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }
  return "Image generation failed.";
}

function isGenerationResponse(json: unknown): json is GenerationResponse {
  if (!json || typeof json !== "object") {
    return false;
  }
  const record = json as GenerationResponse;
  const image = record.image;
  if (!image || typeof image.mimeType !== "string") {
    return false;
  }
  return (
    typeof image.base64 === "string" ||
    typeof image.displayUrl === "string"
  );
}

type UseImageGenerationOptions = {
  initialPages?: PageListItem[];
  initialBrandSegments?: BrandSegment[];
  initialBrandColors?: BrandColor[];
};

function hasInitialContext(
  initialPages: PageListItem[] | undefined,
  initialBrandSegments: BrandSegment[] | undefined,
  initialBrandColors: BrandColor[] | undefined,
): boolean {
  return Boolean(
    initialPages?.length &&
      initialBrandSegments?.length &&
      initialBrandColors?.length,
  );
}

export function useImageGeneration(options?: UseImageGenerationOptions) {
  const devMode = useDevMode();
  const { initialPages, initialBrandSegments, initialBrandColors } =
    options ?? {};
  const shouldSkipInitialFetch = hasInitialContext(
    initialPages,
    initialBrandSegments,
    initialBrandColors,
  );

  const [contextLoadState, setContextLoadState] =
    useState<ContextLoadState>(() =>
      shouldSkipInitialFetch ? "ready" : "loading",
    );
  const [contextError, setContextError] = useState<string | null>(null);
  const [pages, setPages] = useState<PageListItem[]>(initialPages ?? []);
  const [brandSegments, setBrandSegments] = useState<BrandSegment[]>(
    initialBrandSegments ?? [],
  );
  const [brandColors, setBrandColors] = useState<BrandColor[]>(
    initialBrandColors ?? [],
  );

  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const lastInputRef = useRef<ImageGenerationInput | null>(null);
  const imageRef = useRef<GeneratedImage | null>(null);
  const generatingRef = useRef(false);

  const replaceImage = useCallback((next: GeneratedImage | null) => {
    revokeObjectDisplayUrl(imageRef.current);
    imageRef.current = next;
    setImage(next);
  }, []);

  const fetchContextFromApi = useCallback(async () => {
    const response = await fetch("/api/context");
    const json: unknown = await response.json();
    if (!response.ok) {
      const message =
        json &&
        typeof json === "object" &&
        "error" in json &&
        typeof (json as { error: unknown }).error === "string"
          ? (json as { error: string }).error
          : "Unable to load generator context.";
      throw new Error(message);
    }
    return contextApiResponseSchema.parse(json);
  }, []);

  const loadContext = useCallback(async () => {
    setContextLoadState("loading");
    setContextError(null);
    try {
      const parsed = await fetchContextFromApi();
      setPages(parsed.pages);
      setBrandSegments(parsed.brandSegments);
      setBrandColors(parsed.brandColors);
      setContextLoadState("ready");
    } catch (error) {
      setContextLoadState("error");
      setContextError(
        error instanceof Error
          ? error.message
          : "Unable to load generator context.",
      );
    }
  }, [fetchContextFromApi]);

  useEffect(() => {
    if (shouldSkipInitialFetch) {
      return;
    }

    let cancelled = false;

    void fetchContextFromApi()
      .then((parsed) => {
        if (cancelled) {
          return;
        }
        setPages(parsed.pages);
        setBrandSegments(parsed.brandSegments);
        setBrandColors(parsed.brandColors);
        setContextLoadState("ready");
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setContextLoadState("error");
        setContextError(
          error instanceof Error
            ? error.message
            : "Unable to load generator context.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [fetchContextFromApi, shouldSkipInitialFetch]);

  const initialContextKey = useMemo(
    () =>
      [
        initialPages?.map((page) => page.id).join(","),
        initialBrandSegments?.map((segment) => segment.id).join(","),
        initialBrandColors?.map((color) => color.hex).join(","),
      ].join("|"),
    [initialPages, initialBrandSegments, initialBrandColors],
  );

  const previousInitialContextKey = useRef<string | null>(null);

  useEffect(() => {
    if (
      !initialPages?.length ||
      !initialBrandSegments?.length ||
      !initialBrandColors?.length
    ) {
      return;
    }
    if (previousInitialContextKey.current === null) {
      previousInitialContextKey.current = initialContextKey;
      return;
    }
    if (previousInitialContextKey.current === initialContextKey) {
      return;
    }
    previousInitialContextKey.current = initialContextKey;
    setPages(initialPages);
    setBrandSegments(initialBrandSegments);
    setBrandColors(initialBrandColors);
    setContextLoadState("ready");
    setContextError(null);
  }, [
    initialContextKey,
    initialPages,
    initialBrandSegments,
    initialBrandColors,
  ]);

  useEffect(() => {
    const onDemoClientChanged = () => {
      void loadContext();
    };
    window.addEventListener(DEMO_CLIENT_CHANGED_EVENT, onDemoClientChanged);
    return () => {
      window.removeEventListener(DEMO_CLIENT_CHANGED_EVENT, onDemoClientChanged);
    };
  }, [loadContext]);

  const previousDemoClientId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const activeId = devMode?.demoClient?.activeClientId;
    if (!activeId) {
      return;
    }
    if (previousDemoClientId.current === undefined) {
      previousDemoClientId.current = activeId;
      return;
    }
    if (previousDemoClientId.current === activeId) {
      return;
    }
    previousDemoClientId.current = activeId;
    void loadContext();
  }, [devMode?.demoClient?.activeClientId, loadContext]);

  useEffect(() => {
    return () => {
      revokeObjectDisplayUrl(imageRef.current);
    };
  }, []);

  const generate = useCallback(
    async (input: ImageGenerationInput) => {
      if (generatingRef.current) {
        return;
      }

      const limitMessage = devMode?.checkLimitsBeforeGenerate() ?? null;
      if (limitMessage) {
        setStatus("failed");
        setGenerationError(limitMessage);
        return;
      }

      generatingRef.current = true;
      const devOptions = devMode?.getRequestDevOptions();
      const payload: ImageGenerationInput = devOptions
        ? { ...input, dev: devOptions }
        : input;
      lastInputRef.current = input;
      setStatus("generating");
      setGenerationError(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json: unknown = await response.json();

        if (!response.ok) {
          throw new Error(parseGenerationErrorBody(json));
        }

        if (!isGenerationResponse(json)) {
          throw new Error("No image was returned. Try generating again.");
        }

        replaceImage(generatedImageFromResponse(json));
        if (json.usage && devMode?.enabled) {
          devMode.recordUsage(json.usage);
        }
        setStatus("completed");
      } catch (error) {
        setStatus("failed");
        setGenerationError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        generatingRef.current = false;
      }
    },
    [devMode, replaceImage],
  );

  const retry = useCallback(() => {
    const input = lastInputRef.current;
    if (input) {
      void generate(input);
      return;
    }
    setStatus("idle");
    setGenerationError(null);
  }, [generate]);

  const download = useCallback(() => {
    const current = imageRef.current;
    if (!current) {
      return;
    }
    void downloadGeneratedImage(current);
  }, []);

  return {
    contextLoadState,
    contextError,
    reloadContext: loadContext,
    pages,
    brandSegments,
    brandColors,
    status,
    image,
    generationError,
    generate,
    retry,
    download,
    isGenerating: status === "generating",
  };
}
