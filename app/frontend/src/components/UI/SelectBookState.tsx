import { useState } from "react";
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
import { BookStateItem, UserBookStatus } from "@/types/types";
import { useUserBookMutations } from "@/hooks/userBook/useUserBookMutations";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { Skeleton } from "./skeleton/Skeleton";

export default function SelectBookState({ bookId }: { bookId: string }) {
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const { user } = useAuthContext();
    const { showToast } = useToast();
    const { createUserBook, isCreatingUserBook, createUserBookError } =
        useUserBookMutations();

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
    ];

    const stateLabelToEnum: Record<string, UserBookStatus> = {
        "À lire": "TO_READ",
        "En cours": "READING",
        "En pause": "PAUSED",
        Lu: "READ",
    };

    if (isCreatingUserBook) {
        return <Skeleton className="h-10 w-60 rounded-lg" />;
    }

    if (createUserBookError) {
        throw new Response("Error during book creation", { status: 404 });
    }

    const onAddBookToUserLibrary = async (value: string) => {
        if (isCreatingUserBook) return;

        setSelectedState(value);

        if (!user) {
            showToast({
                type: "error",
                title: "Non connecté",
                description:
                    "Vous devez être connecté pour ajouter un livre à votre bibliothèque",
            });

            return;
        }

        const statusEnum = stateLabelToEnum[value];

        try {
            await createUserBook({
                bookId: bookId,
                status: statusEnum,
            });
            showToast({
                type: "success",
                title: "Succès",
                description: `Le livre a bien été ajouté à votre bibliothèque !`,
            });
        } catch (error) {
            setSelectedState(null);
            showToast({
                type: "error",
                title: "Erreur",
                description:
                    "L'ajout du livre dans la bibliothèque de l'utilisateur a échoué...",
            });
        }
    };

    const openStateClasses =
        "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2";

    return (
        <Select
            value={selectedState ?? ""}
            onValueChange={onAddBookToUserLibrary}
            disabled={isCreatingUserBook}
        >
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
