// https://vitejs.dev/config/

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://ec2-54-92-139-93.compute-1.amazonaws.com:3000", // Target server URL
        changeOrigin: true, // Changes the origin of the host header to the target URL
        // rewrite: (path) => path.replace(/^\/api/, ""), // Remove '/api' prefix from the request path
      },
    },
  },
});
