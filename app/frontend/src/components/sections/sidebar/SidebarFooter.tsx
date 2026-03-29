import { Link } from "react-router-dom";
import { LuGithub, LuTwitter, LuLinkedin } from "react-icons/lu";
import { IconType } from "react-icons";

interface SocialLink {
    icon: IconType;
    url: string;
    label: string;
}

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

interface SidebarFooterProps {
    collapsed: boolean;
}

export default function SidebarFooter({ collapsed }: SidebarFooterProps) {
    return (
        <footer className="flex flex-col gap-3">
            {!collapsed && (
                <small className="text-muted-foreground text-xs">
                    &copy; 2025 - Alexis Delporte
                </small>
            )}
            <ul
                className={`flex items-center gap-2 ${collapsed ? "flex-col" : ""}`}
                aria-label="Réseaux sociaux"
            >
                {SOCIAL_LINKS.map(({ icon: Icon, url, label }) => (
                    <li key={label}>
                        <Link
                            to={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground border-border flex items-center justify-center rounded-sm border p-1.5 transition-colors duration-200"
                            aria-label={`Profil ${label}`}
                            title={label}
                        >
                            <Icon className="h-4 w-4" />
                        </Link>
                    </li>
                ))}
            </ul>
        </footer>
    );
}
