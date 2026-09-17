import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { FaUserGroup } from "react-icons/fa6";
import { GET_FOLLOWERS, GET_FOLLOWING } from "@/graphql/user/follow";
import UserLink from "@/components/sections/profile/UserLink";
import ModalCloseButton from "@/components/UI/ModalCloseButton";
import { Skeleton } from "@/components/UI/skeleton/Skeleton";
import { FollowListModalProps, User } from "@/types/types";

/** Modale listant les abonnés ou abonnements d'un profil. */
export default function FollowListModal({
    userId,
    userName,
    isOwner,
    mode,
    onClose,
}: FollowListModalProps) {
    const isFollowers = mode === "followers";
    const query = isFollowers ? GET_FOLLOWERS : GET_FOLLOWING;
    const { data, loading } = useQuery(query, { variables: { userId } });
    const users: User[] =
        (isFollowers ? data?.followers : data?.following) ?? [];

    const title = isFollowers ? "Abonnés" : "Abonnements";
    const subtitle = isFollowers
        ? isOwner
            ? "Les lecteurs qui suivent vos lectures."
            : `Les lecteurs qui suivent ${userName}.`
        : isOwner
          ? "Les lecteurs dont vous suivez les lectures."
          : `Les lecteurs que suit ${userName}.`;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    return (
        <div
            className="z-70 fixed inset-0 flex items-center justify-center bg-[hsl(20_3%_7%/0.78)] px-4 backdrop-blur-[3px]"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="follow-title"
                className="border-primary/40 bg-popover relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border-2 shadow-[0_40px_90px_-28px_hsl(20_3%_2%/0.95),0_0_0_1px_hsl(20_3%_8%)]"
            >
                <ModalCloseButton
                    onClick={onClose}
                    className="absolute right-3.5 top-3.5 z-10"
                />

                {/* en-tête */}
                <div className="shrink-0 px-5 pb-5 pt-7 text-center sm:px-8 sm:pt-8">
                    <div className="mb-2.5 flex items-center justify-center gap-2.5">
                        <span className="h-px w-7 bg-[hsl(43_59%_81%/0.45)]" />
                        <FaUserGroup
                            size={13}
                            className="text-primary/70"
                            aria-hidden="true"
                        />
                        <span className="h-px w-7 bg-[hsl(43_59%_81%/0.45)]" />
                    </div>
                    <h2
                        id="follow-title"
                        className="text-foreground font-quote text-3xl leading-tight tracking-tight"
                    >
                        {title}
                        {!loading && (
                            <span className="text-primary/70 ml-2 font-mono text-base">
                                {users.length}
                            </span>
                        )}
                    </h2>
                    <p className="font-quote mx-auto mt-2 max-w-sm text-base italic leading-relaxed text-[hsl(20_12%_70%)]">
                        {subtitle}
                    </p>
                </div>

                {/* liste défilable */}
                <div className="min-h-0 flex-1 overflow-y-auto border-t border-dashed border-[hsl(0_0%_100%/0.08)] px-5 pb-7 pt-5 sm:px-8 sm:pb-8">
                    {loading ? (
                        <div className="flex flex-col gap-2">
                            {[0, 1, 2].map((i) => (
                                <Skeleton key={i} className="h-16 rounded-xl" />
                            ))}
                        </div>
                    ) : users.length === 0 ? (
                        <p className="text-muted-foreground font-quote text-center text-base italic">
                            {isFollowers
                                ? "Aucun abonné pour l'instant."
                                : "Aucun abonnement pour l'instant."}
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-2" onClick={onClose}>
                            {users.map((u) => (
                                <li key={u.id}>
                                    <UserLink
                                        id={u.id}
                                        userName={u.userName}
                                        avatar={u.avatar}
                                        className="border-border hover:border-primary/55 flex w-full rounded-xl border bg-[hsl(20_3%_14%/0.6)] px-3 py-2.5 transition-colors duration-200"
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
