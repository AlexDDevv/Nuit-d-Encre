import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import ContinueWith from "@/components/UI/form/ContinueWith";
import Button from "@/components/UI/Button/Button";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";

/** Séparateur orné « ou » + bouton « Continuer avec Google » (contour doré). */
export default function ContinueWithGoogle() {
    const { login, loading } = useGoogleAuth();

    return (
        <>
            <ContinueWith />
            <Button
                type="button"
                variant="google"
                fullWidth
                disabled={loading}
                onClick={() => login()}
                ariaLabel="Continuer avec Google"
                leftIcon={
                    <span className="bg-foreground/95 grid h-5 w-5 place-items-center rounded-full">
                        <FcGoogle className="h-3 w-3" />
                    </span>
                }
            >
                Continuer avec Google
            </Button>
            <p className="text-muted-foreground/70 mt-2 text-center text-xs">
                En continuant avec Google, vous acceptez notre{" "}
                <Link to="/confidentialite" className="underline">
                    politique de confidentialité
                </Link>
                .
            </p>
        </>
    );
}
