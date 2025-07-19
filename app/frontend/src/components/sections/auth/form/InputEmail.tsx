import { UserSignForm } from "@/types/types";
import {
    FieldErrors,
    FieldValues,
    Path,
    UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";

type InputEmailProps<T extends FieldValues> = {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
};

export default function InputEmail<T extends UserSignForm>({
    register,
    errors,
}: InputEmailProps<T>) {
    const errorMessage = errors.email?.message as string | undefined;

    const emailKey: keyof T = "email";

    return (
        <div>
            <Label htmlFor="email" required>
                Adresse e-mail
            </Label>
            <Input
                id="email"
                type="email"
                placeholder="Ex: monemail@gmail.com"
                aria-required
                {...register(emailKey as Path<T>, {
                    required: "L'email est requis",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Format d'email invalide",
                    },
                })}
                aria-invalid={errors.email ? "true" : "false"}
                errorMessage={errorMessage}
            />
        </div>
    );
}
