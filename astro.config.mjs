// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  base: "/BuildtheOrder-Practice/",
  outDir: "docs",
  integrations: [react()],
});
