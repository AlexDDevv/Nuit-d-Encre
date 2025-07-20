import { useLocation, useNavigate } from "react-router-dom";
import { LinksType } from "@/types/types";
import Links from "@/components/UI/Links";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import AuthButtons from "@/components/sections/auth/AuthButtons";

export default function NavAndAuthButtons({
    links,
}: {
    links: readonly LinksType[];
}) {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { Logout } = useAuth();

    const logout = () => {
        Logout();
        navigate("/");
        showToast({
            type: "success",
            title: "Déconnexion réussie !",
            description: "À bientôt sur Nuit d'Encre !",
        });
    };

    return (
        <nav className="flex flex-1 items-center justify-between gap-12">
            <div className="flex flex-1 items-center justify-center gap-12">
                <ul className="flex items-center justify-center gap-12">
                    {links.map((link) => (
                        <li
                            className="transition-transform hover:scale-110"
                            key={link.href}
                        >
                            <Links {...link} />
                        </li>
                    ))}
                </ul>
            </div>
            <AuthButtons
                user={user}
                pathname={location.pathname}
                logout={logout}
            />
        </nav>
    );
}
