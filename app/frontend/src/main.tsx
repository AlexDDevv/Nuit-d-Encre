import { client } from "@/config/client";
import Router from "@/config/router";
import { ErrorBoundary } from "@/components/UI/error/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContextProvider";
import "@/styles/index.css";
import { ApolloProvider } from "@apollo/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <ApolloProvider client={client}>
                    <AuthProvider>
                        <Router />
                    </AuthProvider>
                </ApolloProvider>
            </HelmetProvider>
        </ErrorBoundary>
    </StrictMode>,
);
