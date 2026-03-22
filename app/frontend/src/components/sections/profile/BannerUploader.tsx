import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_BANNER, REMOVE_BANNER } from "@/graphql/user/profile";
import { WHOAMI } from "@/graphql/user/auth";

interface BannerUploaderProps {
    currentBanner: string | null;
}

export default function BannerUploader({ currentBanner }: BannerUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const [updateBanner] = useMutation(UPDATE_BANNER, {
        refetchQueries: [{ query: WHOAMI }],
    });
    const [removeBanner] = useMutation(REMOVE_BANNER, {
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
                await updateBanner({ variables: { url: data.secure_url } });
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative w-full">
            <div
                className="w-full h-32 bg-accent cursor-pointer overflow-hidden"
                onClick={() => inputRef.current?.click()}
            >
                {currentBanner ? (
                    <img src={currentBanner} alt="Bannière" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        Cliquer pour ajouter une bannière
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

            {currentBanner && (
                <button
                    onClick={() => removeBanner()}
                    className="absolute top-2 right-2 text-xs bg-background/80 px-2 py-1 rounded text-destructive hover:underline"
                >
                    Supprimer
                </button>
            )}

            {uploading && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center text-sm text-foreground">
                    Upload en cours...
                </div>
            )}
        </div>
    );
}
