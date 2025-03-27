import { Link } from "react-router-dom";
import logo from "../../../public/logo/logo.svg";

export default function Logo() {
    return (
        <Link to="/" className="h-14 w-14">
            <img
                src={logo}
                alt="Logo de Nuit d'Encre"
                className="h-full w-full"
            />
        </Link>
    );
}
