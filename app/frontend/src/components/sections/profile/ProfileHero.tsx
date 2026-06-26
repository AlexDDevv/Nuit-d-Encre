import { useRef, useState } from "react";
import FollowButton from "@/components/sections/profile/FollowButton";
import FollowListModal from "@/components/sections/profile/FollowListModal";
import { useMutation } from "@apollo/client";
import {
    FaPen,
    FaCamera,
    FaRegCalendar,
    FaQuoteLeft,
    FaTrash,
} from "react-icons/fa6";
import Button from "@/components/UI/Button/Button";
import {
    UPDATE_AVATAR,
    UPDATE_BANNER,
    REMOVE_BANNER,
} from "@/graphql/user/profile";
import { WHOAMI } from "@/graphql/user/auth";
import { fileToDataUrl, MAX_IMAGE_BYTES } from "@/lib/image";
import { useToast } from "@/hooks/toast/useToast";
import { titleAt } from "@/constants/titles";
import { User } from "@/types/types";
import { Card } from "./ProfileUI";
import UploadVeil from "./hero/UploadVeil";
import TitlePlate from "./hero/TitlePlate";

interface ProfileHeroProps {
    user: User;
    isOwner: boolean;
    onOpenEdit: () => void;
}

const initials = (name: string) =>
    name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const memberSince = (iso?: string) => {
    if (!iso) return null;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
    }).format(date);
};

