import { User } from "@/types/types";
import AvatarUploader from "./AvatarUploader";
import BannerUploader from "./BannerUploader";

interface ProfileHeaderProps {
    user: User;
    isOwner: boolean;
}

export default function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
    return (
        <div className="w-full">
            {/* Bannière */}
            {isOwner ? (
                <BannerUploader currentBanner={user.banner} />
            ) : (
                <div className="w-full h-32 bg-accent overflow-hidden">
                    {user.banner && (
                        <img src={user.banner} alt="Bannière" className="w-full h-full object-cover" />
                    )}
                </div>
            )}

            {/* Avatar + infos */}
            <div className="px-6 pb-4 flex items-end gap-4 -mt-12">
                {isOwner ? (
                    <AvatarUploader currentAvatar={user.avatar} userName={user.userName} />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-accent overflow-hidden border-4 border-background flex-shrink-0">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-foreground">
                                {user.userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                )}

                <div className="pb-2 min-w-0">
                    <h1 className="text-2xl font-bold text-foreground truncate">{user.userName}</h1>
                    {user.title && (
                        <p className="text-sm text-primary">{user.title.label}</p>
                    )}
                    {user.bio && (
                        <p className="text-sm text-muted-foreground mt-1 max-w-md">{user.bio}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
