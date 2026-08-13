import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Plain Vite SPA config: React, Tailwind, and the `@/*` -> `./src/*` path alias
// from tsconfig.json. The landing page is rendered directly from src/main.tsx.
export default defineConfig({
  plugins: [react(), tailwindcss(), tsConfigPaths()],
});
