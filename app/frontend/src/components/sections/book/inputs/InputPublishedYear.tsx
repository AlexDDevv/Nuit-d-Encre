import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { InputsProps } from "@/types/types";

export default function InputPublishedYear({ register, errors }: InputsProps) {
    return (
        <div className="flex flex-col gap-2 w-1/2">
            <Label htmlFor="publishedYear" required>
                Année de publication
            </Label>
            <Input
                id="publishedYear"
                type="number"
                step="1"
                placeholder="2005"
                aria-required
                onKeyDown={(e) => {
                    if (e.key === "." || e.key === ",") {
                        e.preventDefault();
                    }
                }}
                {...register("publishedYear", {
                    required: "L'année de publication est requise",
                    min: {
                        value: 1000,
                        message:
                            "L'année de publication doit être une année valide.",
                    },
                })}
                aria-invalid={errors?.publishedYear ? "true" : "false"}
                errorMessage={errors?.publishedYear?.message}
            />
        </div>
    );
}
