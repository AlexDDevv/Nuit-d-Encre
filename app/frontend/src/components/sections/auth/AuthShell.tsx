import EditorialPanel from "@/components/sections/auth/EditorialPanel";
import SignatureFooter from "@/components/sections/shared/SignatureFooter";
import { AuthShellProps } from "@/types/types";

/**
 * Coquille partagée des écrans d'authentification : panneau éditorial + carte
 * scellée (avec halo de chandelle) + pied de signature. Le contenu du
 * formulaire est fourni en `children`.
 */
export default function AuthShell({
    mode,
    onSubmit,
    children,
}: AuthShellProps) {
    return (
        <div className="animate-fadeIn max-w-230 mx-auto w-full">
            {/* Seuil : panneau éditorial + carte d'accès */}
            <div className="grid lg:grid-cols-[1fr_minmax(420px,468px)]">
                <EditorialPanel mode={mode} />

                <div className="border-border bg-card relative rounded-3xl overflow-hidden border-2 shadow-[0_40px_100px_-40px_hsl(20_30%_4%/0.85),inset_0_1px_0_hsl(43_59%_81%/0.05)] lg:rounded-l-none lg:rounded-r-2xl">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(420px 200px at 50% -6%, hsl(43 45% 55% / 0.16), transparent 65%)",
                        }}
                    />
                    <form
                        onSubmit={onSubmit}
                        noValidate
                        className="relative flex flex-col px-7 py-8 sm:px-9 sm:py-9"
                    >
                        {children}
                    </form>
                </div>
            </div>

            <SignatureFooter />
        </div>
    );
}
