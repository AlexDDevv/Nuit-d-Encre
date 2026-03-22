import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_AVATAR, REMOVE_AVATAR } from "@/graphql/user/profile";
import { WHOAMI } from "@/graphql/user/auth";

interface AvatarUploaderProps {
    currentAvatar: string | null;
    userName: string;
}

export default function AvatarUploader({ currentAvatar, userName }: AvatarUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const [updateAvatar] = useMutation(UPDATE_AVATAR, {
        refetchQueries: [{ query: WHOAMI }],
    });
    const [removeAvatar] = useMutation(REMOVE_AVATAR, {
        refetchQueries: [{ query: WHOAMI }],
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: "POST", body: formData }
            );

            const data = await response.json();
            if (data.secure_url) {
                await updateAvatar({ variables: { url: data.secure_url } });
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="w-24 h-24 rounded-full bg-accent overflow-hidden cursor-pointer border-4 border-background"
                onClick={() => inputRef.current?.click()}
            >
                {currentAvatar ? (
                    <img src={currentAvatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-foreground">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex gap-2 text-sm">
                <button
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="text-primary hover:underline disabled:opacity-50"
                >
                    {uploading ? "Upload..." : "Changer"}
                </button>
                {currentAvatar && (
                    <button
                        onClick={() => removeAvatar()}
                        className="text-destructive hover:underline"
                    >
                        Supprimer
                    </button>
                )}
            </div>
        </div>
    );
}
