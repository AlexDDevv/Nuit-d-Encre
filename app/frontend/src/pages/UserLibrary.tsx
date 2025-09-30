import BookCardLibrary from "@/components/sections/book/BookCardLibrary";
import { useUserBooksData } from "@/hooks/userBook/useUserBooksData";
import { BookCardLibraryProps } from "@/types/types";

export default function UserLibrary() {
    const { userBooks } = useUserBooksData({ mode: "library" });

    return (
        <div className="flex flex-wrap items-center justify-center gap-20">
            {userBooks.map((userBook: BookCardLibraryProps) => (
                <BookCardLibrary
                    key={userBook.id}
                    id={userBook.id}
                    book={userBook.book}
                    rating={userBook.rating}
                    recommended={userBook.recommended}
                    status={userBook.status}
                />
            ))}
        </div>
    );
}
