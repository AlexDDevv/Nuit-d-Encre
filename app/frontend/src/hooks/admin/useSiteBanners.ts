import { useMutation, useQuery } from "@apollo/client";
import {
    ADMIN_CREATE_SITE_BANNER,
    ADMIN_DELETE_SITE_BANNER,
    ADMIN_SITE_BANNERS,
    ADMIN_UPDATE_SITE_BANNER,
} from "@/graphql/admin/banner";
import type {
    SiteBanner,
    SiteBannersQuery,
    SiteBannerVariant,
    SiteBannerAudience,
} from "@/types/types";

/** Données envoyées au backend (enums en majuscules, conformes au schéma GraphQL). */
export interface SiteBannerInput {
    title: string;
    message?: string | null;
    variant: SiteBannerVariant;
    audience: SiteBannerAudience;
    dismissible: boolean;
    actionLabel?: string | null;
    actionUrl?: string | null;
    isActive: boolean;
}

/**
 * Liste des bannières et mutations CRUD du panel admin. Chaque mutation
 * rafraîchit la liste ainsi que la bannière active affichée sur le site.
 */
export function useSiteBanners() {
    const { data, loading } = useQuery<SiteBannersQuery>(ADMIN_SITE_BANNERS, {
        fetchPolicy: "network-only",
    });

    const refetchQueries = [{ query: ADMIN_SITE_BANNERS }];

    const [createMutation, { loading: isCreating }] = useMutation(
        ADMIN_CREATE_SITE_BANNER,
        { refetchQueries },
    );
    const [updateMutation, { loading: isUpdating }] = useMutation(
        ADMIN_UPDATE_SITE_BANNER,
        { refetchQueries },
    );
    const [deleteMutation, { loading: isDeleting }] = useMutation(
        ADMIN_DELETE_SITE_BANNER,
        { refetchQueries },
    );

    return {
        banners: (data?.siteBanners ?? []) as SiteBanner[],
        loading,
        createBanner: (input: SiteBannerInput) =>
            createMutation({ variables: { data: input } }),
        updateBanner: (id: string, input: Partial<SiteBannerInput>) =>
            updateMutation({ variables: { id, data: input } }),
        deleteBanner: (id: string) => deleteMutation({ variables: { id } }),
        isMutating: isCreating || isUpdating || isDeleting,
    };
}