export default function ProfileHero({
    user,
    isOwner,
    onOpenEdit,
}: ProfileHeroProps) {
    const avatarInput = useRef<HTMLInputElement>(null);
    const bannerInput = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState<"avatar" | "banner" | null>(null);
    const [followModal, setFollowModal] = useState<
        "followers" | "following" | null
    >(null);
    const { showToast } = useToast();

    const refetch = [{ query: WHOAMI }];
    const [updateAvatar] = useMutation(UPDATE_AVATAR, {
        refetchQueries: refetch,
    });
    const [updateBanner] = useMutation(UPDATE_BANNER, {
        refetchQueries: refetch,
    });
    const [removeBanner] = useMutation(REMOVE_BANNER, {
        refetchQueries: refetch,
    });

    const handleUpload = async (
        kind: "avatar" | "banner",
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (file.size > MAX_IMAGE_BYTES) {
            showToast({
                type: "error",
                title: "Image trop lourde",
                description: "Choisissez une image de moins de 8 Mo.",
            });
            return;
        }
        setBusy(kind);
        try {
            const data = await fileToDataUrl(file);
            if (kind === "avatar") await updateAvatar({ variables: { data } });
            else await updateBanner({ variables: { data } });
        } catch {
            showToast({
                type: "error",
                title: "Échec de l'envoi",
                description: "L'image n'a pas pu être envoyée.",
            });
        } finally {
            setBusy(null);
        }
    };

    const title = user.title?.label ?? titleAt(user.level);
    const since = memberSince(user.createdAt);

    return (
        <Card glow={false} className="grain fade-up overflow-hidden">
            {/* Bannière éditable en place */}
            <div className="group/banner relative h-32 sm:h-44 md:h-52">
                {user.banner ? (
                    <img
                        src={user.banner}
                        alt="Bannière"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_20%_-20%,hsl(43_38%_34%)_0%,hsl(28_24%_18%)_45%,hsl(20_3%_15%)_100%)]" />
                        <div className="grain absolute inset-0 opacity-50" />
                    </>
                )}
                <div className="via-primary/45 bg-linear-to-r absolute inset-x-0 bottom-0 z-10 h-px from-transparent to-transparent" />

                {isOwner && busy !== "banner" && (
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-2 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover/banner:opacity-100">
                        <button
                            type="button"
                            onClick={() => bannerInput.current?.click()}
                            className="border-primary/70 bg-background/55 text-primary hover:bg-primary hover:text-primary-foreground inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border-2 px-3 py-1.5 text-sm font-bold backdrop-blur-sm transition-colors focus:outline-none"
                        >
                            <FaCamera /> Changer la bannière
                        </button>
                        {user.banner && (
                            <button
                                type="button"
                                onClick={() => removeBanner()}
                                className="border-destructive/60 bg-background/55 text-destructive hover:bg-destructive inline-flex items-center gap-2 whitespace-nowrap rounded-lg border-2 px-3 py-1.5 text-sm font-bold backdrop-blur-sm transition-colors hover:text-white focus:outline-none"
                            >
                                <FaTrash /> Retirer
                            </button>
                        )}
                    </div>
                )}
                {busy === "banner" && <UploadVeil rounded="rounded-none" />}
            </div>

            <input
                ref={avatarInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload("avatar", e)}
            />
            <input
                ref={bannerInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload("banner", e)}
            />

            {/* Corps */}
            <div className="relative px-5 pb-6 md:px-8">
                {/* Avatar chevauchant, éditable en place */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 md:-top-14 md:left-8 md:translate-x-0">
                    <div className="group/av relative">
                        <div className="ring-primary/70 relative h-24 w-24 overflow-hidden rounded-full shadow-[0_8px_30px_-6px_hsl(0_0%_0%/0.6)] ring-2 md:h-28 md:w-28">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.userName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="bg-linear-to-br font-title text-primary-foreground grid h-full w-full place-items-center from-[hsl(43_62%_82%)] to-[hsl(38_42%_50%)] text-3xl font-black md:text-4xl">
                                    {initials(user.userName)}
                                </div>
                            )}
                            {isOwner && busy !== "avatar" && (
                                <button
                                    type="button"
                                    aria-label="Changer la photo de profil"
                                    onClick={() => avatarInput.current?.click()}
                                    className="bg-background/65 text-primary absolute inset-0 z-10 grid cursor-pointer place-items-center rounded-full opacity-0 transition-opacity duration-200 hover:opacity-100 focus:opacity-100 focus:outline-none"
                                >
                                    <FaCamera size={22} />
                                    <span className="text-xxs mt-1 font-bold uppercase tracking-wider">
                                        Changer
                                    </span>
                                </button>
                            )}
                            {busy === "avatar" && (
                                <UploadVeil rounded="rounded-full" />
                            )}
                        </div>
                        <span className="ring-background pointer-events-none absolute inset-0 rounded-full ring-4" />
                        {/* Pastille appareil photo (indice d'éditabilité) */}
                        {isOwner && (
                            <span className="border-background bg-primary text-primary-foreground pointer-events-none absolute -bottom-0.5 -right-0.5 z-30 grid h-8 w-8 place-items-center rounded-full border-2 shadow-md transition-transform duration-200 group-hover/av:scale-110">
                                <FaCamera />
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center pt-16 text-center md:flex-row md:items-end md:justify-between md:pl-40 md:pt-4 md:text-left">
                    {/* Identité */}
                    <div className="flex flex-col items-center gap-3 md:items-start">
                        <h1 className="text-foreground font-title text-2xl font-black leading-tight md:text-4xl">
                            {user.userName}
                        </h1>
                        {since && (
                            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm md:justify-start">
                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                    <FaRegCalendar
                                        size={13}
                                        className="text-primary/60"
                                    />
                                    Membre depuis {since}
                                </span>
                            </div>
                        )}
                        <div className="mt-1">
                            <TitlePlate level={user.level} title={title} />
                        </div>
                    </div>

                    {/* Action principale : ouvre la modale */}
                    {isOwner && (
                        <div className="mt-5 flex shrink-0 items-center gap-2 md:mt-0 md:self-start md:pt-1">
                            <Button
                                variant="primary"
                                onClick={onOpenEdit}
                                leftIcon={<FaPen />}
                            >
                                Modifier le profil
                            </Button>
                        </div>
                    )}
                </div>

                {/* Bio */}
                <div className="mt-5 md:pl-40">
                    {user.bio ? (
                        <p className="text-foreground/85 font-quote max-w-2xl text-lg italic leading-relaxed">
                            <FaQuoteLeft
                                size={13}
                                className="text-primary/50 -mt-1 mr-1.5 inline-block"
                            />
                            {user.bio}
                        </p>
                    ) : (
                        <p className="text-muted-foreground/70 font-quote max-w-xl text-base italic">
                            {isOwner
                                ? "Vous n'avez pas encore écrit votre préface."
                                : "Ce lecteur n'a pas encore écrit sa préface."}
                        </p>
                    )}
                </div>

                {/* Compteurs abonnés / abonnements + bouton suivre */}
                <div className="mt-4 flex flex-wrap items-center gap-4 md:pl-40">
                    <button
                        type="button"
                        onClick={() => setFollowModal("followers")}
                        className="text-foreground hover:text-primary text-sm transition-colors"
                    >
                        <span className="font-title">
                            {user.followerCount ?? 0}
                        </span>{" "}
                        <span className="text-muted-foreground">abonnés</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFollowModal("following")}
                        className="text-foreground hover:text-primary text-sm transition-colors"
                    >
                        <span className="font-title">
                            {user.followingCount ?? 0}
                        </span>{" "}
                        <span className="text-muted-foreground">
                            abonnements
                        </span>
                    </button>
                    {!isOwner && (
                        <FollowButton
                            targetId={user.id}
                            isFollowedByMe={user.isFollowedByMe ?? false}
                        />
                    )}
                </div>

                {followModal && (
                    <FollowListModal
                        userId={user.id}
                        mode={followModal}
                        onClose={() => setFollowModal(null)}
                    />
                )}
            </div>
        </Card>
    );
}
