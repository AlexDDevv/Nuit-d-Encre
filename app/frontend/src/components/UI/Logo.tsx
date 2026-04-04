import { Link } from "react-router-dom";
import logo from "/logo/logo.svg";
import { LogoProps } from "@/types/types";

export default function Logo({ to }: LogoProps) {
    return (
        <Link to={to} className="flex items-center gap-3">
            <div className="h-14 w-14">
                <img
                    src={logo}
                    alt="Logo de Nuit d'Encre"
                    className="h-full w-full"
                />
            </div>
            <span className="font-title text-popover-foreground font-medium">
                Nuit d'Encre
            </span>
        </Link>
    );
}
