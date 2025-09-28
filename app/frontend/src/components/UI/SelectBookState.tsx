import { useState } from "react";
import {
    BookmarkPlus,
    ChevronsUpDown,
    BookOpenCheck,
    Pause,
    BookCheck,
    Trash2,
} from "lucide-react";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import { cn } from "@/lib/utils";
import { BookStateItem } from "@/types/types";

export default function SelectBookState() {
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const { user } = useAuthContext();

    const bookState: BookStateItem[] = [
        {
            icon: <BookmarkPlus className="h-4 w-4" />,
            content: "À lire",
        },
        {
            icon: <BookOpenCheck className="h-4 w-4" />,
            content: "En cours",
        },
        {
            icon: <Pause className="h-4 w-4" />,
            content: "En pause",
        },
        {
            icon: <BookCheck className="h-4 w-4" />,
            content: "Lu",
        },
        ...(user && user.role === "admin"
            ? [
                  {
                      icon: <Trash2 className="h-4 w-4" />,
                      content: "Supprimer",
                  },
              ]
            : []),
    ];

    const handleValueChange = (value: string) => {
        setSelectedState(value);
    };

    const openStateClasses =
        "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2";

    return (
        <Select value={selectedState ?? ""} onValueChange={handleValueChange}>
            <SelectTrigger
                className={cn(
                    "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring focus-within:ring-ring border-border flex w-60 min-w-60 rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    openStateClasses,
                )}
                icon={
                    <ChevronsUpDown className="text-accent-foreground h-4 w-4" />
                }
            >
                <SelectValue placeholder="Sélectionnez un état" />
            </SelectTrigger>
            <SelectContent animate={true}>
                {bookState.map((state, index) => (
                    <SelectItem
                        key={state.content}
                        value={state.content}
                        animate={true}
                        index={index}
                    >
                        <div className="flex items-center gap-x-4">
                            <div>{state.icon}</div>
                            <span>{state.content}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
