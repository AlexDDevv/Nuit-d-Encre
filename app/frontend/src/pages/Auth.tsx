import Signin from "@/components/sections/auth/Signin";
import Signup from "@/components/sections/auth/Signup";
import { Link, useLocation } from "react-router-dom";

const routes = [
    {
        path: "/connexion",
        component: <Signin />,
        label: "Vous n'avez pas encore de compte?",
        cta: "Inscrivez vous !",
        ariaLabel: "d'inscription",
        link: "/register",
    },
    {
        path: "/register",
        component: <Signup />,
        label: "Vous avez déjà un compte?",
        cta: "Connectez vous !",
        ariaLabel: "de connexion",
        link: "/connexion",
    },
];

// Auth renders Signup or Sign depending on path
const Auth = () => {
    const { pathname } = useLocation();

    const currentRoute = routes.find((route) => route.path === pathname);

    if (!currentRoute) return null;

    const { component, label, cta, ariaLabel, link } = currentRoute;

    return (
        <div className="w-md mx-auto flex flex-col items-center gap-4">
            {component}
            <Link
                aria-label={`Aller à la page ${ariaLabel}`}
                to={link}
                className="text-foreground flex items-center gap-2"
            >
                {label}
                <span className="text-foreground font-bold hover:underline">
                    {cta}
                </span>
            </Link>
        </div>
    );
};

export default Auth;
