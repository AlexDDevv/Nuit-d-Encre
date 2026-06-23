import Ornament from "@/components/sections/shared/Ornament";

/** Signature footer: gilded ornament + "lantern" quote. */
export default function SignatureFooter() {
    return (
        <footer className="mt-14 flex flex-col items-center gap-3 pb-4 text-center">
            <Ornament />
            <p className="text-muted-foreground/60 max-w-sm font-quote text-sm italic">
                « Un livre est une lanterne. » - Nuit d'Encre, veillée après
                veillée.
            </p>
        </footer>
    );
}
