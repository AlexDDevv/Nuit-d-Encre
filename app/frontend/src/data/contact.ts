import { IconType } from "react-icons";
import {
    LuBookHeart,
    LuFileText,
    LuLifeBuoy,
    LuLock,
    LuShield,
    LuStar,
    LuUsers,
} from "react-icons/lu";
import { FaqEntry, UsefulLink } from "@/components/sections/contact/types";
import { SiteStats } from "@/types/types";

// Contact details - placeholder email, confirm before going live.
export const CONTACT = {
    email: "contact@nuitdencre.fr",
    delai: "sous 48 h ouvrées",
};

export const ABOUT_PARAS = [
    "Nuit d'Encre est une bibliothèque qui ne ferme jamais. On y range ses lectures sur des rayons à soi, on y consigne ses critiques à la lueur de la chandelle, et l'on y croise d'autres veilleurs venus chercher leur prochain livre de chevet.",
    "Plus qu'un catalogue, c'est une veillée : chaque page lue fait grandir votre rang, débloque des titres et nourrit des recommandations taillées pour vous. Une question, une suggestion, un grain de sable dans les rouages ? Écrivez-nous d'un mot, quelqu'un tient la lampe.",
];

// Stat medallions - values resolved at runtime from the siteStats query.
export type StatDef = {
    icon: IconType;
    key: keyof SiteStats;
    label: string;
};

export const STAT_DEFS: StatDef[] = [
    { icon: LuUsers, key: "users", label: "veilleurs inscrits" },
    { icon: LuBookHeart, key: "books", label: "livres référencés" },
    { icon: LuStar, key: "reviews", label: "critiques écrites" },
];

export const FAQ: FaqEntry[] = [
    {
        q: "Comment ajouter un livre à mes rayons ?",
        a: "Depuis la fiche d'un livre, touchez « Ajouter à ma bibliothèque », puis choisissez le rayon : À lire, En cours ou Lu. Vous pouvez créer vos propres rayons depuis votre profil et y glisser les ouvrages à tout moment.",
    },
    {
        q: "Comment gagne-t-on de l'XP, des niveaux et des titres ?",
        a: "Chaque lecture terminée, chaque critique publiée et chaque journée de veille consécutive vous rapportent des points d'expérience. En franchissant les paliers, vous gravissez les rangs et débloquez des titres honorifiques affichés sur votre profil.",
    },
    {
        q: "Comment signaler une critique ou un contenu déplacé ?",
        a: "Sous chaque critique, le menu « … » propose « Signaler ». Indiquez le motif : notre équipe de modération examine chaque signalement et intervient dans les meilleurs délais.",
    },
    {
        q: "Mes données de lecture sont-elles protégées ?",
        a: "Vos données ne sont jamais cédées à des fins commerciales. Vous gardez la main sur la visibilité de vos rayons et de vos critiques. Le détail des traitements figure dans notre Politique de confidentialité.",
    },
    {
        q: "Puis-je rendre ma bibliothèque privée ?",
        a: "Oui. Dans Réglages › Confidentialité, basculez votre bibliothèque, vos rayons ou vos critiques en « Privé ». Vous restez alors seul à les consulter, tout en continuant de cumuler votre XP.",
    },
    {
        q: "Comment supprimer mon compte ?",
        a: "Depuis Réglages › Compte › « Fermer la veillée ». La suppression est définitive après un délai de grâce de 30 jours, durant lequel vous pouvez encore vous raviser et tout récupérer.",
    },
];

export const USEFUL_LINKS: UsefulLink[] = [
    { icon: LuLifeBuoy, label: "Centre d'aide", href: "#" },
    {
        icon: LuFileText,
        label: "Mentions légales",
        href: "/terms-of-use",
        internal: true,
        sister: true,
    },
    { icon: LuLock, label: "Politique de confidentialité", href: "#" },
    { icon: LuShield, label: "Conditions d'utilisation", href: "#" },
];
