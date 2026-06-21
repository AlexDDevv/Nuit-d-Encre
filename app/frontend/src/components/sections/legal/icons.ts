import type { IconType } from "react-icons";
import {
    LuCookie,
    LuFeather,
    LuGavel,
    LuMoon,
    LuScale,
    LuScroll,
    LuServer,
    LuShield,
} from "react-icons/lu";

// Table nom → composant : la donnée (legal.json) référence l'icône par chaîne.
export const LEGAL_ICONS = {
    Scroll: LuScroll,
    Server: LuServer,
    Feather: LuFeather,
    Shield: LuShield,
    Cookie: LuCookie,
    Scale: LuScale,
    Gavel: LuGavel,
    Moon: LuMoon,
} satisfies Record<string, IconType>;

export type LegalIconName = keyof typeof LEGAL_ICONS;
