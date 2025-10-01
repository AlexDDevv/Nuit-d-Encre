import SearchBook from "@/components/sections/book/SearchBook";
import BookCardLibrary from "@/components/sections/library/BookCardLibrary";
import BookShelf from "@/components/sections/library/BookShelf";
import LayoutButtons from "@/components/sections/library/UI/LayoutButtons";
import Pagination from "@/components/UI/Pagination";
import SelectCategory from "@/components/sections/book/SelectCategory";
import { useUserBooksData } from "@/hooks/userBook/useUserBooksData";
import { cn } from "@/lib/utils";
import {
    BookCardLibraryProps,
    LayoutOptionsValue,
    UserBookStatus,
} from "@/types/types";
import { useState } from "react";
import FilterUserBookStatus from "@/components/sections/library/UI/FilterUserBookStatus";

export default function UserLibrary() {
    const [layout, setLayout] = useState<LayoutOptionsValue>("grid");
    const [selectedStatus, setSelectedStatus] = useState<UserBookStatus | "">(
        "",
    );

    const {
        userBooks,
        totalCount,
        currentPage,
        setCurrentPage,
        PER_PAGE,
        statusLabelMap,
        setFilters,
    } = useUserBooksData({ mode: "library" });

    const handleStatusChange = (statusEnum: UserBookStatus | "") => {
        setSelectedStatus(statusEnum);
        const label = statusEnum ? statusLabelMap[statusEnum] : "";
        setFilters(label ? [label] : []);
        setCurrentPage(1);
    };

    return (
        <section className="flex flex-col gap-20">
            <div className="flex flex-col items-center justify-center gap-5">
                <LayoutButtons
                    activeLayout={layout}
                    onLayoutChange={setLayout}
                />
                <div className="flex items-center justify-center gap-5">
                    <SelectCategory />
                    <SearchBook isInLibrary={true} />
                    <FilterUserBookStatus
                        selectedStatus={selectedStatus}
                        onStatusChange={handleStatusChange}
                    />
                </div>
            </div>
            <div
                className={cn(
                    layout === "shelf"
                        ? "grid auto-rows-min grid-cols-[repeat(5,max-content)] items-start justify-center gap-10 max-xl:grid-cols-[repeat(4,max-content)] max-lg:grid-cols-[repeat(3,max-content)] max-md:grid-cols-[repeat(2,max-content)] max-sm:grid-cols-[repeat(1,max-content)]"
                        : "flex flex-wrap items-center justify-center gap-20",
                )}
            >
                {layout === "shelf"
                    ? userBooks.map((userBook: BookCardLibraryProps) => (
                          <BookShelf
                              key={userBook.id}
                              book={userBook.book}
                              rating={userBook.rating}
                              recommended={userBook.recommended}
                              statusLabel={statusLabelMap[userBook.status]}
                          />
                      ))
                    : userBooks.map((userBook: BookCardLibraryProps) => (
                          <BookCardLibrary
                              key={userBook.id}
                              id={userBook.id}
                              book={userBook.book}
                              rating={userBook.rating}
                              recommended={userBook.recommended}
                              status={userBook.status}
                              layout={layout}
                          />
                      ))}
            </div>
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
