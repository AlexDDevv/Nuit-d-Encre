import { useEffect, useRef } from "react";

/**
 * Convertit la molette verticale en défilement horizontal sur un conteneur
 * débordant (souris sans molette horizontale). Aux extrémités, la page
 * reprend la main pour ne pas bloquer le scroll vertical.
 */
export function useWheelHorizontalScroll<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const onWheel = (event: WheelEvent) => {
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
            const maxScroll = element.scrollWidth - element.clientWidth;
            if (maxScroll <= 0) return;
            const atStart = element.scrollLeft <= 1 && event.deltaY < 0;
            const atEnd =
                element.scrollLeft >= maxScroll - 1 && event.deltaY > 0;
            if (atStart || atEnd) return;
            event.preventDefault();
            element.scrollLeft += event.deltaY;
        };

        element.addEventListener("wheel", onWheel, { passive: false });
        return () => element.removeEventListener("wheel", onWheel);
    }, []);

    return ref;
}
