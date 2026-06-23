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
                    <span className="bg-foreground/95 grid h-6 w-6 place-items-center rounded-full">
                        <FcGoogle size={15} />
                    </span>
                }
            >
                Continuer avec Google
            </Button>
        </>
    );
}
