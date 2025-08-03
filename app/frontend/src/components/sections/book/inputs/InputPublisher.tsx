import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { InputsProps } from "@/types/types";

export default function InputPublisher({ register, errors }: InputsProps) {
    return (
        <div className="flex flex-col gap-2 w-1/2">
            <Label htmlFor="publisher" required>
                Maison d'édition
            </Label>
            <Input
                id="publisher"
                type="text"
                placeholder="Saisissez la maison d'édition du livre"
                aria-required
                {...register("publisher", {
                    required: "La maison d'édition est requise",
                    minLength: {
                        value: 1,
                        message:
                            "La maison d'édition doit contenir au moins un caractère.",
                    },
                    maxLength: {
                        value: 255,
                        message:
                            "La maison d'édition doit contenir 255 caractères maximum.",
                    },
                })}
                aria-invalid={errors?.publisher ? "true" : "false"}
                errorMessage={errors?.publisher?.message}
            />
        </div>
    );
}
