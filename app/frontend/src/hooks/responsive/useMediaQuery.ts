import { useSyncExternalStore, useCallback } from "react";

export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (callback: () => void) => {
            const mediaQueryList = window.matchMedia(query);
            mediaQueryList.addEventListener("change", callback);
            return () => mediaQueryList.removeEventListener("change", callback);
        },
        [query],
    );

    const getSnapshot = useCallback(
        () => window.matchMedia(query).matches,
        [query],
    );

    const getServerSnapshot = useCallback(() => false, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
