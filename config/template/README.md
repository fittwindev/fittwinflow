# Fitted — Full Stack Platform Scaffold

## Overview
Fitted is a single-shot generator that spawns a coordinated web/mobile/desktop stack from a lightweight `config/template` bundle. Run `./init.zsh` and the script copies that template to `./fitted`, installs dependencies, and stitches shared design assets. The idea is to provide:

| Role | Need | What Fitted Gives |
| --- | --- | --- |
| Editor/Founders | Understand product vision + spec | `packages/spec-kit` contains Constitution, SPEC, AGENTS docs plus JSON schemas; each doc describes flow, policy, and persona-driven automation cues so you can justify UI copy or behavior to stakeholders. |
| Developer | Build across platforms | `apps/web` (Next.js + Tailwind + Eldora/Tailwind plugin), `apps/mobile` (Expo/React Native), `apps/desktop` (Tauri + Next). Shared packages (`packages/ui-shadcn`, `ui-native`, `ui-lit`, `tokens`, `ui-eldora`, `auth`, `spec-kit`) provide primitives, tokens, and helpers you can import everywhere. |
| QA / Tester | Verify metrics, accessibility, spec compliance | The `spec-kit` docs enumerate flow requirements, agents, schema contracts, and measurement provenance; components log each stage, and the flow mirrors the canonical “Meet Your Digital Twin” story, so you can smoke-test the timers, permissions, LiDAR, and commerce touchpoints from end to end. |

## Project Layout

```
config/
  template/                  # Source scaffolding used by init.zsh
    apps/                    # platform-specific applications
    packages/                # shared libraries (tokens, ui kits, auth, spec kit)
    ...                      # workspace config + docs
  style-map.json             # declarative Eldora palette/style object consumed during generation
init.zsh                     # generator: copies template → fitted/, injects colors + Tailwind output, runs pnpm install
fitted/ (generated)          # Resulting workspace after running ./init.zsh
```

## Stack Deep Dive

