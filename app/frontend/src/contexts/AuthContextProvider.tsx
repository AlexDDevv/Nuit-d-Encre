/**
 * @packageDocumentation
 * @category Providers
 * @description
 * This module provides the AuthContextProvider component that makes the authentication context
 * available throughout the application.
 */

import React, { useEffect, useState, useCallback } from "react";
import { User } from "@/types/types";
import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

/**
 * Props for the AuthContextProvider component
 * @interface AuthContextProviderProps
 * @description
 * Defines the required properties for the AuthContextProvider component.
 */
interface AuthContextProviderProps {
    /** The children components that will have access to the auth context */
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthContextProviderProps> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Query whoami to fetch the user
    const { data, loading, error, refetch } = useAuth();

    // Mutation to logout
    const { Logout } = useAuth();

    // Update user state based on query result
    useEffect(() => {
        if (!loading && !error) {
            setUser(data?.whoami || null);
        }
        setIsLoading(loading);
    }, [data, loading, error]);

    const logout = useCallback(async () => {
        try {
            await Logout(); // Call the logout mutation
            setUser(null); // Clear the user state
            refetch(); // Optionally refetch to reset WHOAMI query state
        } catch (error) {
            console.error("Logout failed", error);
        }
    }, [Logout, refetch]);

    /**
     * The context value that will be provided to all child components
     * @description
     * Contains the authentication state and methods.
     */
    const value: AuthContextType = {
        user,
        isLoading,
        refetchUser: refetch,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
