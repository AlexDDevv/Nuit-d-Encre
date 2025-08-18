import ContinueWith from "@/components/UI/form/ContinueWith";
import { Button } from "@/components/UI/Button";

export default function ContinueWithGoogle() {
    return (
        <div className="flex flex-col items-center gap-6">
            <ContinueWith />
            <Button
                type="submit"
                ariaLabel="Se connecter avec Google"
                variant="secondary"
                fullWidth
            >
                Google
            </Button>
        </div>
    );
}
