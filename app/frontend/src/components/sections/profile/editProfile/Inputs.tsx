import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const inputBase =
    "w-full rounded-lg border-2 bg-popover px-3.5 py-2.5 font-body text-[15px] text-foreground placeholder:text-muted-foreground/55 transition-colors duration-200 focus:outline-none focus:border-primary";

export function TextInput({
    id,
    error,
    ...rest
}: { id: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            id={id}
            aria-invalid={!!error}
            className={`${inputBase} ${error ? "border-destructive/70" : "border-border"}`}
            {...rest}
        />
    );
}

export function PasswordInput({
    id,
    error,
    ...rest
}: { id: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                type={show ? "text" : "password"}
                aria-invalid={!!error}
                className={`${inputBase} pr-11 ${error ? "border-destructive/70" : "border-border"}`}
                {...rest}
            />
            <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={
                    show ? "Masquer le mot de passe" : "Afficher le mot de passe"
                }
                title={show ? "Masquer" : "Afficher"}
                className="text-muted-foreground hover:text-primary absolute top-1/2 right-1.5 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md transition-colors focus:outline-none"
            >
                {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
        </div>
    );
}
