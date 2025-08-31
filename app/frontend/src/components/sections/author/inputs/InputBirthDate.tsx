import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { AuthorInputsProps } from "@/types/types";

export default function InputBirthDate({
    register,
    errors,
}: AuthorInputsProps) {
    return (
        <div className="flex w-1/2 flex-col gap-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
                id="birthDate"
                type="text"
                placeholder="Saisissez la date de naissance de l'auteur : JJ/MM/AAAA"
                {...register("birthDate", {
                    pattern: {
                        value: /^\d{2}\/\d{2}\/\d{4}$/,
                        message: "Format attendu : JJ/MM/AAAA",
                    },
                })}
                aria-invalid={errors?.birthDate ? "true" : "false"}
                errorMessage={errors?.birthDate?.message}
            />
        </div>
    );
}
