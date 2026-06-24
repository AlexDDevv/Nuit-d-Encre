import { SidebarFooterProps } from "@/types/types";
import { cn } from "@/lib/utils";
import { SOCIAL_LINKS } from "@/data/socials";
import Button from "@/components/UI/Button";

export default function SidebarFooter({
    collapsed,
    isAuthenticated,
}: SidebarFooterProps) {
    return (
        <footer
            className={cn(
                "flex flex-col",
                !isAuthenticated && "border-border gap-3 border-t p-4",
            )}
        >
            {!isAuthenticated && (
                <div
                    className={cn(
                        "overflow-hidden",
                        collapsed
                            ? "max-h-0 opacity-0 transition-all duration-150"
                            : "max-h-10 opacity-100 transition-all delay-150 duration-200",
                    )}
                >
                    <small className="text-muted-foreground text-xs">
                        &copy; 2026 - Alexis Delporte
                    </small>
                </div>
            )}
            {!isAuthenticated && (
                <ul
                    className={cn(
                        "flex items-center gap-2",
                        collapsed && "flex-col",
                    )}
                    aria-label="Réseaux sociaux"
                >
                    {SOCIAL_LINKS.map(({ icon: Icon, url, label }) => (
                        <li key={label}>
                            <Button
                                variant="social"
                                size="square"
                                to={url}
                                ariaLabel={`Profil ${label}`}
                                title={label}
                                children={<Icon />}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </footer>
    );
}
