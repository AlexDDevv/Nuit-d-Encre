import { useMemo, useSyncExternalStore } from "react";

// Miroir des breakpoints Tailwind : `xs` redéfini dans src/styles/theme.css,
// le reste correspond aux défauts de Tailwind 4.
export const BREAKPOINTS = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function useMediaQuery(query: string): boolean {
    const mediaQueryList = useMemo(() => window.matchMedia(query), [query]);

    const subscribe = useMemo(
        () => (callback: () => void) => {
            mediaQueryList.addEventListener("change", callback);
            return () => mediaQueryList.removeEventListener("change", callback);
        },
        [mediaQueryList],
    );

    return useSyncExternalStore(subscribe, () => mediaQueryList.matches);
}

/** Même borne que les variants `max-*:` de Tailwind : `(width < Npx)`. */
export function useIsBelow(breakpoint: Breakpoint): boolean {
    return useMediaQuery(`(width < ${BREAKPOINTS[breakpoint]}px)`);
}

/** Même borne que les variants `md:`, `lg:`… de Tailwind : `(width >= Npx)`. */
export function useIsAbove(breakpoint: Breakpoint): boolean {
    return useMediaQuery(`(width >= ${BREAKPOINTS[breakpoint]}px)`);
}
