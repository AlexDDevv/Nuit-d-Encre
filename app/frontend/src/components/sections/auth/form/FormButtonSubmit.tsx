import { Button } from "@/components/UI/Button";

type FormButttonSubmitProps = {
    type: "sign-in" | "sign-up";
};

export default function FormButtonSubmit({ type }: FormButttonSubmitProps) {
    const buttonText = type === "sign-in" ? "Se connecter" : "S'inscrire";
    const ariaLabel =
        type === "sign-in" ? "Se connecter à Nuit d'Encre" : "Créer un compte";

    return (
        <Button type="submit" fullWidth ariaLabel={ariaLabel} variant="primary">
            {buttonText}
        </Button>
    );
}
