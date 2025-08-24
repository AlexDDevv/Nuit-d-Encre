import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { AuthorInputsProps } from "@/types/types";

export default function InputBirthDate({ register, errors }: AuthorInputsProps) {
    return (
        <div className="flex flex-col gap-2 w-1/2">
            <Label htmlFor="birthdate">Date de naissance</Label>
            <Input
                id="birthdate"
                type="text"
                placeholder="Saisissez la date de naissance de l'auteur : JJ/MM/AAAA"
                {...register("birthdate", {
                    pattern: {
                        value: /^\d{2}\/\d{2}\/\d{4}$/,
                        message: "Format attendu : JJ/MM/AAAA",
                    },
                })}
                aria-invalid={errors?.birthdate ? "true" : "false"}
                errorMessage={errors?.birthdate?.message}
            />
        </div>
    );
}
