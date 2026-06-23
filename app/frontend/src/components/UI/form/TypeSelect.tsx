import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import { cn } from "@/lib/utils";
import { TypeSelectOptions } from "@/types/types";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type TypeSelectProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    message: string;
    selectSomething: string;
    options: TypeSelectOptions[];
    disabled?: boolean;
    className?: string;
    id?: string;
};

export default function TypeSelect<T extends FieldValues>({
    control,
    name,
    message,
    selectSomething,
    options,
    disabled = false,
    className,
    id,
}: TypeSelectProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            rules={{ required: message }}
            render={({ field, fieldState }) => {
                const error = fieldState.error;
                const classError = error
                    ? "border-destructive focus:border-destructive focus:ring-0 data-[state=open]:border-destructive data-[state=open]:shadow-none"
                    : "";

                return (
                    <Select
                        value={String(field.value ?? "")}
                        onValueChange={field.onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            id={id}
                            className={cn(className, classError)}
                        >
                            <SelectValue placeholder={selectSomething} />
                        </SelectTrigger>
                        <SelectContent animate={true}>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }}
        />
    );
}
