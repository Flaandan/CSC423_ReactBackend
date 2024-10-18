import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    headers: {},
  },
  build: {
    rollupOptions: {},
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    headers: {},
  },
});
