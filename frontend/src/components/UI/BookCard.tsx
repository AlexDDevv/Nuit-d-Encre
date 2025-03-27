import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { BookCardProps } from "../../../types";

export default function BookCard({
    title,
    isbn,
    cover_i,
    author_name,
}: BookCardProps) {
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    return (
        <div className="bg-card border-border ease-in-outout mx-auto w-80 rounded-xl border shadow-[0_10px_15px_-3px_rgba(43,42,41,0.5)] transition-all duration-200 hover:scale-105 hover:shadow-[0_10px_15px_-3px_rgba(43,42,41)]">
            <Link
                to={`/livres/${generateSlug(title)}`}
                onClick={() =>
                    sessionStorage.setItem("currentBookIsbn", isbn[0])
                }
                className="flex h-full flex-col items-center justify-between gap-5 p-6 text-center"
            >
                <div className="h-72 w-48">
                    <img
                        src={`https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`}
                        alt={`Image de couverture du livre ${title}`}
                        className="h-full w-full rounded-md"
                    />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <div className="mb-6">
                        <h2 className="font-titleFont text-card-foreground mb-2.5 text-lg font-bold">
                            {title}
                        </h2>
                        <h3 className="font-titleFont text-card-foreground font-medium">
                            {author_name}
                        </h3>
                    </div>
                    <div className="flex items-center justify-center gap-2.5">
                        <Star className="text-card-foreground" />
                        <Star className="text-card-foreground" />
                        <Star className="text-card-foreground" />
                        <Star className="text-card-foreground" />
                        <Star className="text-card-foreground" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
