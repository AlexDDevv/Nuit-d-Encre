import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { UserSignForm } from "@/types/types";
import { isPasswordStrong } from "@/lib/password";
import {
    FieldErrors,
    FieldValues,
    Path,
    UseFormRegister,
} from "react-hook-form";

type InputPasswordProps<T extends FieldValues> = {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    /** Exige tous les critères de robustesse (inscription) plutôt que la seule longueur min. */
    strong?: boolean;
};

export default function InputPassword<T extends UserSignForm>({
    register,
    errors,
    strong = false,
}: InputPasswordProps<T>) {
    const errorMessage = errors.password?.message as string | undefined;

    const passwordKey: keyof T = "password";

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="password" required>
                Mot de passe
            </Label>
            <Input
                id="password"
                type="password"
                placeholder="Mot de passe top secret"
                aria-required
                {...register(passwordKey as Path<T>, {
                    required: "Le mot de passe est requis",
                    ...(strong
                        ? {
                              validate: (value) =>
                                  isPasswordStrong(value as string) ||
                                  "Le mot de passe ne remplit pas tous les critères.",
                          }
                        : {
                              minLength: {
                                  value: 8,
                                  message:
                                      "Doit contenir au moins 8 caractères",
                              },
                          }),
                })}
                aria-invalid={errors.password ? "true" : "false"}
                errorMessage={errorMessage}
            />
        </div>
    );
}
