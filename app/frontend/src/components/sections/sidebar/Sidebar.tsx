import { useState, useCallback } from "react";
import { LuMenu } from "react-icons/lu";
import { useLocalStorage } from "@/hooks/storage/useLocalStorage";
import { useMediaQuery } from "@/hooks/responsive/useMediaQuery";
import { cn } from "@/lib/utils";
import SidebarHeader from "./SidebarHeader";
import SidebarWelcome from "./SidebarWelcome";
import SidebarFavorites from "./SidebarFavorites";
import SidebarActionButton from "./SidebarActionButton";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";
import SidebarOverlay from "./SidebarOverlay";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useLocalStorage("sidebar-collapsed", false);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

    const isSmallScreen = isMobile || isTablet;
    const isEffectivelyCollapsed = isSmallScreen ? !overlayOpen : collapsed;

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

    // Mobile: hamburger button only, sidebar hidden
    if (isMobile && !overlayOpen) {
        return (
            <button
                onClick={handleToggle}
                className="bg-card border-border text-card-foreground fixed top-6 left-6 z-50 rounded-md border p-2 shadow-md"
                aria-label="Ouvrir la navigation"
            >
                <LuMenu className="h-5 w-5" />
            </button>
        );
    }

    const sidebarContent = (
        <>
            <SidebarHeader
                collapsed={isEffectivelyCollapsed}
                onToggle={handleToggle}
            />

            <hr className="border-border" />

            <SidebarWelcome collapsed={isEffectivelyCollapsed} />

            <SidebarFavorites collapsed={isEffectivelyCollapsed} />

            <SidebarActionButton collapsed={isEffectivelyCollapsed} />

            <SidebarNav collapsed={isEffectivelyCollapsed} />

            <SidebarFooter collapsed={isEffectivelyCollapsed} />
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
                        "bg-card border-border flex flex-col gap-4 border-r p-4 transition-all duration-300",
                        overlayOpen
                            ? "fixed inset-y-0 left-0 z-50 w-64 shadow-lg"
                            : "sticky top-0 h-screen w-16",
                    )}
                >
                    {sidebarContent}
                </aside>
            </>
        );
    }

    // Mobile overlay (when overlayOpen is true)
    if (isMobile && overlayOpen) {
        return (
            <>
                <SidebarOverlay
                    visible={true}
                    onClose={handleOverlayClose}
                />
                <aside
                    aria-label="Navigation principale"
                    onKeyDown={handleKeyDown}
                    className="bg-card fixed inset-y-0 left-0 z-50 flex w-64 flex-col gap-4 p-4 shadow-lg transition-transform duration-300"
                >
                    {sidebarContent}
                </aside>
            </>
        );
    }

    // Desktop: fixed sidebar
    return (
        <aside
            aria-label="Navigation principale"
            className={cn(
                "bg-card border-border sticky top-0 flex h-screen flex-col gap-4 border-r p-4 transition-all duration-300",
                collapsed ? "w-16" : "w-64",
            )}
        >
            {sidebarContent}
        </aside>
    );
}
