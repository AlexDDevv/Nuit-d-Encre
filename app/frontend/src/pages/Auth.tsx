import Signin from "@/components/sections/auth/Signin";
import Signup from "@/components/sections/auth/Signup";
import { Link, useLocation } from "react-router-dom";

// Auth renders Signup or Signin depending on path
const Auth = () => {
    const { pathname } = useLocation();

    // La page de connexion porte désormais sa propre mise en page
    // (panneau éditorial + carte d'accès, navigation incluse).
    if (pathname === "/connexion") return <Signin />;

    // Inscription : conserve la mise en page historique le temps de sa refonte.
    return (
        <div className="w-md mx-auto flex flex-col items-center gap-4">
            <Signup />
            <Link
                aria-label="Aller à la page de connexion"
                to="/connexion"
                className="text-foreground flex items-center gap-2"
            >
                Vous avez déjà un compte?
                <span className="text-foreground font-bold hover:underline">
                    Connectez vous !
                </span>
            </Link>
        </div>
    );
};

export default Auth;
