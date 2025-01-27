import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://206.189.60.142:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
