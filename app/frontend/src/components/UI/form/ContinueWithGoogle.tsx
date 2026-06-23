import { FcGoogle } from "react-icons/fc";
import ContinueWith from "@/components/UI/form/ContinueWith";
import Button from "@/components/UI/Button/Button";

/** Séparateur orné « ou » + bouton « Continuer avec Google » (contour doré). */
export default function ContinueWithGoogle() {
    return (
        <>
            <ContinueWith />
            <Button
                type="button"
                variant="google"
                fullWidth
                ariaLabel="Continuer avec Google"
                leftIcon={
                    <span className="bg-foreground/95 grid h-5 w-5 place-items-center rounded-full">
                        <FcGoogle className="h-3 w-3" />
                    </span>
                }
            >
                Continuer avec Google
            </Button>
        </>
    );
}
