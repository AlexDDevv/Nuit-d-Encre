import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { UserSignUp } from "@/types/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type InputUserNameProps = {
    register: UseFormRegister<UserSignUp>;
    errors: FieldErrors<UserSignUp>;
};

export default function InputUserName({
    register,
    errors,
}: InputUserNameProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="userName" required>
                Nom d'utilistateur
            </Label>
            <Input
                id="userName"
                type="text"
                placeholder="Ex: Le libraire"
                aria-required
                {...register("userName", {
                    required: "Le nom d'utilisateur est requis",
                    minLength: {
                        value: 2,
                        message:
                            "Le nom d'utilisateur doit contenir au moins 2 caractères.",
                    },
                })}
                aria-invalid={errors?.userName ? "true" : "false"}
                errorMessage={errors?.userName?.message}
            />
        </div>
    );
}
