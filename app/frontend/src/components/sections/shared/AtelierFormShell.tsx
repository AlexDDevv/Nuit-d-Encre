import { FormEventHandler, ReactNode } from "react";
import { IconType } from "react-icons";
import Button from "@/components/UI/Button/Button";
import FormEditorialHeader from "@/components/sections/shared/FormEditorialHeader";

type AtelierFormShellProps = {
    icon: IconType;
    eyebrow: string;
    title: string;
    subtitle: string;
    formId: string;
    onSubmit: FormEventHandler<HTMLFormElement>;
    isSubmitting: boolean;
    onCancel: () => void;
    submitLabel: string;
    submitIcon: ReactNode;
    submitAriaLabel: string;
    children: ReactNode;
};

/**
 * Coque commune des fiches de l'atelier : en-tête éditorial, carte grainée à
 * halo doré, formulaire et pied (Annuler + soumission). Les sections sont
 * passées en `children`.
 */
export default function AtelierFormShell({
    icon,
    eyebrow,
    title,
    subtitle,
    formId,
    onSubmit,
    isSubmitting,
    onCancel,
    submitLabel,
    submitIcon,
    submitAriaLabel,
    children,
}: AtelierFormShellProps) {
    return (
        <div className="w-full">
            <FormEditorialHeader
                icon={icon}
                eyebrow={eyebrow}
                title={title}
                subtitle={subtitle}
            />

            <div className="grain border-border bg-card relative rounded-3xl border-2 p-6 shadow-[0_40px_100px_-44px_hsl(20_30%_4%/0.85),inset_0_1px_0_hsl(43_59%_81%/0.05)] sm:p-8 md:p-9">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(460px 200px at 50% -6%, hsl(43 45% 55% / 0.13), transparent 65%)",
                    }}
                />
                <form
                    id={formId}
                    onSubmit={onSubmit}
                    noValidate
                    className="relative flex flex-col gap-8"
                >
                    {children}

                    <div className="border-border/70 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="border-border text-muted-foreground hover:border-primary/40 hover:bg-transparent hover:text-foreground"
                            ariaLabel="Annuler"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            rightIcon={submitIcon}
                            ariaLabel={submitAriaLabel}
                        >
                            {submitLabel}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
