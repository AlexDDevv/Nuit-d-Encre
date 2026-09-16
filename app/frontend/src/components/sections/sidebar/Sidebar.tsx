import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import {
    AnimatePresence,
    MotionConfig,
    motion,
    Transition,
} from "motion/react";
import { useLocalStorage } from "@/hooks/storage/useLocalStorage";
import { useIsAbove } from "@/hooks/responsive/useMediaQuery";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import SidebarHeader from "./SidebarHeader";
import SidebarFavorites from "./SidebarFavorites";
import SidebarActionButton from "./SidebarActionButton";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";
import SidebarOverlay from "./SidebarOverlay";
import Button from "@/components/UI/Button";

// Entrée décélérée (le panneau « se pose »), sortie accélérée et plus brève.
const drawerOpenTransition: Transition = {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1],
};
const drawerCloseTransition: Transition = {
    duration: 0.3,
    ease: [0.4, 0, 1, 1],
};

export default function Sidebar() {
    const { user } = useAuthContext();
    const [collapsed, setCollapsed] = useLocalStorage(
        "sidebar-collapsed",
        false,
    );
    const [overlayOpen, setOverlayOpen] = useState(false);
    const { key: locationKey } = useLocation();
    const [lastLocationKey, setLastLocationKey] = useState(locationKey);
    // Uniquement des bornes `>=` (md/lg de Tailwind) : un couple max-width 767px
    // / min-width 768px laisse un trou aux largeurs fractionnaires (zoom, mise à
    // l'échelle Windows) où le rendu desktop déplié s'affichait une frame.
    const isMdUp = useIsAbove("md");
    const isLgUp = useIsAbove("lg");
    const isMobile = !isMdUp;
    const isTablet = isMdUp && !isLgUp;

    // La sidebar vit dans le layout racine : React Router ne la démonte jamais,
    // l'overlay survivrait donc à la navigation. On le referme pendant le rendu
    // plutôt que dans un effet, pour que l'animation de sortie démarre dès la
    // première frame de la nouvelle page. `key` change à chaque navigation — y
    // compris vers la route courante et lors des retours navigateur — là où
    // `pathname` resterait identique.
    if (locationKey !== lastLocationKey) {
        setLastLocationKey(locationKey);
        setOverlayOpen(false);
    }

    const isSmallScreen = isMobile || isTablet;
    // Sur mobile le panneau n'est visible qu'ouvert : on le fige déplié pour
    // que son contenu ne se replie pas pendant l'animation de sortie.
    const isEffectivelyCollapsed = isMobile
        ? false
        : isTablet
          ? !overlayOpen
          : collapsed;

    const handleToggle = useCallback(() => {
        if (isSmallScreen) {
            setOverlayOpen((prev) => !prev);
        } else {
            setCollapsed((prev) => !prev);
        }
    }, [isSmallScreen, setCollapsed]);

    const handleOverlayClose = useCallback(() => {
        setOverlayOpen(false);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Escape" && overlayOpen) {
                setOverlayOpen(false);
            }
        },
        [overlayOpen],
    );

    const sidebarContent = (
        <>
            <SidebarHeader
                collapsed={isEffectivelyCollapsed}
                onToggle={handleToggle}
            />
            <SidebarFavorites collapsed={isEffectivelyCollapsed} />
            <SidebarActionButton collapsed={isEffectivelyCollapsed} />
            <SidebarNav collapsed={isEffectivelyCollapsed} />
            <SidebarFooter
                collapsed={isEffectivelyCollapsed}
                isAuthenticated={!!user}
            />
        </>
    );

    // Tablet: collapsed sidebar + overlay when open
    if (isTablet) {
        return (
            <>
                <SidebarOverlay
                    visible={overlayOpen}
                    onClose={handleOverlayClose}
                />
                <aside
                    aria-label="Navigation principale"
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "bg-card border-border flex shrink-0 flex-col overflow-hidden border-r transition-[width] duration-300 ease-in-out",
                        overlayOpen
                            ? "fixed inset-y-0 left-0 z-50 w-64 shadow-lg"
                            : "w-18 sticky top-0 h-screen",
                    )}
                >
                    {sidebarContent}
                </aside>
            </>
        );
    }

    // Mobile : le burger reste monté (pas de saut de mise en page) et le
    // panneau glisse depuis la gauche au-dessus d'un voile en fondu.
    if (isMobile) {
        return (
            <MotionConfig reducedMotion="user">
                <div className="bg-card/85 fixed left-4 top-4 z-30 rounded-lg shadow-md backdrop-blur-sm">
                    <Button
                        variant="hamburger"
                        onClick={handleToggle}
                        ariaLabel="Ouvrir la navigation"
                        icon={<LuMenu />}
                    />
                </div>
                <SidebarOverlay
                    visible={overlayOpen}
                    onClose={handleOverlayClose}
                />
                <AnimatePresence>
                    {overlayOpen && (
                        <motion.aside
                            key="mobile-sidebar"
                            aria-label="Navigation principale"
                            onKeyDown={handleKeyDown}
                            className="bg-card border-border fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r shadow-2xl"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0, transition: drawerOpenTransition }}
                            exit={{
                                x: "-100%",
                                transition: drawerCloseTransition,
                            }}
                        >
                            {sidebarContent}
                        </motion.aside>
                    )}
                </AnimatePresence>
            </MotionConfig>
        );
    }

    // Desktop: fixed sidebar
    return (
        <aside
            aria-label="Navigation principale"
            className={cn(
                "bg-card border-border sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r transition-[width] duration-300 ease-in-out",
                collapsed ? "w-18" : "w-64",
            )}
        >
            {sidebarContent}
        </aside>
    );
}
