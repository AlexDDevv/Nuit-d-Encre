import { useQuery } from "@apollo/client";
import { GET_FOLLOWERS, GET_FOLLOWING } from "@/graphql/user/follow";
import UserLink from "@/components/sections/profile/UserLink";
import { FollowListModalProps, User } from "@/types/types";

/** Modale listant les abonnés ou abonnements d'un profil. */
export default function FollowListModal({
    userId,
    mode,
    onClose,
}: FollowListModalProps) {
    const query = mode === "followers" ? GET_FOLLOWERS : GET_FOLLOWING;
    const { data, loading } = useQuery(query, { variables: { userId } });
    const users: User[] =
        (mode === "followers" ? data?.followers : data?.following) ?? [];
    const title = mode === "followers" ? "Abonnés" : "Abonnements";

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="border-border bg-card w-full max-w-md rounded-xl border-2 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-foreground font-title mb-4 text-lg">
                    {title}
                </h2>
                {loading ? (
                    <p className="text-muted-foreground text-sm">Chargement…</p>
                ) : users.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        {mode === "followers"
                            ? "Aucun abonné pour l'instant."
                            : "Aucun abonnement pour l'instant."}
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {users.map((u) => (
                            <li key={u.id}>
                                <UserLink
                                    id={u.id}
                                    userName={u.userName}
                                    avatar={u.avatar}
                                    size="sm"
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
