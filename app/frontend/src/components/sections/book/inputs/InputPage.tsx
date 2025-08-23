import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { BookInputsProps } from "@/types/types";

export default function InputPage({ register, errors }: BookInputsProps) {
    return (
        <div className="flex flex-col gap-2 w-1/2">
            <Label htmlFor="pageCount" required>
                Nombre de pages
            </Label>
            <Input
                id="pageCount"
                type="number"
                step="1"
                placeholder="350"
                aria-required
                onKeyDown={(e) => {
                    if (e.key === "." || e.key === ",") {
                        e.preventDefault();
                    }
                }}
                {...register("pageCount", {
                    valueAsNumber: true,
                    required: "Le nombre de page est requis",
                    min: {
                        value: 1,
                        message:
                            "Le nombre de pages doit être au moins de 1.",
                    },
                })}
                aria-invalid={errors?.pageCount ? "true" : "false"}
                errorMessage={errors?.pageCount?.message}
            />
        </div>
    );
}
