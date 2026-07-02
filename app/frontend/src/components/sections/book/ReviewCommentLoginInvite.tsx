import { LuLock } from "react-icons/lu";
import Button from "@/components/UI/Button/Button";

/**
 * Invitation sobre à se connecter, substituée au formulaire quand le visiteur
 * n'est pas authentifié. La lecture du fil reste ouverte.
 */
export default function ReviewCommentLoginInvite() {
    return (
        <div className="border-primary/25 bg-secondary/15 flex flex-col items-start gap-3 rounded-lg border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-foreground/85 font-quote inline-flex items-center gap-2.5 text-sm italic">
                <LuLock className="text-primary/70" size={15} />
                Rejoignez la veillée pour prendre part à la conversation.
            </p>
            <Button
                to="/connexion"
                variant="primary"
                size="sm"
                ariaLabel="Se connecter"
                className="shrink-0"
            >
                Se connecter
            </Button>
        </div>
    );
}
