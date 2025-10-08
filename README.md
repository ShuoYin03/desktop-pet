# Desktop Pet Monorepo

This repository hosts the desktop pet application and supporting tooling. The project is structured as a Turborepo monorepo with separate packages for the Electron shell, animation engine, and processing scripts.

## Structure

- `apps/desktop` – Electron + React desktop application shell.
  - `src/main` – Electron main process and bootstrapping logic.
  - `src/preload` – Secure preload scripts that expose limited APIs to the renderer.
  - `src/renderer` – React front-end responsible for rendering the pet UI.
- `packages/engine` – Shared TypeScript animation/behavior engine consumed by the app.
- `assets` – Placeholder for textures, audio, and animation data supplied by users.
- `scripts` – Automation and data-preparation utilities (Python for ML workflows, etc.).
- `config` – Centralized configuration (ESLint, Prettier, Vite, etc.) shared across workspaces.
- `docs` – Functional specifications, design documents, and planning notes.

## Getting Started

1. Install dependencies using your preferred package manager (PNPM recommended):
   ```bash
   pnpm install
   ```
2. Run development scripts from the root using Turborepo once individual app scripts are defined:
   ```bash
   pnpm dev
   ```

Additional workspace-specific commands are defined inside each package.
