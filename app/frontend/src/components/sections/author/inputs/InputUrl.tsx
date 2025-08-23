import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { AuthorInputsProps } from "@/types/types";

interface InputUrlFieldProps extends AuthorInputsProps {
    name: "wikipediaUrl" | "officialWebsite";
    label: string;
    placeholder: string;
}

export default function InputUrl({
    register,
    errors,
    name,
    label,
    placeholder,
}: InputUrlFieldProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                type="url"
                placeholder={placeholder}
                {...register(name, {
                    pattern: {
                        value: /^(https?:\/\/)/,
                        message: "Veuillez entrer une URL valide (http ou https).",
                    },
                })}
                aria-invalid={errors?.[name] ? "true" : "false"}
                errorMessage={errors?.[name]?.message}
            />
        </div>
    );
}
