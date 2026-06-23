import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { AuthFieldProps, UserSignUp } from "@/types/types";
import { Path } from "react-hook-form";

export default function InputUserName<T extends UserSignUp>({
    register,
    errors,
}: AuthFieldProps<T>) {
    const errorMessage = errors.userName?.message as string | undefined;

    const userNameKey: keyof T = "userName";

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="userName" required>
                Nom d'utilisateur
            </Label>
            <Input
                id="userName"
                type="text"
                placeholder="Ex: Le libraire"
                aria-required
                {...register(userNameKey as Path<T>, {
                    required: "Le nom d'utilisateur est requis",
                    minLength: {
                        value: 2,
                        message:
                            "Le nom d'utilisateur doit contenir au moins 2 caractères.",
                    },
                })}
                aria-invalid={errors.userName ? "true" : "false"}
                errorMessage={errorMessage}
            />
        </div>
    );
}
