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
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes("node_modules")) return;

                    if (/[\\/]react-icons[\\/]/.test(id)) return "icons";
                    if (
                        /[\\/](@apollo|graphql|@wry|optimism|ts-invariant|zen-observable|symbol-observable)/.test(
                            id,
                        )
                    )
                        return "apollo";
                    if (
                        /[\\/](radix-ui|@radix-ui|motion|motion-dom|motion-utils|sonner|react-hook-form)[\\/]/.test(
                            id,
                        )
                    )
                        return "ui-vendor";
                    if (
                        /[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(
                            id,
                        )
                    )
                        return "react-vendor";
                },
            },
        },
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
