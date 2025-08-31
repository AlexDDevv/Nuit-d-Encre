import { Label } from "@/components/UI/form/Label";
import { Textarea } from "@/components/UI/form/Textarea";
import { AuthorInputsProps } from "@/types/types";

export default function InputBiography({
    register,
    errors,
}: AuthorInputsProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="biography">Biographie</Label>
            <Textarea
                id="biography"
                placeholder="Saisissez la biographie du livre"
                {...register("biography", {
                    minLength: {
                        value: 1,
                        message:
                            "La biographie du livre doit contenir au moins un caractère.",
                    },
                    maxLength: {
                        value: 10000,
                        message:
                            "La biographie du livre doit contenir 10000 caractères maximum.",
                    },
                })}
                aria-invalid={errors?.biography ? "true" : "false"}
                errorMessage={errors?.biography?.message}
                counter={true}
                maxLength={10000}
            />
        </div>
    );
}
