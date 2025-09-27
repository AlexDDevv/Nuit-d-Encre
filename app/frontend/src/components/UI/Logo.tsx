import { Link } from "react-router-dom";
import logo from "/logo/logo.svg";
import { useAuthContext } from "@/hooks/auth/useAuthContext";

export default function Logo() {
    const { user } = useAuthContext();

    return (
        <Link to={user ? "/books" : "/"} className="h-14 w-14">
            <img
                src={logo}
                alt="Logo de Nuit d'Encre"
                className="h-full w-full"
            />
        </Link>
    );
}
