import type { LoaderGlyphProps } from "@/types";

const GOLD = "hsl(43 59% 81%)";

interface DiamondProps {
    x: number;
    y: number;
    cls: string;
}

/** Losange ◆ qui ponctue le filet doré (pulsation décalée selon `cls`). */
function Diamond({ x, y, cls }: DiamondProps) {
    return (
        <g transform={`translate(${x} ${y})`}>
            <rect
                className={`med-diamond ${cls}`}
                x="-3.6"
                y="-3.6"
                width="7.2"
                height="7.2"
                rx="1"
                fill={GOLD}
            />
        </g>
    );
}

/**
 * Concept II · MÉDAILLON LUNAIRE — l'emblème doré se révèle : l'anneau pointillé
 * tourne, le filet se trace au compas, le croissant respire, les losanges
 * ponctuent. Animation portée par les classes `med-*` (cf. loader-nocturne.css).
 */
export default function Medaillon({ size = 200, className }: LoaderGlyphProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 120 120"
            role="img"
            aria-label="Médaillon lunaire"
            className={className}
        >
            <defs>
                <radialGradient id="md-fill" cx="50%" cy="42%" r="60%">
                    <stop
                        offset="0%"
                        stopColor="hsl(43 45% 50%)"
                        stopOpacity="0.18"
                    />
                    <stop
                        offset="100%"
                        stopColor="hsl(43 45% 50%)"
                        stopOpacity="0"
                    />
                </radialGradient>
            </defs>

            <circle cx="60" cy="60" r="49" fill="url(#md-fill)" />
            {/* anneau pointillé qui tourne lentement */}
            <circle
                className="med-spin"
                cx="60"
                cy="60"
                r="47"
                fill="none"
                stroke="hsl(43 59% 81% / 0.4)"
                strokeWidth="1.4"
                strokeDasharray="1.5 7"
                strokeLinecap="round"
            />
            {/* filet doré principal qui se trace */}
            <circle
                className="med-trace"
                data-draw
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke={GOLD}
                strokeWidth="2.6"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="0"
                transform="rotate(-90 60 60)"
            />
            {/* anneau intérieur fin (sceau) */}
            <circle
                cx="60"
                cy="60"
                r="32"
                fill="none"
                stroke="hsl(43 59% 81% / 0.22)"
                strokeWidth="1"
            />

            {/* croissant de lune (emblème) */}
            <g transform="translate(36 36) scale(2)">
                <path
                    className="med-moon"
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </g>

            {/* losanges ◆ qui ponctuent le filet */}
            <Diamond x={60} y={13} cls="d1" />
            <Diamond x={107} y={60} cls="d2" />
            <Diamond x={60} y={107} cls="d3" />
            <Diamond x={13} y={60} cls="d2" />
        </svg>
    );
}
