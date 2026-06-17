/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [
        react({
            babel: {
                plugins:
                    command === "serve"
                        ? [["@react-dev-inspector/babel-plugin", {}]]
                        : [],
            },
        }),
    ],
    test: {
        environment: "node",
        include: ["src/**/*.test.{ts,tsx}"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: true,
        port: 5173,
        watch: {
            usePolling: true,
        },
        proxy: {
            "/api": {
                target: "http://back:3310",
                changeOrigin: true,
                secure: false,
            },
        },
    },
}));
