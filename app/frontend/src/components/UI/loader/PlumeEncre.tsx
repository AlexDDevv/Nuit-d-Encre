import type { LoaderGlyphProps } from "@/types";

const GOLD = "hsl(43 59% 81%)";

/**
 * Concept III · PLUME & ENCRE — la plume court et trace un filet doré ; l'encre
 * se diffuse en cercles à la pointe de départ. Animation portée par les classes
 * `plume-*` (cf. loader-nocturne.css).
 */
export default function PlumeEncre({
    size = 220,
    className,
}: LoaderGlyphProps) {
    return (
        <svg
            width={size}
            height={(size * 100) / 180}
            viewBox="0 0 180 100"
            role="img"
            aria-label="Plume et encre"
            className={className}
        >
            {/* diffusion d'encre au point de départ */}
            <g transform="translate(24 66)">
                <circle
                    className="plume-ripple"
                    r="6"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth="1.4"
                    opacity="0"
                />
                <circle
                    className="plume-ripple r2"
                    r="6"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth="1.2"
                    opacity="0"
                />
                <circle
                    className="plume-ripple r3"
                    r="6"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth="1"
                    opacity="0"
                />
                <circle r="2.4" fill={GOLD} />
            </g>

            {/* la ligne dorée qui se trace */}
            <path
                className="plume-line"
                data-draw
                d="M24,66 C58,66 72,52 104,54 C134,56 148,49 162,54"
                fill="none"
                stroke={GOLD}
                strokeWidth="2.6"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="0"
            />

            {/* la plume qui écrit */}
            <g transform="translate(12 22)">
                <g className="plume-quill">
                    <path
                        d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"
                        fill="hsl(43 40% 50% / 0.25)"
                        stroke={GOLD}
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    <line
                        x1="16"
                        y1="8"
                        x2="2.5"
                        y2="21.5"
                        stroke={GOLD}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                    <line
                        x1="17"
                        y1="14.5"
                        x2="9"
                        y2="14.5"
                        stroke={GOLD}
                        strokeWidth="1.4"
                        strokeLinecap="round"
                    />
                </g>
            </g>
        </svg>
    );
}
