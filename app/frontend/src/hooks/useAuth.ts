import { LOGIN, LOGOUT, REGISTER, WHOAMI } from "@/graphql/auth";
import { User } from "@/types/types";
import { useMutation, useQuery } from "@apollo/client";

export function useAuth() {
    const [Register] = useMutation(REGISTER, {
        refetchQueries: [WHOAMI],
    });

    const [Login] = useMutation(LOGIN, {
        refetchQueries: [WHOAMI],
    });

    const [Logout] = useMutation(LOGOUT);

    const { data, loading, error, refetch } = useQuery<{ whoami: User }>(
        WHOAMI,
        {
            fetchPolicy: "network-only", // Ensure fresh data on each load
        },
    );

    return {
        Register,
        Login,
        Logout,
        data,
        loading,
        error,
        refetch,
    };
}
