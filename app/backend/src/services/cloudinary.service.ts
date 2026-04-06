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
            const contentLength = parseInt(headRes.headers.get("content-length") ?? "0", 10);
            if (contentLength < MIN_COVER_SIZE_BYTES) return null;

            const result = await cloudinary.uploader.upload(sourceUrl, { folder });
            return result.secure_url;
        } catch {
            return null;
        }
    }
}
