import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
    query GetUserProfile($id: ID!) {
        getUserProfile(id: $id) {
            id
            userName
            avatar
            banner
            bio
            level
            xp
            followerCount
            followingCount
            isFollowedByMe
            createdAt
            title {
                id
                label
                minLevel
                iconKey
                ornamentKey
            }
        }
    }
`;

export const GET_USER_ACTIONS = gql`
    query UserActionsByUser($id: ID!) {
        userActionsByUser(id: $id) {
            type
            xp
            createdAt
            metadata
        }
    }
`;

export const GET_USER_FAVORITE_BOOKS = gql`
    query GetUserFavoriteBooks($userId: ID!) {
        getUserFavoriteBooks(userId: $userId) {
            id
            favoriteRank
            book {
                id
                title
                coverUrl
                author {
                    id
                    firstname
                    lastname
                }
            }
        }
    }
`;

export const UPDATE_PROFILE = gql`
    mutation UpdateProfile($data: UpdateProfileInput!) {
        updateProfile(data: $data) {
            id
            userName
            bio
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
        changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
    }
`;

export const UPDATE_AVATAR = gql`
    mutation UpdateAvatar($data: String!) {
        updateAvatar(data: $data) {
            id
            avatar
        }
    }
`;

export const UPDATE_BANNER = gql`
    mutation UpdateBanner($data: String!) {
        updateBanner(data: $data) {
            id
            banner
        }
    }
`;

export const REMOVE_AVATAR = gql`
    mutation RemoveAvatar {
        removeAvatar {
            id
            avatar
        }
    }
`;

export const REMOVE_BANNER = gql`
    mutation RemoveBanner {
        removeBanner {
            id
            banner
        }
    }
`;

export const SET_FAVORITE_BOOK = gql`
    mutation SetFavoriteBook($userBookId: ID!, $rank: Int!) {
        setFavoriteBook(userBookId: $userBookId, rank: $rank) {
            id
            isFavorite
            favoriteRank
            book {
                id
                title
            }
        }
    }
`;

export const REMOVE_FAVORITE_BOOK = gql`
    mutation RemoveFavoriteBook($userBookId: ID!) {
        removeFavoriteBook(userBookId: $userBookId) {
            id
            isFavorite
            favoriteRank
        }
    }
`;
