# Fitted Mobile (Expo + React Native)

Expo-managed React Native app that mirrors the “Meet your digital twin” 8-step flow. It lives inside the pnpm workspace so you can share packages (`@fitted/ui-native`, tokens, spec kit) with the rest of the stack.

## Commands

```sh
pnpm start            # expo start
pnpm android          # build & run on Android emulator/device
pnpm ios              # build & run on iOS simulator/device
pnpm test             # jest-expo (placeholder)
pnpm typecheck        # tsc --noEmit
```

## Flow Overview
- `/` Welcome → `/how-it-works` → `/permissions` → `/setup` → `/front-capture` → `/rotate-side` → `/processing` → `/results` (mirrors the Next.js app).
- Camera permissions + preview run through `src/hooks/useMobileCamera.ts` (Expo Camera API) and render via `CameraPreview`.
- Captured frames, height, and measurement results live in `src/state/FlowContext.tsx`. They’re forwarded to `src/services/measurementClient.ts`, which currently mocks the measurement backend (replace with the real service later).
- Shared styling & primitives come from `@fitted/ui-native`, a small React Native kit that maps the Eldora token palette to native components.

## Notes
- Metro is configured for pnpm via `metro.config.js`, so the app resolves packages from the workspace without extra symlink hacks.
- Update `config/style-map.json` + rerun `./init.zsh` to propagate palette tweaks to both web + mobile.
- TODO: replace the stubbed measurement client with the production measurement/geometry service once API endpoints are wired up.
