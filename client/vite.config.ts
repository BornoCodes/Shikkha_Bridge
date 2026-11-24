import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// This file runs as plain ESM (see package.json "type": "module"), so we
// resolve paths from import.meta.url instead of the CommonJS __dirname.
const resolvePath = (relative: string) =>
  fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@modules": resolvePath("./src/modules"),
      "@shared": resolvePath("./src/shared"),
      "@assets": resolvePath("./src/assets"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // the NestJS server serves /auth, /absences ... with no /api prefix
        rewrite: (p: string) => p.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          motion: ["framer-motion"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});
