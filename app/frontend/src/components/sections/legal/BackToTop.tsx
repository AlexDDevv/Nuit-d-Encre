import { LuArrowUp } from "react-icons/lu";
import Button from "@/components/UI/Button/Button";
import { cn } from "@/lib/utils";

export default function BackToTop({ visible }: { visible: boolean }) {
    return (
        <Button
            variant="icon"
            ariaLabel="Revenir en haut de la page"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={cn(
                "border-primary/50 bg-popover/90 text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-primary/70 focus-visible:ring-offset-background fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full border-2 p-0 shadow-[0_8px_28px_-8px_hsl(43_59%_50%/0.5)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2",
                visible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-3 opacity-0",
            )}
        >
            <LuArrowUp size={20} />
        </Button>
    );
}
