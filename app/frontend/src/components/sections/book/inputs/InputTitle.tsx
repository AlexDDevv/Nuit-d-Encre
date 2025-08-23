import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { BookInputsProps } from "@/types/types";

export default function InputTitle({ register, errors }: BookInputsProps) {
    return (
        <div className="flex flex-col gap-2 w-1/2">
            <Label htmlFor="title" required>
                Titre
            </Label>
            <Input
                id="title"
                type="text"
                placeholder="Saisissez le titre du livre"
                aria-required
                {...register("title", {
                    required: "Le titre est requis",
                    minLength: {
                        value: 1,
                        message:
                            "Le titre doit contenir au moins un caractère.",
                    },
                    maxLength: {
                        value: 255,
                        message:
                            "Le titre doit contenir 255 caractères maximum.",
                    },
                })}
                aria-invalid={errors?.title ? "true" : "false"}
                errorMessage={errors?.title?.message}
            />
        </div>
    );
}
