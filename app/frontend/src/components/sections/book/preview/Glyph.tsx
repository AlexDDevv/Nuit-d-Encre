import { CSSProperties, ReactNode } from "react";

// Tracés lucide en SVG inline pour éviter un nouvel import lucide-react.
export type GlyphName =
    | "arrowL"
    | "import"
    | "external"
    | "user"
    | "userPlus"
    | "globe"
    | "quote";

const GLYPHS: Record<GlyphName, ReactNode> = {
    arrowL: (
        <>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
        </>
    ),
    import: (
        <>
            <path d="M12 3v11" />
            <polyline points="7 9.5 12 14.5 17 9.5" />
            <path d="M5 20h14" />
        </>
    ),
    external: (
        <>
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </>
    ),
    user: (
        <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </>
    ),
    userPlus: (
        <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
        </>
    ),
    globe: (
        <>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
    ),
    quote: (
        <>
            <path d="M7 7h4v4c0 2.2-1.3 3.7-3.5 4.2" />
            <path d="M15 7h4v4c0 2.2-1.3 3.7-3.5 4.2" />
        </>
    ),
};

export function Glyph({
    name,
    size = 16,
    className,
    style,
}: {
    name: GlyphName;
    size?: number;
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={style}
            aria-hidden="true"
            focusable="false"
        >
            {GLYPHS[name]}
        </svg>
    );
}
