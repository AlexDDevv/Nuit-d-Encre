import { useCallback, useEffect, useRef, useState } from "react";
import { UseModalTransitionOptions } from "@/types/types";

/** Durée de l'animation de sortie (`.modal-out` / `.overlay-out` dans index.css). */
export const MODAL_EXIT_MS = 200;

type ExitPhase = null | "request" | "external" | "done";

/**
 * Anime l'ouverture et la fermeture d'une modale en CSS, sans librairie.
 *
 * - `requestClose()` joue l'animation de sortie puis appelle `onClose`
 *   (modales montées conditionnellement par leur parent).
 * - Si `isOpen` passe à `false` depuis le parent, la modale reste montée
 *   le temps de l'animation (`mounted`) avant de disparaître.
 */
export function useModalTransition({
    isOpen = true,
    onClose,
}: UseModalTransitionOptions) {
    const [phase, setPhase] = useState<ExitPhase>(null);
    const [wasOpen, setWasOpen] = useState(isOpen);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    if (isOpen !== wasOpen) {
        setWasOpen(isOpen);
        if (isOpen) setPhase(null);
        else if (phase === null) setPhase("external");
    }

    useEffect(() => {
        if (phase !== "request" && phase !== "external") return;
        const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const timer = setTimeout(
            () => {
                setPhase("done");
                if (phase === "request") onCloseRef.current();
            },
            reduced ? 0 : MODAL_EXIT_MS,
        );
        return () => clearTimeout(timer);
    }, [phase]);

    const requestClose = useCallback(() => {
        setPhase((current) =>
            current === "request" || current === "external"
                ? current
                : "request",
        );
    }, []);

    const closing = phase === "request" || phase === "external";

    return {
        mounted: closing || (isOpen && phase !== "done"),
        closing,
        requestClose,
    };
}
