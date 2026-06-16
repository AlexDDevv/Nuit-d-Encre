import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE, GET_USER_ACTIONS } from "@/graphql/user/profile";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { computeStats } from "@/lib/profileActivity";
import { User, UserAction } from "@/types/types";
import ProfileHero from "@/components/sections/profile/ProfileHero";
import ProfileProgression from "@/components/sections/profile/ProfileProgression";
import ProfileStats from "@/components/sections/profile/ProfileStats";
import FavoriteBooks from "@/components/sections/profile/FavoriteBooks";
import ProfileActivity from "@/components/sections/profile/ProfileActivity";
import EditProfileModal from "@/components/sections/profile/EditProfileModal";
import { Ornament } from "@/components/sections/profile/ProfileUI";

export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuthContext();

    const profileId = id ?? currentUser?.id;
    const isOwner = !id || id === currentUser?.id;

    const [editOpen, setEditOpen] = useState(false);

    const { data: profileData, loading } = useQuery(GET_USER_PROFILE, {
        variables: { id: profileId },
        skip: !profileId || isOwner,
    });

    const { data: actionsData } = useQuery(GET_USER_ACTIONS, {
        variables: { id: profileId },
        skip: !profileId,
    });

    const profileUser: User | undefined =
        isOwner && currentUser ? currentUser : profileData?.getUserProfile;

    const actions: UserAction[] = useMemo(
        () => actionsData?.userActionsByUser ?? [],
        [actionsData],
    );
    const stats = useMemo(() => computeStats(actions), [actions]);

    if (loading) {
        return (
            <div className="text-muted-foreground p-8 text-center">
                Chargement…
            </div>
        );
    }
    if (!profileUser) {
        return (
            <div className="text-destructive p-8 text-center">
                Profil introuvable
            </div>
        );
    }

    return (
        <section className="mx-auto w-full max-w-5xl">
            {!isOwner && (
                <div className="text-muted-foreground mb-4 flex items-center justify-center gap-3 text-[12px] tracking-[0.22em] uppercase">
                    <Ornament width="w-8" />
                    Lecture seule · vous visitez ce profil
                    <Ornament width="w-8" />
                </div>
            )}

            <div className="flex flex-col gap-6 md:gap-7">
                <ProfileHero
                    user={profileUser}
                    isOwner={isOwner}
                    onOpenEdit={() => setEditOpen(true)}
                />

                <ProfileProgression user={profileUser} />

                <ProfileStats stats={stats} />

                <div className="grid grid-cols-1 gap-6 md:gap-7 lg:grid-cols-[1.05fr_1fr]">
                    <FavoriteBooks
                        userId={profileUser.id}
                        isOwner={isOwner}
                        editing={isOwner}
                    />
                    <ProfileActivity actions={actions} />
                </div>
            </div>

            <footer className="mt-12 flex flex-col items-center gap-3 pb-6 text-center">
                <Ornament />
                <p className="text-muted-foreground/70 max-w-md font-quote text-[15px] italic">
                    « On n'habite pas un pays, on habite une langue. » — et, la
                    nuit venue, une bibliothèque.
                </p>
            </footer>

            {editOpen && isOwner && (
                <EditProfileModal
                    user={profileUser}
                    onClose={() => setEditOpen(false)}
                />
            )}
        </section>
    );
}
