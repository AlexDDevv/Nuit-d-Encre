import { BookInfoProps } from "@/types/types";

export default function BookInfos({ book }: BookInfoProps) {
    const capitalizeFormat = book.format.charAt(0).toUpperCase() + book.format.slice(1).toLowerCase();

    const bookInfos = [
        { label: "Éditeur", value: book.publisher },
        { label: "Année de publication", value: book.publishedYear },
        { label: "Nombre de pages", value: book.pageCount },
        { label: "Format", value: capitalizeFormat },
        { label: "Langue", value: book.language },
        { label: "ISBN-13", value: book.isbn13 },
        { label: "ISBN-10", value: book.isbn10 },
    ];

    return (
        <div>
            <ul className="flex flex-col gap-2">
                {bookInfos.map(({ label, value }) => (
                    <li key={label} className="text-secondary-foreground">
                        {label} : {value}
                    </li>
                ))}
            </ul>
        </div>
    );
}