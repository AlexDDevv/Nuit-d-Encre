import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import { OPEN_STATE_CLASSES } from "@/constants/bookStatus";
import { cn } from "@/lib/utils";
import { SelectReviewSortProps, SORT_OPTIONS } from "@/types/types";

export default function SelectReviewSort({
    value,
    onChange,
    disabled,
}: SelectReviewSortProps) {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger
                className={cn(
                    "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring focus-within:ring-ring border-border flex w-44 rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    OPEN_STATE_CLASSES,
                )}
            >
                <SelectValue placeholder="Choisir un tri" />
            </SelectTrigger>
            <SelectContent animate={true}>
                {SORT_OPTIONS.map((option, index) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        animate={true}
                        index={index}
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
