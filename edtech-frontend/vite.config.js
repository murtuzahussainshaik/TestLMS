// vite.config.js (Final Version)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@context": path.resolve(__dirname, "./src/context"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api/v1": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      "/health": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: process.env.NODE_ENV !== "production",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          vendor: [
            "react-query",
            "axios",
            "react-hook-form",
            "react-hot-toast",
          ],
          ui: ["@headlessui/react", "@heroicons/react"],
          player: ["react-player"],
        },
      },
    },
  },
});
