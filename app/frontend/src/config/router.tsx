/**
 * @fileoverview Router configuration for the application using React Router
 * @module router
 */

import App from "@/App";
import PublicRoute from "@/components/sections/hoc/PublicRoute";
import ErrorElement from "@/components/UI/ErrorElement";
import Loader from "@/components/UI/Loader";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/**
 *  Using lazy loading for pages
 * @description
 * Lazy loaded page components
 * These components are loaded only when needed, improving initial load time
 */
const Landing = lazy(() => import("@/pages/Landing"));
const Auth = lazy(() => import("@/pages/Auth"));
const Books = lazy(() => import("@/pages/Books"));
const TermsOfUse = lazy(() => import("@/pages/TermsOfUse"));

/**
 * Router confirmation
 *
 * @description
 * Defines all routes in the application with their respective components
 * and protection levels
 */
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorElement />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Loader />}>
                        <PublicRoute>
                            <Landing />
                        </PublicRoute>
                    </Suspense>
                ),
            },
            {
                path: "register",
                element: (
                    <Suspense fallback={<Loader />}>
                        <PublicRoute>
                            <Auth />
                        </PublicRoute>
                    </Suspense>
                ),
            },
            {
                path: "connexion",
                element: (
                    <Suspense fallback={<Loader />}>
                        <PublicRoute>
                            <Auth />
                        </PublicRoute>
                    </Suspense>
                ),
            },
            {
                path: "books",
                element: (
                    <Suspense fallback={<Loader />}>
                        <Books />
                    </Suspense>
                ),
            },
            {
                path: "terms-of-use",
                element: (
                    <Suspense fallback={<Loader />}>
                        <TermsOfUse />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: "*",
        errorElement: <ErrorElement />,
        loader: () => {
            // Simulate a 404 error for unmatched routes
            throw new Response("Page non trouvée", {
                status: 404,
                statusText: "Not Found",
            });
        },
    },
]);

/**
 * Router Component
 *
 * Provides routing functionality to the application using React Router
 * @component
 * @returns {JSX.Element} The RouterProvider component with the configured routes
 */
const Router = () => {
    return <RouterProvider router={router} />;
};

export default Router;
