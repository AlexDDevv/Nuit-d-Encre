import { useEffect, useRef, type ReactNode } from "react";
import Ornament from "@/components/sections/shared/Ornament";
import MoonMedallion from "@/components/sections/shared/MoonMedallion";
import { MonoEyebrow } from "@/components/sections/shared/ornaments";
import ErrorIllustration from "@/components/UI/error/ErrorIllustration";
import TechNotice from "@/components/UI/error/TechNotice";
import type { ErrorContent, ErrorTechDetails } from "@/types/types";

/**
 * Page d'erreur plein écran « Nuit d'Encre » - frame présentational partagé
 * par l'errorElement du routeur et l'ErrorBoundary de rendu. Les actions de
 * récupération sont injectées par l'appelant (navigation vs rechargement).
 */
export default function ErrorScreen({
    content,
    tech,
    actions,
}: {
    content: ErrorContent;
    tech?: ErrorTechDetails;
    actions: ReactNode;
}) {
    const blockRef = useRef<HTMLDivElement>(null);

    // Focus automatique du bloc d'erreur (accessibilité).
    useEffect(() => {
        blockRef.current?.focus();
    }, [content.code, content.label]);

    return (
        <main className="candle-vignette bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center">
            <div
                ref={blockRef}
                role="alert"
                aria-live="assertive"
                aria-label={content.aria}
                tabIndex={-1}
                key={content.code + content.label}
                className="fade-up flex w-full max-w-xl flex-col items-center outline-none"
            >
                <MonoEyebrow className="mb-6">
                    <span className="text-primary/45 text-xxxs rotate-45 leading-none">
                        ◆
                    </span>
                    {content.ref}
                    <span className="text-primary/45 text-xxxs rotate-45 leading-none">
                        ◆
                    </span>
                </MonoEyebrow>

                <div className="seal-in text-primary mb-1">
                    <ErrorIllustration motif={content.motif} />
                </div>

                {content.code ? (
                    <h1 className="digit-emboss font-title text-[clamp(72px,18vw,136px)] font-black leading-[0.82] tracking-[-0.02em]">
                        {content.code}
                    </h1>
                ) : (
                    <div className="my-3">
                        <MoonMedallion size={68} ring />
                    </div>
                )}

                <Ornament className="my-5" width="w-14" />

                <h2 className="font-title text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                    {content.label}
                </h2>

                <p className="font-quote text-muted-foreground/90 mt-3 max-w-md text-pretty text-lg italic leading-relaxed">
                    {content.message}
                </p>
                {content.hint && (
                    <p className="font-quote text-primary/65 mt-1.5 max-w-md text-sm italic">
                        {content.hint}
                    </p>
                )}

                <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
                    {actions}
                </div>

                {tech && <TechNotice tech={tech} />}
            </div>
        </main>
    );
}
