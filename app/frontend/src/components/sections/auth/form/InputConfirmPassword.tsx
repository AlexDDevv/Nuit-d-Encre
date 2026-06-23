import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { InputConfirmPasswordProps } from "@/types/types";

export default function InputConfirmPassword({
    register,
    errors,
    getValues,
}: InputConfirmPasswordProps) {
    const errorMessage = errors.confirmPassword?.message;

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword" required>
                Confirmer le mot de passe
            </Label>
            <Input
                id="confirmPassword"
                type="password"
                placeholder="Saisissez à nouveau"
                aria-required
                {...register("confirmPassword", {
                    required: "Veuillez confirmer le mot de passe",
                    validate: (value) =>
                        value === getValues("password") ||
                        "Les deux mots de passe ne correspondent pas.",
                })}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                errorMessage={errorMessage}
            />
        </div>
    );
}
