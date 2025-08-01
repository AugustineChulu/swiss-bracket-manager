import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig(() => {
  const projectName = 'swiss-bracket-manager';
  const outDir = process.env.GITHUB_ACTIONS
    ? "dist"
    : `dist/${projectName}`;

  return {
    base: `/${projectName}/`,
    build: { outDir },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
