import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { InputIsbnProps } from "@/types/types";

export default function InputAuthor({ isbn13, register, errors }: InputIsbnProps) {
    const fieldName = isbn13 ? "isbn13" : "isbn10";
    const label = isbn13 ? "Code ISBN-13" : "Code ISBN-10";

    return (
        <div className="flex flex-col gap-2 w-1/2">
            <Label htmlFor={fieldName} required={isbn13}>
                {label}
            </Label>
            <Input
                id={fieldName}
                type="text"
                placeholder={isbn13 ? "9781234567890" : "1234567890"}
                aria-required={isbn13}
                {...register(fieldName, {
                    required: isbn13 ? `Le ${label} est requis` : false,
                    pattern: {
                        value: isbn13 ? /^.{13}$/ : /^(.{10}|)$/,
                        message: isbn13
                            ? `Le ${label} doit contenir exactement 13 caractères.`
                            : `Le ${label} doit contenir exactement 10 caractères.`
                    }
                })}
                aria-invalid={errors[fieldName] ? "true" : "false"}
                errorMessage={errors[fieldName]?.message}
            />
        </div>
    );
}
