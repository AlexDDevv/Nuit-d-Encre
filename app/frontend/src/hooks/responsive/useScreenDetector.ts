import { useEffect, useState, useMemo } from "react";

/**
 * @description Represents the current screen size and type.
 * Contains boolean flags indicating whether the screen is considered
 * mobile, tablet, or desktop, along with the current width in pixels.
 */
export type ScreenSizes = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isMobileOrTablet: boolean;
    width: number;
};

/**
 * @description React hook to detect the current screen size and type.
 *
 * @returns {ScreenSizes} Object containing boolean flags for mobile, tablet, desktop, and current width
 *
 * @example
 * ```tsx
 * import { useScreenDetector } from "./useScreenDetector";
 *
 * const ResponsiveComponent = () => {
 *   const { isMobile, isTablet, isDesktop, width } = useScreenDetector();
 *
 *   return (
 *     <div>
 *       <p>Screen width: {width}px</p>
 *       {isMobile && <p>Showing mobile layout</p>}
 *       {isTablet && !isMobile && <p>Showing tablet layout</p>}
 *       {isDesktop && <p>Showing desktop layout</p>}
 *     </div>
 *   )
 * }
 * ```
 */
export const useScreenDetector = (): ScreenSizes | null => {
    const [width, setWidth] = useState<number | null>(null);

    useEffect(() => {
        const update = () => setWidth(window.innerWidth);

        update();

        window.addEventListener("resize", update);

        return () => window.removeEventListener("resize", update);
    }, []);

    const screenSizes = useMemo(
        () =>
            width === null
                ? null
                : {
                      width,
                      isMobile: width <= 768,
                      isTablet: width > 768 && width <= 1024,
                      isMobileOrTablet: width <= 1024,
                      isDesktop: width > 1024,
                  },
        [width],
    );

    return screenSizes;
};