### Web (`apps/web`)
- **Framework**: Next.js 14 App Router (TypeScript + `tsconfig.json` automatically tuned when `next dev` runs).
- **Styling**: Tailwind + Eldora plugin + `@fitted/ui-eldora` for Emergent design primitives (cards, buttons, grids) plus `@fitted/ui-shadcn` for React wrappers and `@fitted/ui-lit` for Lit components used in countdowns and LiDAR banners.
- **Auth**: `@fitted/auth/nextauth.ts` configures NextAuth with Google + Credentials provider; you only need env vars `GOOGLE_ID`, `GOOGLE_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
- **Flow**: `app/page.tsx` along with the `/how-it-works`, `/permissions`, `/setup`, `/front-capture`, `/rotate-side`, `/processing`, `/results` routes implement the canonical 8-step experience and wire up the shared Lit countdown + LiDAR components.
- **Camera**: `app/components/camera.tsx` exposes a `useCamera` hook + preview component that manages permissions, restart, and capture logic; the hook ensures the video element is ready and returns base64 snapshots stored in `sessionStorage` so downstream pages can consume them.
- **Style Map**: `config/style-map.json` is the single source of truth for Eldora tokens; `init.zsh` runs a Node helper to emit both `packages/ui-eldora/styles.css` and `apps/web/tailwind.config.ts`, so updating that JSON immediately updates the palette, Eldora utilities, and Tailwind theme.

### Mobile (`apps/mobile`)
- **Framework**: Expo-managed React Native (TypeScript). `App.tsx` boots a stack navigator that mirrors the exact 8-step flow from the web app. Each screen reuses shared copy/staging plus countdown and LiDAR banner equivalents.
- **Camera**: `src/hooks/useMobileCamera.ts` wraps `expo-camera` to manage permissions, preview lifecycle, and base64 capture so it aligns with the `useCamera` hook on web. `CameraPreview` renders the sensor feed with stateful overlays.
- **Shared UI**: `packages/ui-native` provides RN-specific primitives (`Screen`, `Card`, `Button`, tokens) generated from the same Eldora palette so typography + surfaces match the web kit.
- **Measurement client**: `src/services/measurementClient.ts` hosts a typed stub aligned with `packages/spec-kit/schema/measurement.schema.json`. Replace its TODO with the real measurement/geometry API when it’s ready.
- **Commands**: Run `pnpm dev:mobile` (or `pnpm --filter @fitted/mobile start`) inside the generated workspace to open the Expo dev server. `pnpm android`/`pnpm ios` run native builds through Expo as usual.

### Desktop (`apps/desktop`)
- **Framework**: Tauri wrapping `apps/web` for a native shell. `src-tauri/tauri.conf.json` points `beforeDevCommand`/`beforeBuildCommand` to the Next dev/build scripts and uses `.next` as the `distDir`.
- **Commands**: `pnpm dev:desktop` runs `tauri dev` (requires Rust toolchain); builds reuse the same web assets.

### Shared Packages (`packages`)
- `@fitted/tokens`: CSS custom properties + helper classes for the color system.
- `@fitted/ui-shadcn`: React components (`Button`, `Card`) that wrap token CSS (used for CTA copy).
- `@fitted/ui-lit`: Lit countdown + LiDAR banners (`fit-countdown`, `fit-lidar-banner`) that share behavior with the web flow.
- `@fitted/ui-eldora`: Emergent CSS + Tailwind plugin generated from `config/style-map.json`.
- `@fitted/auth`: NextAuth helpers referencing the shared Google / credentials config.
- `@fitted/spec-kit`: Constitution, SPEC doc (primary flow), AGENTS, and measurement schema to guide compliance and automation.

## Generator Purpose & Workflow

1. **Purpose**: `init.zsh` is the single entry point to regenerate the workspace from `config/template`. It ensures:
   - All spec docs, assets, apps, packages are copied verbatim.
   - Eldora tokens + classes stay in sync via `config/style-map.json`, so you can tweak styles without editing multiple files.
   - pnpm workspace installs dependencies once.

2. **Workflow**:
   - Clone/update `config/template` to try new structure or add apps/packages.
   - Update `config/style-map.json` to change colors, new utilities, or global design tokens.
   - Run `./init.zsh` → workspace at `./fitted`.
   - Use `pnpm dev:web`, `pnpm dev:desktop`, etc., inside `fitted`.

## How to Configure & Extend

### Style Map
- Add new CSS variables, classes, or utilities to `config/style-map.json`. Each entry automatically becomes:
  - `--e-<var>` CSS custom property in `packages/ui-eldora/styles.css`.
  - `.e-<class>` or `.e-<utility>` selectors (available across platforms).
  - Tailwind color tokens (`ring`, `ink`, etc.) for easy utility usage (`text-ring`, `bg-card`).

### Adding Packages/Pages
- Modify `config/template` as if editing a normal repo: change `apps/web/app/*`, add new components, update package.json scripts. The generator simply clones it, so all updates are repeated when you rerun the init script.
- Keep shared logic (camera hooks, camera preview, API routes) within `config/template/apps/web` so the copy stays self-contained.

### Governance Documents
- `packages/spec-kit` holds explicit policy and flow references:
  - `CONSTITUTION.md` lists safety/privacy/UX rules.
  - `SPEC.md` describes the canonical eight-screen flow, timers, LiDAR expectations, and commerce handoff copy.
  - `AGENTS.md` enumerates AI agent inputs/outcomes to keep automation documentable.
  - `schema/measurement.schema.json` defines provenance for height/chest/waist/hips to validate measurements.

You can cite these when a decision is challenged, and they stay bundled inside the generated workspace so every new clone has them.

## Using the Stack
- Run `pnpm dev:web` inside `fitted` for Next dev server (auto rebuilds tsconfig & tailwind picks up Eldora).
- Run `pnpm dev:mobile` to start the Expo bundler (Metro is pre-configured for pnpm workspaces).
- For desktop, follow comments in the README inside `apps/desktop`.
- CI is set up in `.github/workflows/ci.yml` to run `pnpm --filter @fitted/web build`.

## Summary
This generator plus template is meant to be the canonical “Fitted” environment. Editors/founders get the spec-kit inked beside the UI; developers get a Next/Tailwind/Lit stack with reusable tokens/components; QA/testers can run the flow and refer to the spec for compliance. Every structural tweak or emergent style change is handled by editing `config/template` (for code/flow) or `config/style-map.json` (for the design system) before rerunning `./init.zsh`. Use this mix to prototype any “site imaginable” while keeping the shared aesthetic and policy foundation intact.
