import Signin from "@/components/sections/auth/Signin";
import Signup from "@/components/sections/auth/Signup";
import { useLocation } from "react-router-dom";

// Auth renders Signup or Signin depending on path. Chaque écran porte sa propre
// mise en page (panneau éditorial + carte d'accès, navigation incluse).
const Auth = () => {
    const { pathname } = useLocation();

    return pathname === "/connexion" ? <Signin /> : <Signup />;
};

export default Auth;
