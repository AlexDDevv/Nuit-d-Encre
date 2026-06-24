import type { LoaderGlyphProps } from "@/types";

const GOLD = "hsl(43 59% 81%)";
const AMBER = "hsl(25 78% 51%)";

/**
 * Concept I · CHANDELLE — une flamme d'or et d'ambre qui vacille, un halo qui
 * respire, deux volutes qui s'élèvent. Animation portée par les classes
 * `cand-*` (cf. loader-nocturne.css).
 */
export default function Chandelle({ size = 200, className }: LoaderGlyphProps) {
    return (
        <svg
            width={size}
            height={(size * 130) / 120}
            viewBox="0 0 120 130"
            role="img"
            aria-label="Chandelle"
            className={className}
        >
            <defs>
                <radialGradient id="cd-halo" cx="50%" cy="46%" r="55%">
                    <stop
                        offset="0%"
                        stopColor="hsl(43 70% 70%)"
                        stopOpacity="0.55"
                    />
                    <stop
                        offset="45%"
                        stopColor="hsl(38 65% 58%)"
                        stopOpacity="0.22"
                    />
                    <stop
                        offset="100%"
                        stopColor="hsl(38 65% 58%)"
                        stopOpacity="0"
                    />
                </radialGradient>
                <linearGradient
                    id="cd-flame"
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2="100%"
                >
                    <stop offset="0%" stopColor="hsl(43 80% 86%)" />
                    <stop offset="42%" stopColor={GOLD} />
                    <stop offset="100%" stopColor={AMBER} />
                </linearGradient>
                <linearGradient id="cd-wax" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(43 30% 30%)" />
                    <stop offset="100%" stopColor="hsl(20 6% 16%)" />
                </linearGradient>
            </defs>

            {/* halo qui respire */}
            <circle
                className="cand-halo"
                cx="60"
                cy="54"
                r="40"
                fill="url(#cd-halo)"
            />

            {/* volutes (uniquement en mouvement) — placement sur un <g> parent
                statique, l'animation reste sur le <g> enfant */}
            <g transform="translate(58 20)">
                <g className="cand-wisp">
                    <path
                        d="M0,0 q-6,-7 0,-13 q6,-6 0,-13"
                        fill="none"
                        stroke={GOLD}
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.5"
                    />
                </g>
            </g>
            <g transform="translate(62 18)">
                <g className="cand-wisp w2">
                    <path
                        d="M0,0 q6,-7 0,-14 q-6,-6 0,-13"
                        fill="none"
                        stroke={GOLD}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.4"
                    />
                </g>
            </g>

            {/* chandelle */}
            <rect
                x="49"
                y="72"
                width="22"
                height="48"
                rx="4"
                fill="url(#cd-wax)"
                stroke="hsl(43 59% 81% / 0.32)"
                strokeWidth="1.2"
            />
            <ellipse cx="60" cy="72" rx="11" ry="3.2" fill="hsl(43 40% 40%)" />
            <line
                x1="60"
                y1="64"
                x2="60"
                y2="72"
                stroke="hsl(43 30% 30%)"
                strokeWidth="1.6"
                strokeLinecap="round"
            />

            {/* flamme */}
            <path
                className="cand-flame"
                d="M60,24 C49,40 47,52 60,65 C73,52 71,40 60,24 Z"
                fill="url(#cd-flame)"
            />
            <path
                className="cand-core"
                d="M60,37 C54,47 53,55 60,64 C67,55 66,47 60,37 Z"
                fill="hsl(43 85% 90%)"
            />
            <circle
                className="cand-core"
                cx="60"
                cy="60"
                r="2.4"
                fill="#fff"
                opacity="0.9"
            />
        </svg>
    );
}
