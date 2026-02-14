import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import { cn } from "@/lib/utils";
import { SelectBookStatusProps } from "@/types/types";
import { useUserBookStatusMapping } from "@/hooks/userBook/useUserBookStatusMapping";
import { BOOK_STATES, OPEN_STATE_CLASSES } from "@/constants/bookStatus";

export default function SelectBookStatus({
    value,
    onChange,
    disabled,
}: SelectBookStatusProps) {
    const { labelToEnum, enumToLabel } = useUserBookStatusMapping();

    return (
        <Select
            value={value ? enumToLabel[value] : ""}
            onValueChange={(label) =>
                onChange ? onChange(labelToEnum[label]) : undefined
            }
            disabled={disabled}
        >
            <SelectTrigger
                className={cn(
                    "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring focus-within:ring-ring border-border flex w-60 min-w-60 rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    OPEN_STATE_CLASSES,
                )}
            >
                <SelectValue placeholder="Sélectionnez un état" />
            </SelectTrigger>
            <SelectContent animate={true}>
                {BOOK_STATES.map((state, index) => {
                    const IconComponent = state.icon;
                    return (
                        <SelectItem
                            key={state.value}
                            value={state.label}
                            animate={true}
                            index={index}
                        >
                            <div className="flex items-center gap-x-4">
                                <IconComponent className="h-4 w-4" />
                                <span>{state.label}</span>
                            </div>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
