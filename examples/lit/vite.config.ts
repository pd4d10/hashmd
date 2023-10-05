import { defineConfig } from "vite";
import { vitePlugin as workspace } from "vite-workspace";

export default defineConfig({
  plugins: [workspace()],
});
