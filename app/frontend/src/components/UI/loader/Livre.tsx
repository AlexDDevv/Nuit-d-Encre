import type { CSSProperties } from "react";
import type { LoaderGlyphProps } from "@/types";

/**
 * Concept IV · LIVRE REVISITÉ — le loader « livre qui se feuillette » historique,
 * repris en or et en matière (3D CSS) : des pages qui tournent, sobrement.
 * Animation portée par les classes `nb-*` (cf. loader-nocturne.css).
 */
export default function Livre({ size = 220, className }: LoaderGlyphProps) {
    return (
        <div
            className={`nb-stage ${className ?? ""}`}
            style={{ width: size, height: size * 0.82 }}
            role="img"
            aria-label="Livre que l'on feuillette"
        >
            <div
                className="nb-book"
                style={{ "--bk": size / 210 } as CSSProperties}
            >
                <div className="nb-base" />
                <div className="nb-leaf l1" />
                <div className="nb-leaf l2" />
                <div className="nb-leaf l3" />
            </div>
        </div>
    );
}
