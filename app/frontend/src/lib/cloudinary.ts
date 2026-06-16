/**
 * Upload non signé d'une image vers Cloudinary (preset configuré côté front).
 * `folder` range le fichier dans un dossier dédié (ex. "user/avatar").
 * Renvoie l'URL sécurisée du fichier, ou `null` si l'upload échoue.
 */
export async function uploadImageToCloudinary(
    file: File,
    folder?: string,
): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );
    if (folder) formData.append("folder", folder);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
    );

    const data = await response.json();
    return data.secure_url ?? null;
}
