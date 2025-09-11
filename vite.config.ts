import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    proxy: {
      "/api/trash": {
        target: "https://m.winterthur.ch",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trash/, "/appl/ical.php?apid=1067618&calhome=1066394"),
      },
      "/api/paper": {
        target: "https://m.winterthur.ch",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/paper/, "/appl/ical.php?apid=3540254&calhome=1066394"),
      },
      "/api/weather": {
        target: "https://api.open-meteo.com",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/weather/,
            "/v1/forecast?latitude=47.3784&longitude=8.5403&current_weather=true&temperature_unit=celsius"
          ),
      },
    },
  }
})
