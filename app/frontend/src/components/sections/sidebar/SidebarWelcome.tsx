import { LuSmile } from "react-icons/lu";
import { useAuthContext } from "@/hooks/auth/useAuthContext";

interface SidebarWelcomeProps {
    collapsed: boolean;
}

export default function SidebarWelcome({ collapsed }: SidebarWelcomeProps) {
    const { user } = useAuthContext();

    const message = user
        ? `Bienvenue ${user.userName}`
        : "Bienvenue sur Nuit d'Encre";

    return (
        <p
            className="text-card-foreground flex items-center gap-3 text-sm"
            title={collapsed ? message : undefined}
        >
            <LuSmile className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{message}</span>}
        </p>
    );
}
