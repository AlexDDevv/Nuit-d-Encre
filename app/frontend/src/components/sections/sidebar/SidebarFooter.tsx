import { LuGithub, LuTwitter, LuLinkedin } from "react-icons/lu";
import { SidebarFooterProps, SocialLink } from "@/types/types";
import { cn } from "@/lib/utils";

import Button from "@/components/UI/Button";

const SOCIAL_LINKS: SocialLink[] = [
    {
        icon: LuGithub,
        url: "https://github.com/AlexDDevv",
        label: "GitHub",
    },
    {
        icon: LuTwitter,
        url: "https://x.com/Sport_DevWeb",
        label: "Twitter",
    },
    {
        icon: LuLinkedin,
        url: "https://www.linkedin.com/in/alexis-delporte/",
        label: "LinkedIn",
    },
];

export default function SidebarFooter({ collapsed, isAuthenticated }: SidebarFooterProps) {
    return (
        <footer className={cn("flex flex-col", !isAuthenticated && "gap-3 p-4 border-t border-border")}>
            {!isAuthenticated && (
                <div className={cn(
                    "overflow-hidden",
                    collapsed
                        ? "max-h-0 opacity-0 transition-all duration-150"
                        : "max-h-10 opacity-100 transition-all duration-200 delay-150"
                )}>
                    <small className="text-muted-foreground text-xs">
                        &copy; 2026 - Alexis Delporte
                    </small>
                </div>
            )}
            {!isAuthenticated && (
                <ul
                    className={cn("flex items-center gap-2", collapsed && "flex-col")}
                    aria-label="Réseaux sociaux"
                >
                    {SOCIAL_LINKS.map(({ icon: Icon, url, label }) => (
                        <li key={label}>
                            <Button
                                variant="social"
                                to={url}
                                ariaLabel={`Profil ${label}`}
                                title={label}
                                className="p-2"
                                children={<Icon />}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </footer>
    );
}
