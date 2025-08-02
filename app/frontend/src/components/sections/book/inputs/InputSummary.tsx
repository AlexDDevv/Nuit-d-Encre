import { Label } from "@/components/UI/form/Label";
import { Textarea } from "@/components/UI/form/Textarea";
import { InputsProps } from "@/types/types";

export default function InputSummary({ register, errors }: InputsProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="summary" required>
                Résumé
            </Label>
            <Textarea
                id="summary"
                placeholder="Saisissez le résumé du livre"
                aria-required
                {...register("summary", {
                    required: "Le résumé du livre est requis",
                    minLength: {
                        value: 1,
                        message:
                            "Le résumé du livre doit contenir au moins un caractère.",
                    },
                    maxLength: {
                        value: 5000,
                        message:
                            "Le résumé du livre doit contenir 5000 caractères maximum.",
                    },
                })}
                aria-invalid={errors?.summary ? "true" : "false"}
                errorMessage={errors?.summary?.message}
                counter={true}
                maxLength={5000}
            />
        </div>
    );
}
