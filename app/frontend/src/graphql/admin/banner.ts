import { gql } from "@apollo/client";

/** Liste complète des bannières (active + historique) pour le panel admin. */
export const ADMIN_SITE_BANNERS = gql`
    query SiteBanners {
        siteBanners {
            id
            title
            message
            variant
            audience
            dismissible
            actionLabel
            actionUrl
            isActive
            createdAt
            updatedAt
        }
    }
`;

export const ADMIN_CREATE_SITE_BANNER = gql`
    mutation CreateSiteBanner($data: CreateSiteBannerInput!) {
        createSiteBanner(data: $data) {
            id
        }
    }
`;

export const ADMIN_UPDATE_SITE_BANNER = gql`
    mutation UpdateSiteBanner($id: ID!, $data: UpdateSiteBannerInput!) {
        updateSiteBanner(id: $id, data: $data) {
            id
        }
    }
`;

export const ADMIN_DELETE_SITE_BANNER = gql`
    mutation DeleteSiteBanner($id: ID!) {
        deleteSiteBanner(id: $id) {
            id
        }
    }
`;
