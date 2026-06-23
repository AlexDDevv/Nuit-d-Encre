import type { ReactNode } from "react";
import type { ErrorMotif } from "@/types/types";

/**
 * Illustrations sur mesure des pages d'erreur - motifs littéraires de la
 * bibliothèque nocturne. Trait doré (`currentColor`), remplissages discrets,
 * viewBox 0 0 120 120. Une déclinaison par type d'erreur.
 */
function Plate({ children, size = 150 }: { children: ReactNode; size?: number }) {
    return (
        <svg
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

/** 404 - rayon de bibliothèque vide (un livre manque au grand registre). */
function ShelfVoid({ size }: { size?: number }) {
    return (
        <Plate size={size}>
            <path d="M18 40h84M18 76h84" strokeWidth="2.2" opacity="0.75" />
            <path d="M22 40v36M98 40v36" strokeWidth="2.2" opacity="0.55" />
            <rect x="27" y="50" width="8" height="26" rx="1.5" strokeWidth="2" opacity="0.85" />
            <rect x="37" y="46" width="7" height="30" rx="1.5" strokeWidth="2" opacity="0.85" />
            <path d="M46 76V53l9-2v25z" strokeWidth="2" opacity="0.7" />
            <rect x="60" y="49" width="11" height="27" rx="1.5" strokeWidth="1.6" strokeDasharray="3 4" opacity="0.5" />
            <path d="M86 76V50l8 3v23z" strokeWidth="2" opacity="0.85" />
            <rect x="76" y="55" width="7" height="21" rx="1.5" strokeWidth="2" opacity="0.6" transform="rotate(8 79 65)" />
            <circle cx="66" cy="60" r="0.9" fill="currentColor" stroke="none" opacity="0.5" />
            <circle cx="63" cy="67" r="0.7" fill="currentColor" stroke="none" opacity="0.4" />
            <circle cx="68" cy="71" r="0.7" fill="currentColor" stroke="none" opacity="0.4" />
            <path d="M60 90l3 3-3 3-3-3z" strokeWidth="1.4" opacity="0.6" />
        </Plate>
    );
}

/** 500 - chandelle soufflée, volute de fumée. */
function SnuffedCandle({ size }: { size?: number }) {
    return (
        <Plate size={size}>
            <path className="smoke-path" d="M60 36c6-5-4-9 1-14 4-4-2-7 1-11" strokeWidth="1.8" opacity="0.6" />
            <path className="smoke-path" d="M60 36c-5-4 3-8-1-12" strokeWidth="1.4" opacity="0.4" style={{ animationDelay: ".5s" }} />
            <path d="M60 44v-7" strokeWidth="2.4" opacity="0.85" />
            <circle cx="60" cy="36.5" r="1.4" fill="currentColor" stroke="none" opacity="0.55" />
            <path d="M52 44h16v34H52z" strokeWidth="2.2" opacity="0.85" />
            <path d="M52 50c4 2 12 2 16 0" strokeWidth="1.4" opacity="0.45" />
            <path d="M64 44c1 5-1 7 0 11" strokeWidth="1.3" opacity="0.4" />
            <path d="M46 78h28l-4 6H50z" strokeWidth="2.2" opacity="0.85" />
            <path d="M57 84v8M63 84v8" strokeWidth="2" opacity="0.7" />
            <path d="M44 100c4-6 28-6 32 0z" strokeWidth="2.2" opacity="0.85" />
            <path d="M40 104h40" strokeWidth="2.4" opacity="0.7" />
        </Plate>
    );
}

/** 403 - sceau de cire brisé (autorisation rompue). */
function BrokenSeal({ size }: { size?: number }) {
    return (
        <Plate size={size}>
            <path d="M46 78 36 102l8-4 3 8 6-20z" strokeWidth="1.8" opacity="0.5" />
            <path d="M74 78 84 102l-8-4-3 8-6-20z" strokeWidth="1.8" opacity="0.5" />
            <path d="M58 36a24 24 0 0 0-9 44l9-6-3-9 4-7-4-8 4-6z" strokeWidth="2.2" opacity="0.9" />
            <path d="M64 35a24 24 0 0 1 8 45l-8-7 3-8-4-7 4-8-3-8z" strokeWidth="2.2" opacity="0.9" />
            <path d="M61 33l-2 9 3 7-3 8 3 9-2 8" strokeWidth="1.4" strokeDasharray="2 3" opacity="0.55" />
            <path d="M68 54a8 8 0 1 1-7-7 6 6 0 0 0 7 7z" strokeWidth="1.4" opacity="0.5" />
        </Plate>
    );
}

/** 401 - grimoire fermé à fermoir verrouillé (connexion requise). */
function LockedTome({ size }: { size?: number }) {
    return (
        <Plate size={size}>
            <path d="M34 40h44a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H40" strokeWidth="2.2" opacity="0.85" />
            <path d="M34 40a6 6 0 0 0-6 6v40a6 6 0 0 0 6 6" strokeWidth="2.2" opacity="0.85" />
            <path d="M34 40v52" strokeWidth="2" opacity="0.6" />
            <path d="M40 50h38M40 60h38M40 72h38M40 82h38" strokeWidth="1.2" opacity="0.3" />
            <path d="M58 36v8M58 88v8" strokeWidth="2.4" opacity="0.7" />
            <rect x="50" y="58" width="20" height="16" rx="3" strokeWidth="2.2" opacity="0.9" />
            <path d="M54 58v-4a6 6 0 0 1 12 0v4" strokeWidth="2" opacity="0.85" />
            <circle cx="60" cy="64" r="2" strokeWidth="1.6" opacity="0.7" />
            <path d="M60 66v4" strokeWidth="1.6" opacity="0.7" />
        </Plate>
    );
}

/** 400 - marque-page égaré (requête mal formée). */
function StrayBookmark({ size }: { size?: number }) {
    return (
        <Plate size={size}>
            <path d="M60 44c-9-6-20-6-30-2v44c10-4 21-4 30 2" strokeWidth="2.2" opacity="0.85" />
            <path d="M60 44c9-6 20-6 30-2v44c-10-4-21-4-30 2" strokeWidth="2.2" opacity="0.85" />
            <path d="M60 44v44" strokeWidth="2" opacity="0.55" />
            <path d="M38 54h14M38 60h14M38 66h11" strokeWidth="1.1" opacity="0.3" />
            <path d="M68 54h14M68 60h14M71 66h11" strokeWidth="1.1" opacity="0.3" />
            <path d="M70 30l16 5-5 17-7-3-5 5 1-24z" strokeWidth="2" opacity="0.9" transform="rotate(14 78 42)" />
            <path d="M74 36l8 2.5" strokeWidth="1.2" opacity="0.45" transform="rotate(14 78 42)" />
        </Plate>
    );
}

/** défaut - encrier renversé, tache d'encre (erreur inattendue). */
function SpilledInk({ size }: { size?: number }) {
    return (
        <Plate size={size}>
            <path
                d="M30 92c-4-8 6-10 4-16 8 2 10-6 16-3 3-7 12-3 13 3 7-1 9 6 6 11-2 6-12 9-24 8-9-1-14-2-15-3z"
                strokeWidth="1.8"
                opacity="0.55"
                fill="currentColor"
                fillOpacity="0.06"
            />
            <circle cx="74" cy="90" r="1.4" fill="currentColor" stroke="none" opacity="0.45" />
            <circle cx="80" cy="84" r="1" fill="currentColor" stroke="none" opacity="0.4" />
            <g transform="rotate(-32 56 60)">
                <path d="M44 44h24v8H44z" strokeWidth="2.2" opacity="0.85" />
                <path d="M46 52h20v18a4 4 0 0 1-4 4H50a4 4 0 0 1-4-4z" strokeWidth="2.2" opacity="0.85" />
                <path d="M52 44v-5h8v5" strokeWidth="1.8" opacity="0.6" />
            </g>
            <path d="M86 40c-10 6-22 22-30 40" strokeWidth="1.8" opacity="0.55" />
            <path d="M86 40c2 5 0 11-4 14" strokeWidth="1.6" opacity="0.45" />
            <path d="M64 64c-3 2-5 6-6 10" strokeWidth="1.2" opacity="0.35" />
        </Plate>
    );
}

const ILLUSTRATIONS: Record<ErrorMotif, (props: { size?: number }) => ReactNode> = {
    emptyShelf: ShelfVoid,
    candle: SnuffedCandle,
    brokenSeal: BrokenSeal,
    lockedTome: LockedTome,
    bookmark: StrayBookmark,
    inkwell: SpilledInk,
};

/** Rend l'illustration littéraire correspondant à un motif d'erreur. */
export default function ErrorIllustration({
    motif,
    size = 156,
}: {
    motif: ErrorMotif;
    size?: number;
}) {
    const Illo = ILLUSTRATIONS[motif];
    return <Illo size={size} />;
}
