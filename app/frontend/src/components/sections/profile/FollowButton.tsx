import { LuUserPlus, LuUserCheck } from "react-icons/lu";
import Button from "@/components/UI/Button/Button";
import { useFollow } from "@/hooks/follow/useFollow";
import { FollowButtonProps } from "@/types/types";

/** Bouton suivre / ne plus suivre affiché sur un profil public. */
export default function FollowButton({
    targetId,
    isFollowedByMe,
}: FollowButtonProps) {
    const { toggleFollow, loading } = useFollow(targetId, isFollowedByMe);

    return (
        <Button
            variant={isFollowedByMe ? "secondary" : "primary"}
            onClick={toggleFollow}
            loading={loading}
            disabled={loading}
            leftIcon={isFollowedByMe ? <LuUserCheck /> : <LuUserPlus />}
            ariaLabel={isFollowedByMe ? "Ne plus suivre" : "Suivre"}
        >
            {isFollowedByMe ? "Suivi" : "Suivre"}
        </Button>
    );
}
