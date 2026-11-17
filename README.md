# Content OS | Image Generator

This repository is a **proof of concept** for the Image Generator module in **Content OS** — a place where marketing teams turn brand context into on-brand visuals instead of one-off prompts.

The app composes **deterministic, brand-aware prompts** from tenant and client knowledge, then sends them to image-generation providers. Today that means **Google Gemini** (default) and optional **Higgsfield SOUL V2**. The goal is to show how Content OS could plug in additional image AI agents while keeping identity, tone, and guardrails under your control.

**What you can try locally**

- Pick a demo client and page context, describe what you need, and generate an image aligned to that brand.
- Switch providers in the UI when both are configured (Gemini vs Higgsfield).
- Open the **dev panel** with **⌘⇧D** (macOS) or **Ctrl+Shift+D** (Windows/Linux) to override models, track rough token/cost estimates, and experiment safely.

For deeper architecture and trade-offs, see [REFLECTION.md](./REFLECTION.md).

---

## Setup

### Stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Validation | Zod |
| Image providers | Google Gemini (`@google/genai`), Higgsfield SOUL V2 (optional) |
| Language | TypeScript |

### Prerequisites

- **Node.js** — the repo pins **24.x** via [mise](https://mise.jdx.dev) (`mise.toml`). Any current Node 20+ usually works; `mise install` is the path of least surprise if you use mise.
- **npm** (comes with Node).
- A **Gemini API key** and a supported **image model ID** (required for generation).
- **Higgsfield** credentials only if you want to test that provider (optional).

### Get the code on your machine

```bash
git clone <your-repo-url>
cd goldfizh-image-gen
npm install
```

### Environment variables

Copy the example file and fill in values. **Never commit real keys** — `.env*` is gitignored except `.env.example`.

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes (for Gemini) | Server-side key for Google’s Gemini API. |
| `GEMINI_IMAGE_MODEL` | Yes (for Gemini) | Model ID that supports image output, e.g. `gemini-2.5-flash-image` or `gemini-3.1-flash-image-preview`. |
| `WEBSITE_FALLBACK_URL` | Recommended | Public URL used when no demo client website is active (demo client is chosen in the dev panel). |
| `HIGGSFIELD_API_KEY` | Optional | Single string `api_key_id:api_key_secret` for Higgsfield. |
| `HIGGSFIELD_API_KEY_ID` / `HIGGSFIELD_API_KEY_SECRET` | Optional | Alternative to the combined `HIGGSFIELD_API_KEY` format. |
| `ENABLE_DEV_TOOLS` / `NEXT_PUBLIC_ENABLE_DEV_TOOLS` | Optional | Expose dev panel features in production builds (local dev does not require these). |

Next.js loads `.env` automatically for local development.

---

### Obtain a Gemini API key (step by step)

1. Sign in with a Google account at [Google AI Studio](https://aistudio.google.com/).
2. Open **Get API key** (or **API keys** in the menu) and create a key for a Google Cloud project.  
   Official reference: [Gemini API quickstart](https://ai.google.dev/gemini-api/docs/quickstart).
3. Copy the key into `.env`:

   ```env
   GEMINI_API_KEY=your_key_here
   ```

4. Set a model that supports **image generation**. Examples used in the dev catalog include:

   ```env
   GEMINI_IMAGE_MODEL=gemini-2.5-flash-image
   ```

   Check [Gemini models](https://ai.google.dev/gemini-api/docs/models) for the latest image-capable IDs and quotas for your project.

5. Restart the dev server after changing `.env` so the server picks up new values.

---

### Obtain Higgsfield credentials (optional)

Higgsfield is **not** required to run the app; configure it only if you want to compare or use **SOUL V2** generation.

1. Create an account and sign in at [Higgsfield Console](https://console.higgsfield.ai/).
2. Create an API key (or pair of id + secret) in the console’s API / developer section.
3. Add to `.env` using **one** of these patterns:

   **Combined (preferred in this project):**

   ```env
   HIGGSFIELD_API_KEY=your_key_id:your_key_secret
   ```

   **Or split:**

   ```env
   HIGGSFIELD_API_KEY_ID=your_key_id
   HIGGSFIELD_API_KEY_SECRET=your_key_secret
   ```

4. In the UI, choose **Higgsfield** as the provider when both Gemini and Higgsfield are configured. SOUL V2 runs at 720p; portrait requests map to a **3:4** aspect ratio.

5. Restart the dev server after updating credentials.

---

## Run locally

```bash
npm run dev
```

When the server is ready, open **[http://localhost:3000](http://localhost:3000)** in your browser. You should land on the generator UI; edits to the codebase hot-reload under `npm run dev`.

### Other useful commands

| Command | What it does |
| --- | --- |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript without emit |
| `npm run test:prompts` | Prompt composition regression checks |
| `npm run smoke:generate-brands` | Optional smoke test (needs `GEMINI_API_KEY` and `GEMINI_IMAGE_MODEL`) |

---

## Scope of this POC

Auth, multi-tenant routing, and parts of client knowledge are **mocked or demo-scoped** so the focus stays on prompt composition and provider integration. There is no persistent image library, job queue, or production-grade rate limiting — see [REFLECTION.md](./REFLECTION.md) for limits and what would come next in a full Content OS rollout.