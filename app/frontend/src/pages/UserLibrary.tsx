import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import LibraryGridCard from "@/components/sections/library/LibraryGridCard";
import LibraryListRow from "@/components/sections/library/LibraryListRow";
import BookShelf from "@/components/sections/library/BookShelf";
import LayoutButtons from "@/components/sections/library/UI/LayoutButtons";
import StatusFilterSegments from "@/components/sections/library/UI/StatusFilterSegments";
import SelectCategory from "@/components/sections/book/SelectCategory";
import Pagination from "@/components/UI/Pagination";
import { useUserBooksData } from "@/hooks/userBook/useUserBooksData";
import { useUserBookStatusCounts } from "@/hooks/userBook/useUserBookStatusCounts";
import { useUserBookMutations } from "@/hooks/userBook/useUserBookMutations";
import { useToast } from "@/hooks/toast/useToast";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants/bookStatus";
import {
    BookCardLibraryProps,
    LayoutOptionsValue,
    UserBookStatus,
} from "@/types/types";

const STATUS_STATS: { value: UserBookStatus; label: string }[] = [
    { value: "TO_READ", label: "À lire" },
    { value: "READING", label: "En cours" },
    { value: "READ", label: "Lu" },
    { value: "PAUSED", label: "En pause" },
];

function StatChip({
    value,
    label,
    dotClass,
    primary,
}: {
    value: number;
    label: string;
    dotClass?: string;
    primary?: boolean;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 font-body text-xs",
                primary
                    ? "border-primary/40 text-primary bg-[hsl(43_59%_81%/0.12)]"
                    : "border-border text-muted-foreground bg-[hsl(20_3%_16%/0.6)]",
            )}
        >
            {dotClass && <span className={cn("h-2 w-2 rounded-full", dotClass)} />}
            <span className="text-foreground font-mono font-medium">{value}</span>
            <span className="opacity-85">{label}</span>
        </span>
    );
}

