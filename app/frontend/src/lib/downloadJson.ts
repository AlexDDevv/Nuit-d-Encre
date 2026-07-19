/** Déclenche le téléchargement d'une chaîne JSON en tant que fichier .json. */
export function downloadJson(filename: string, jsonString: string): void {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}
