import { Input } from "@/components/UI/form/Input";
import { Label } from "@/components/UI/form/Label";
import { AuthorInputsProps } from "@/types/types";

type AuthorFieldName = "firstname" | "lastname";

interface AuthorInputFieldProps extends AuthorInputsProps {
  name: AuthorFieldName;
  label: string;
  placeholder: string;
}

export default function InputName({
  register,
  errors,
  name,
  label,
  placeholder,
}: AuthorInputFieldProps) {
  return (
    <div className="flex flex-col gap-2 w-1/2">
      <Label htmlFor={name} required>
        {label}
      </Label>
      <Input
        id={name}
        type="text"
        placeholder={placeholder}
        aria-required
        {...register(name, {
          required: `${label} est requis`,
          minLength: {
            value: 1,
            message: `${label} doit contenir au moins un caractère.`,
          },
          maxLength: {
            value: 255,
            message: `${label} doit contenir 255 caractères maximum.`,
          },
        })}
        aria-invalid={errors?.[name] ? "true" : "false"}
        errorMessage={errors?.[name]?.message}
      />
    </div>
  );
}
