/** Taille maximale acceptée pour un avatar / une bannière (8 Mo). */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/**
 * Lit un fichier image en data URL base64, à envoyer à une mutation qui
 * déclenche l'upload signé côté backend.
 */
export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () =>
            reject(reader.error ?? new Error("Lecture du fichier impossible"));
        reader.readAsDataURL(file);
    });
}
