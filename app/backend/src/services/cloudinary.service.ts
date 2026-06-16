import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Open Library returns a 1×1 pixel GIF (~807 bytes) when no cover exists.
// Real covers are several kilobytes minimum.
const MIN_COVER_SIZE_BYTES = 2000;

export class CloudinaryService {
    async uploadFromUrl(sourceUrl: string, folder: string): Promise<string | null> {
        try {
            const headRes = await fetch(sourceUrl, { method: "HEAD" });
            const contentLengthHeader = headRes.headers.get("content-length");
            if (contentLengthHeader !== null) {
                const contentLength = parseInt(contentLengthHeader, 10);
                if (contentLength < MIN_COVER_SIZE_BYTES) return null;
            }

            const result = await cloudinary.uploader.upload(sourceUrl, { folder });
            return result.secure_url;
        } catch {
            return null;
        }
    }

    // Upload signé d'une image fournie en data URI (base64). `publicId` est
    // déterministe (ex. "users/42/avatar") : `overwrite` remplace l'ancien
    // fichier et `invalidate` purge le cache CDN. `asset_folder` (parent du
    // public_id) reproduit l'arborescence dans la vue « Folders » des comptes
    // en mode dossiers dynamiques, où elle ne dérive pas du public_id.
    async uploadImage(dataUri: string, publicId: string): Promise<string | null> {
        try {
            const slash = publicId.lastIndexOf("/");
            const assetFolder = slash > 0 ? publicId.slice(0, slash) : undefined;
            const result = await cloudinary.uploader.upload(dataUri, {
                public_id: publicId,
                asset_folder: assetFolder,
                overwrite: true,
                invalidate: true,
                resource_type: "image",
            });
            return result.secure_url;
        } catch {
            return null;
        }
    }

    // Suppression best-effort d'un asset par son public_id (nettoyage au
    // retrait d'un avatar / d'une bannière).
    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId, { invalidate: true });
        } catch {
            // Le retrait en base reste prioritaire : on ignore l'échec CDN.
        }
    }
}
