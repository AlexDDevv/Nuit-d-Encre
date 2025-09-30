import { useMemo } from "react";
import {
    BookmarkPlus,
    ChevronsUpDown,
    BookOpenCheck,
    Pause,
    BookCheck,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import { cn } from "@/lib/utils";
import {
    SelectBookStatusProps,
    UserBookStatus,
    UserBookStatusConfig,
} from "@/types/types";
import { useUserBookMutations } from "@/hooks/userBook/useUserBookMutations";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { Skeleton } from "./skeleton/Skeleton";

const BOOK_STATES: readonly UserBookStatusConfig[] = [
    {
        icon: BookmarkPlus,
        label: "À lire",
        value: "TO_READ",
    },
    {
        icon: BookOpenCheck,
        label: "En cours",
        value: "READING",
    },
    {
        icon: Pause,
        label: "En pause",
        value: "PAUSED",
    },
    {
        icon: BookCheck,
        label: "Lu",
        value: "READ",
    },
] as const;

const OPEN_STATE_CLASSES =
    "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2";

export default function SelectBookStatus({
    bookId,
    status,
}: SelectBookStatusProps) {
    const { user } = useAuthContext();
    const { showToast } = useToast();
    const { createUserBook, isCreatingUserBook } = useUserBookMutations();

    const { labelToEnum, enumToLabel } = useMemo(() => {
        const labelToEnum = {} as Record<string, UserBookStatus>;
        const enumToLabel = {} as Record<UserBookStatus, string>;

        for (let i = 0; i < BOOK_STATES.length; i++) {
            const { label, value } = BOOK_STATES[i];
            labelToEnum[label] = value;
            enumToLabel[value] = label;
        }

        return { labelToEnum, enumToLabel };
    }, []);

    const onAddBookToUserLibrary = async (label: string) => {
        if (isCreatingUserBook || !user) {
            if (!user) {
                showToast({
                    type: "error",
                    title: "Non connecté",
                    description:
                        "Vous devez être connecté pour ajouter un livre à votre bibliothèque",
                });
            }
            return;
        }

        const statusEnum = labelToEnum[label];

        try {
            await createUserBook({
                bookId,
                status: statusEnum,
            });
            showToast({
                type: "success",
                title: "Succès",
                description:
                    "Le livre a bien été ajouté à votre bibliothèque !",
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "Erreur",
                description:
                    "L'ajout du livre dans la bibliothèque de l'utilisateur a échoué...",
            });
        }
    };

    if (isCreatingUserBook) {
        return <Skeleton className="h-10 w-60 rounded-lg" />;
    }

    return (
        <Select
            value={status ? enumToLabel[status] : ""}
            onValueChange={onAddBookToUserLibrary}
            disabled={isCreatingUserBook}
        >
            <SelectTrigger
                className={cn(
                    "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring focus-within:ring-ring border-border flex w-60 min-w-60 rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    OPEN_STATE_CLASSES,
                )}
                icon={
                    <ChevronsUpDown className="text-accent-foreground h-4 w-4" />
                }
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
