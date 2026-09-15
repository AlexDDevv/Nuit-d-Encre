import { LuArrowUp } from "react-icons/lu";
import Button from "@/components/UI/Button/Button";
import { cn } from "@/lib/utils";

// Miroir du burger mobile (Sidebar) : même bouton, même cadre, même marge de 1rem.
export default function BackToTop({ visible }: { visible: boolean }) {
    return (
        <div
            className={cn(
                "bg-card/85 fixed bottom-4 right-4 z-30 rounded-lg shadow-md backdrop-blur-sm transition-all duration-300",
                visible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0",
            )}
        >
            <Button
                variant="hamburger"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                ariaLabel="Revenir en haut de la page"
                icon={<LuArrowUp />}
            />
        </div>
    );
}
