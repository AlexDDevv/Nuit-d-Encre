import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/graphql/user/profile";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import ProfileHeader from "@/components/sections/profile/ProfileHeader";
import LevelCard from "@/components/sections/profile/LevelCard";
import FavoriteBooksSection from "@/components/sections/profile/FavoriteBooksSection";
import EditProfileForm from "@/components/sections/form/EditProfileForm";
import ChangePasswordForm from "@/components/sections/form/ChangePasswordForm";

export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuthContext();

    const profileId = id ?? currentUser?.id;
    const isOwner = !id || id === currentUser?.id;

    const [activeTab, setActiveTab] = useState<"profil" | "securite">("profil");

    const { data, loading, error } = useQuery(GET_USER_PROFILE, {
        variables: { id: profileId },
        skip: !profileId || isOwner,
    });

    const profileUser = isOwner && currentUser ? currentUser : data?.getUserProfile;

    if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>;
    if (error || !profileUser) return <div className="p-8 text-center text-destructive">Profil introuvable</div>;

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-6">
            <ProfileHeader user={profileUser} isOwner={isOwner} />
            <LevelCard user={profileUser} />
            <FavoriteBooksSection userId={profileUser.id} isOwner={isOwner} />

            {isOwner && (
                <div className="bg-card rounded-lg p-4 border border-border">
                    <div className="flex gap-4 mb-4 border-b border-border">
                        <button
                            onClick={() => setActiveTab("profil")}
                            className={`pb-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                                activeTab === "profil"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Informations
                        </button>
                        <button
                            onClick={() => setActiveTab("securite")}
                            className={`pb-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                                activeTab === "securite"
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Sécurité
                        </button>
                    </div>

                    {activeTab === "profil" && <EditProfileForm user={profileUser} />}
                    {activeTab === "securite" && <ChangePasswordForm />}
                </div>
            )}
        </div>
    );
}
