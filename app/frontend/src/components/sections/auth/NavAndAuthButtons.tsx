import { useLocation } from "react-router-dom";
import { LinksType } from "@/types/types";
import Links from "@/components/UI/Links";
import AuthButtons from "@/components/sections/auth/AuthButtons";

export default function NavAndAuthButtons({
    links,
}: {
    links: readonly LinksType[];
}) {
    const location = useLocation();

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
            <AuthButtons pathname={location.pathname} />
        </nav>
    );
}
