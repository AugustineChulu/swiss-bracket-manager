import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig(() => {
  const outDir = process.env.GITHUB_ACTIONS
    ? "dist"
    : `dist/swiss-bracket-manager`;

  return {
    base: "/swiss-bracket-manager/",
    build: { outDir },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
