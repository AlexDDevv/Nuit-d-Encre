import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import { cn } from "@/lib/utils";
import { atelierSelectTriggerClass } from "@/components/sections/shared/atelierField";
import { SelectBookStatusProps } from "@/types/types";
import { useUserBookStatusMapping } from "@/hooks/userBook/useUserBookStatusMapping";
import { BOOK_STATES, STATUS_COLORS } from "@/constants/bookStatus";

export default function SelectBookStatus({
    value,
    onChange,
    disabled,
    colored = false,
    className,
}: SelectBookStatusProps) {
    const { labelToEnum, enumToLabel } = useUserBookStatusMapping();
    const colorClasses = colored && value ? STATUS_COLORS[value].chip : null;

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
                    atelierSelectTriggerClass,
                    "w-60 min-w-60",
                    // Couleurs par statut si `colored` ; sinon le neutre atelier.
                    colorClasses,
                    colored && "font-semibold",
                    className,
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
