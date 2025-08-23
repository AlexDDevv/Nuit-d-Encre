import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { AuthorInputsProps } from "@/types/types";

export default function InputNationality({ register, errors }: AuthorInputsProps) {
    return (
        <div className="flex flex-col gap-2 w-1/2">
            <Label htmlFor="nationality">Nationalité</Label>
            <Input
                id="nationality"
                type="text"
                placeholder="Saisissez la nationalité de l'auteur : FR, EN..."
                {...register("nationality", {
                    maxLength: {
                        value: 100,
                        message: "La nationalité doit contenir au maximum 100 caractères.",
                    },
                })}
                aria-invalid={errors?.nationality ? "true" : "false"}
                errorMessage={errors?.nationality?.message}
            />
        </div>
    );
}
