import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import { UserSignUp } from "@/types/types";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type InputFirstnameProps = {
    register: UseFormRegister<UserSignUp>;
    errors: FieldErrors<UserSignUp>;
};

export default function InputFirstname({
    register,
    errors,
}: InputFirstnameProps) {
    return (
        <div>
            <Label htmlFor="userName" required>
                Prénom
            </Label>
            <Input
                id="userName"
                type="text"
                placeholder="Ex: Alma"
                aria-required
                {...register("userName", {
                    required: "Le prénom est requis",
                    minLength: {
                        value: 2,
                        message:
                            "Le prénom doit contenir au moins 2 caractères.",
                    },
                })}
                aria-invalid={errors?.userName ? "true" : "false"}
                errorMessage={errors?.userName?.message}
            ></Input>
        </div>
    );
}
