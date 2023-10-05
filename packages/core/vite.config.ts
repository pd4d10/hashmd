/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "import.meta.vitest": "undefined",
  },
  build: {
    lib: { entry: "src/index.ts" },
  },
  test: {
    environment: "happy-dom",
    includeSource: ["src/**/*"],
  },
});