export default function UserLibrary() {
    const [layout, setLayout] = useState<LayoutOptionsValue>("grid");
    const [selectedStatus, setSelectedStatus] = useState<UserBookStatus | "">(
        "",
    );
    const [deletingUserBookId, setDeletingUserBookId] = useState<string | null>(
        null,
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const { showToast } = useToast();

    const {
        userBooks,
        totalCount,
        currentPage,
        setCurrentPage,
        PER_PAGE,
        statusLabelMap,
        filters,
        setFilters,
    } = useUserBooksData({ mode: "library" });

    const { counts, countByStatus } = useUserBookStatusCounts();

    const hasCategory = !!searchParams.get("categoryId");
    const hasAnyFilter = !!selectedStatus || filters.length > 0 || hasCategory;

    const handleStatusChange = (statusEnum: UserBookStatus | "") => {
        setSelectedStatus(statusEnum);
        const label = statusEnum ? statusLabelMap[statusEnum] : "";
        setFilters(label ? [label] : []);
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setSelectedStatus("");
        setFilters([]);
        setCurrentPage(1);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("category");
        newParams.delete("categoryId");
        setSearchParams(newParams);
    };

    const { updateUserBook, isUpdatingUserBook, deleteUserBook } =
        useUserBookMutations();

    const handleStatusBookChange = async ({
        userBookId,
        status,
    }: {
        userBookId: string;
        status: UserBookStatus;
    }) => {
        try {
            await updateUserBook({ id: userBookId, status });
            showToast({
                type: "success",
                title: "Succès",
                description:
                    "La modification du statut de votre livre a bien été prise en compte !",
            });
        } catch {
            showToast({
                type: "error",
                title: "Erreur",
                description:
                    "La modification du statut de votre livre a échoué...",
            });
        }
    };

    const handleDeleteUserBook = async (userBookId: string) => {
        setDeletingUserBookId(userBookId);
        try {
            await deleteUserBook(userBookId);
        } finally {
            setDeletingUserBookId(null);
        }
    };

    return (
        <section className="mx-auto flex w-full max-w-330 flex-col gap-8">
            {/* ── EN-TÊTE ÉDITORIAL ── */}
            <header>
                <div className="mb-3 flex items-center gap-2.5">
                    <span className="bg-primary/50 h-px w-8" />
                    <span className="font-quote text-sm italic tracking-wide text-[hsl(43_30%_62%)]">
                        Votre collection
                    </span>
                </div>
                <h1 className="text-foreground font-quote text-5xl leading-none text-balance">
                    Vos rayons
                </h1>
                <p className="text-muted-foreground font-quote mt-4 max-w-2xl text-base italic leading-relaxed">
                    Les ouvrages que vous avez fait entrer dans la maison,
                    rangés, repris, mis de côté ou attendus à la chandelle.
                </p>

                {counts.total > 0 && (
                    <div className="mt-6 flex flex-wrap items-center gap-2.5">
                        <StatChip
                            value={counts.total}
                            label={`ouvrage${counts.total > 1 ? "s" : ""} en tout`}
                            primary
                        />
                        {STATUS_STATS.map((s) => (
                            <StatChip
                                key={s.value}
                                value={countByStatus[s.value]}
                                label={s.label}
                                dotClass={STATUS_COLORS[s.value].dot}
                            />
                        ))}
                    </div>
                )}
            </header>

            {/* ── BARRE DE CONTRÔLE ── */}
            <div className="border-border sticky top-0 z-30 -mx-4 border-y bg-[hsl(20_3%_17%/0.86)] px-4 py-4 backdrop-blur-sm sm:mx-0 sm:rounded-xl sm:border-2 sm:px-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <StatusFilterSegments
                        selectedStatus={selectedStatus}
                        onStatusChange={handleStatusChange}
                        countByStatus={countByStatus}
                        total={counts.total}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <SelectCategory />
                        {hasAnyFilter && (
                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-body text-xs font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
                            >
                                <FaXmark size={13} aria-hidden="true" /> Tout
                                effacer
                            </button>
                        )}
                        <span className="bg-border hidden h-7 w-px lg:inline" />
                        <LayoutButtons
                            activeLayout={layout}
                            onLayoutChange={setLayout}
                        />
                    </div>
                </div>
            </div>

            {layout === "shelf" ? (
                <div className="grid auto-rows-min grid-cols-[repeat(5,max-content)] items-start justify-center gap-10 max-xl:grid-cols-[repeat(4,max-content)] max-lg:grid-cols-[repeat(3,max-content)] max-md:grid-cols-[repeat(2,max-content)] max-sm:grid-cols-[repeat(1,max-content)]">
                    {userBooks.map((userBook: BookCardLibraryProps) => (
                        <BookShelf
                            key={userBook.id}
                            book={userBook.book}
                            status={userBook.status}
                            isFavorite={userBook.isFavorite}
                            favoriteRank={userBook.favoriteRank}
                        />
                    ))}
                </div>
            ) : layout === "grid" ? (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                    {userBooks.map((userBook: BookCardLibraryProps) => (
                        <LibraryGridCard
                            key={userBook.id}
                            id={userBook.id}
                            book={userBook.book}
                            status={userBook.status}
                            isFavorite={userBook.isFavorite}
                            favoriteRank={userBook.favoriteRank}
                            layout={layout}
                            onStatusChange={handleStatusBookChange}
                            isUpdatingUserBook={isUpdatingUserBook}
                            handleDeleteUserBook={handleDeleteUserBook}
                            isDeletingUserBook={deletingUserBookId === userBook.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {userBooks.map((userBook: BookCardLibraryProps) => (
                        <LibraryListRow
                            key={userBook.id}
                            id={userBook.id}
                            book={userBook.book}
                            status={userBook.status}
                            isFavorite={userBook.isFavorite}
                            favoriteRank={userBook.favoriteRank}
                            layout={layout}
                            onStatusChange={handleStatusBookChange}
                            isUpdatingUserBook={isUpdatingUserBook}
                            handleDeleteUserBook={handleDeleteUserBook}
                            isDeletingUserBook={
                                deletingUserBookId === userBook.id
                            }
                        />
                    ))}
                </div>
            )}
            <Pagination
                className="mx-auto my-0 w-max"
                currentPage={currentPage}
                totalCount={totalCount}
                perPage={PER_PAGE.library}
                onPageChange={setCurrentPage}
            />
        </section>
    );
}
