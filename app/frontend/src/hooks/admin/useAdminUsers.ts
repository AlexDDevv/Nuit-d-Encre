import { useQuery } from "@apollo/client";
import { ADMIN_USERS } from "@/graphql/admin/admin";
import { AdminUsersQuery } from "@/types/types";

/** Liste de tous les utilisateurs (onglet Utilisateurs). */
export function useAdminUsers() {
    const { data, loading, error } = useQuery<AdminUsersQuery>(ADMIN_USERS);

    return {
        users: data?.getUsers ?? [],
        isLoadingUsers: loading,
        errorUsers: error,
    };
}
