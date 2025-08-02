import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { InputsProps } from '@/types/types';

export default function InputAuthor({ register, errors }: InputsProps) {
    return (
        <div className="flex flex-col gap-2 w-1/2">
            <Label htmlFor="author" required>
                Auteur
            </Label>
            <Input
                id="author"
                type="text"
                placeholder="Saisissez le nom et prénom de l'auteur"
                aria-required
                {...register("author", {
                    required: "Le nom et prénom de l'auteur sont requis",
                    minLength: {
                        value: 1,
                        message:
                            "Le nom et prénom de l'auteur doivent contenir au moins un caractère.",
                    },
                    maxLength: {
                        value: 255,
                        message:
                            "Le nom et prénom de l'auteur doivent contenir 255 caractères maximum.",
                    },
                })}
                aria-invalid={errors?.author ? "true" : "false"}
                errorMessage={errors?.author?.message}
            />
        </div>
    );
}