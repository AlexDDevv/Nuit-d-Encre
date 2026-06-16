/**
 * Les dix titres de gamification, alignés sur le seed backend
 * (`app/backend/src/scripts/seed-titles.ts`). Utilisés pour dessiner
 * la frise de progression et nommer le palier suivant côté profil.
 */
export type GamificationTitle = {
    level: number;
    label: string;
};

export const TITLES: GamificationTitle[] = [
    { level: 1, label: "Flâneur de Pages" },
    { level: 2, label: "Scribe Apprenti" },
    { level: 3, label: "Lecteur des Chandelles" },
    { level: 4, label: "Glaneur d'Histoires" },
    { level: 5, label: "Hibou des Bibliothèques" },
    { level: 6, label: "Gardien des Parchemins" },
    { level: 7, label: "Érudit Nocturne" },
    { level: 8, label: "Archiviste de l'Ombre" },
    { level: 9, label: "Veilleur d'Encre" },
    { level: 10, label: "Âme de la Nuit d'Encre" },
];

export const MAX_LEVEL = TITLES.length;

/** XP nécessaire pour passer du niveau `level` au suivant (= 100 × niveau). */
export const xpForLevel = (level: number) => 100 * level;

/** Titre correspondant à un niveau donné (clampé au dernier palier). */
export const titleAt = (level: number) =>
    (TITLES.find((t) => t.level === level) ?? TITLES[TITLES.length - 1]).label;
