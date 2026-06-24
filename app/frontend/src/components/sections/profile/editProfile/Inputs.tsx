import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Input } from "@/components/UI/form/Input";
import { atelierControlClass } from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";

const errorClass = "border-destructive focus-visible:border-destructive";

export function TextInput({
    id,
    error,
    ...rest
}: {
    id: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <Input
            id={id}
            aria-invalid={!!error}
            errorMessage=""
            hideErrorMessage
            className={cn(atelierControlClass, error && errorClass)}
            {...rest}
        />
    );
}

export function PasswordInput({
    id,
    error,
    ...rest
}: {
    id: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <Input
                id={id}
                type={show ? "text" : "password"}
                aria-invalid={!!error}
                errorMessage=""
                hideErrorMessage
                className={cn(
                    atelierControlClass,
                    "pr-11",
                    error && errorClass,
                )}
                {...rest}
            />
            <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={
                    show
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                }
                title={show ? "Masquer" : "Afficher"}
                className="text-muted-foreground hover:text-primary absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md transition-colors focus:outline-none"
            >
                {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
        </div>
    );
}
