import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./frontend/src"),
        },
    },
    server: {
        watch: {
            usePolling: true,
        },
        proxy: {
            "/api": {
                target: "http://back:5000",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
