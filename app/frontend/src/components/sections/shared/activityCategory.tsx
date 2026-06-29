import { IconType } from "react-icons";
import {
    LuBookOpen,
    LuCircleCheck,
    LuClipboardCheck,
    LuFeather,
    LuThumbsUp,
    LuUserPlus,
} from "react-icons/lu";
import { ActivityKind } from "@/types/types";

/**
 * Source unique de vérité catégorie → libellé + icône, partagée par le journal
 * de profil (ProfileActivity) et le fil d'activité (filtres, repères, entrées).
 */
export const CATEGORY_LABEL: Record<ActivityKind, string> = {
    added: "Ajout",
    finished: "Lecture terminée",
    review: "Critique",
    reco: "Recommandation",
    author: "Auteur",
    complete: "Fiche complétée",
};

export const CATEGORY_ICON: Record<ActivityKind, IconType> = {
    added: LuBookOpen,
    finished: LuCircleCheck,
    review: LuFeather,
    reco: LuThumbsUp,
    author: LuUserPlus,
    complete: LuClipboardCheck,
};

/** Ordre d'affichage des catégories dans les filtres. */
export const CATEGORY_ORDER: ActivityKind[] = [
    "added",
    "finished",
    "review",
    "reco",
    "author",
    "complete",
];
