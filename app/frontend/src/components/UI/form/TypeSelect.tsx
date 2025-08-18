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
};

export default function TypeSelect<T extends FieldValues>({
    control,
    name,
    message,
    selectSomething,
    options,
    disabled = false,
    className
}: TypeSelectProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            rules={{ required: message }}
            render={({ field, fieldState }) => {
                const error = fieldState.error;
                const classError = error
                    ? "border-destructive focus-visible:ring-destructive focus-within:ring-destructive focus-visible:border-none data-[state=open]:border-none"
                    : "";

                const openStateClasses = error
                    ? "data-[state=open]:ring-2 data-[state=open]:ring-destructive data-[state=open]:ring-offset-2"
                    : "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2";

                return (
                    <Select
                        value={String(field.value ?? "")}
                        onValueChange={field.onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className={cn(
                            "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring focus-within:ring-ring border-border flex h-10 w-full rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            className,
                            classError,
                            openStateClasses
                        )}>
                            <SelectValue placeholder={selectSomething} />
                        </SelectTrigger>
                        <SelectContent animate={true}>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            }}
        />
    );
}
