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
            {!collapsed && !isAuthenticated && (
                <small className="text-muted-foreground text-xs">
                    &copy; 2026 - Alexis Delporte
                </small>
            )}
            {!isAuthenticated && (
                <ul
                    className={`flex items-center gap-2 ${collapsed ? "flex-col" : ""}`}
                    aria-label="Réseaux sociaux"
                >
                    {SOCIAL_LINKS.map(({ icon: Icon, url, label }) => (
                        <li key={label}>
                            <Button
                                variant="social"
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
