import { GoogleOAuthProvider } from "@react-oauth/google";
import Signin from "@/components/sections/auth/Signin";
import Signup from "@/components/sections/auth/Signup";
import { useLocation } from "react-router-dom";

// Auth renders Signup or Signin depending on path. Chaque écran porte sa propre
// mise en page (panneau éditorial + carte d'accès, navigation incluse).
//
// Le GoogleOAuthProvider est monté ici plutôt qu'à la racine : il injecte le
// script `accounts.google.com/gsi/client`, tiers susceptible de déposer des
// cookies. Le cantonner aux deux écrans qui portent le bouton « Continuer avec
// Google » évite de charger ce script pour un visiteur qui ne s'authentifie
// pas, et garde le site exempt de traceur non essentiel.
const Auth = () => {
    const { pathname } = useLocation();

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            {pathname === "/connexion" ? <Signin /> : <Signup />}
        </GoogleOAuthProvider>
    );
};

export default Auth;
