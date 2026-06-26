import { useMutation } from "@apollo/client";
import { FOLLOW_USER, UNFOLLOW_USER } from "@/graphql/user/follow";
import { GET_USER_PROFILE } from "@/graphql/user/profile";

/**
 * Suivre / ne plus suivre un utilisateur. Refetch du profil cible pour
 * resynchroniser compteurs + isFollowedByMe (vue non critique → simple refetch).
 */
export function useFollow(targetId: string, isFollowedByMe: boolean) {
    const refetchQueries = [
        { query: GET_USER_PROFILE, variables: { id: targetId } },
    ];
    const [follow, followState] = useMutation(FOLLOW_USER, { refetchQueries });
    const [unfollow, unfollowState] = useMutation(UNFOLLOW_USER, {
        refetchQueries,
    });

    const toggleFollow = async () => {
        if (isFollowedByMe) {
            await unfollow({ variables: { userId: targetId } });
        } else {
            await follow({ variables: { userId: targetId } });
        }
    };

    return {
        toggleFollow,
        loading: followState.loading || unfollowState.loading,
    };
}
