import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { BookInputsProps } from "@/types/types";

export default function InputLanguage({ register, errors }: BookInputsProps) {
    return (
        <div className="flex flex-col gap-2 w-1/2">
            <Label htmlFor="language" required>
                Langue
            </Label>
            <Input
                id="language"
                type="text"
                placeholder="Saisissez la langue du livre"
                aria-required
                {...register("language", {
                    required: "La langue est requis",
                    minLength: {
                        value: 1,
                        message:
                            "La langue doit contenir au moins un caractère.",
                    },
                    maxLength: {
                        value: 5,
                        message:
                            "La langue doit contenir 5 caractères maximum.",
                    },
                })}
                aria-invalid={errors?.language ? "true" : "false"}
                errorMessage={errors?.language?.message}
            />
        </div>
    );
}
