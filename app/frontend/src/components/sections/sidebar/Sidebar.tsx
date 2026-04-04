import { useState, useCallback } from "react";
import { LuMenu } from "react-icons/lu";
import { useLocalStorage } from "@/hooks/storage/useLocalStorage";
import { useMediaQuery } from "@/hooks/responsive/useMediaQuery";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import SidebarHeader from "./SidebarHeader";
import SidebarFavorites from "./SidebarFavorites";
import SidebarActionButton from "./SidebarActionButton";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";
import SidebarOverlay from "./SidebarOverlay";
import Button from "@/components/UI/Button";

export default function Sidebar() {
    const { user } = useAuthContext();
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
            <Button
                variant="hamburger"
                onClick={handleToggle}
                ariaLabel="Ouvrir la navigation"
                icon={<LuMenu />}
                className="p-2"
            />
        );
    }

    const sidebarContent = (
        <>
            <SidebarHeader
                collapsed={isEffectivelyCollapsed}
                onToggle={handleToggle}
            />
            <SidebarFavorites collapsed={isEffectivelyCollapsed} />
            <SidebarActionButton collapsed={isEffectivelyCollapsed} />
            <SidebarNav collapsed={isEffectivelyCollapsed} />
            <SidebarFooter collapsed={isEffectivelyCollapsed} isAuthenticated={!!user} />
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
                        "bg-card border-border flex flex-col overflow-hidden border-r transition-[width] duration-300 ease-in-out",
                        overlayOpen
                            ? "fixed inset-y-0 left-0 z-50 w-64 shadow-lg"
                            : "sticky top-0 h-screen w-18",
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
                    className="bg-card fixed inset-y-0 left-0 z-50 flex w-64 flex-col shadow-lg transition-transform duration-300"
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
                "bg-card border-border sticky top-0 flex h-screen flex-col overflow-hidden border-r transition-[width] duration-300 ease-in-out",
                collapsed ? "w-18" : "w-64",
            )}
        >
            {sidebarContent}
        </aside>
    );
}
