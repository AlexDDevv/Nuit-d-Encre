import React, { useState, useEffect } from "react";
import BookCard from "../components/UI/BookCard";
import { BookCardProps } from "../../types";

export default function SearchBooks() {
    const [research, setReSearch] = useState("");
    const [bookData, setBookData] = useState([]);
    const [submitForm, setSubmitForm] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (research.trim() !== "") {
            setSubmitForm(true);
        }
    };

    const searchLower = research.toLowerCase();

    useEffect(() => {
        if (submitForm) {
            const searchBooks = async () => {
                try {
                    const searchUrl = new URL(
                        "https://openlibrary.org/search.json",
                    );
                    searchUrl.searchParams.append("q", research);
                    searchUrl.searchParams.append("title", research);
                    searchUrl.searchParams.append("has_fulltext", "true");
                    searchUrl.searchParams.append(
                        "fields",
                        "key,title,author_name,cover_i,isbn",
                    );
                    searchUrl.searchParams.append("has_cover", "true");

                    const res = await fetch(searchUrl.toString());
                    if (!res.ok) {
                        throw new Error(
                            "Erreur lors de la recherche de livres",
                        );
                    }
                    const data = await res.json();
                    setBookData(data.docs);
                    console.log(data.docs);
                } catch (error) {
                    console.error(
                        "Erreur lors de la recherche de livres :",
                        error,
                    );
                }
            };
            searchBooks();
        }
    }, [submitForm, research]);

    return (
        <>
            <section className="mb-36">
                <h1 className="font-titleFont text-foreground mb-12 text-center text-xl font-bold tracking-widest uppercase">
                    Rechercher un livre
                </h1>
                <form className="mx-auto mb-6 w-lg" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="research"
                        placeholder="Rechercher des livres..."
                        className="bg-input font-bodyFont text-accent-foreground border-border placeholder:text-accent-foreground focus-visible:ring-ring w-full rounded border py-2 pl-2.5 text-sm focus-visible:ring-1 focus-visible:outline-none"
                        value={research}
                        onChange={(e) => setReSearch(e.target.value)}
                    />
                </form>
            </section>
            <section className="px-24">
                <div className="mb-36 grid w-full grid-cols-3 gap-x-12 gap-y-24">
                    {bookData.length > 0 &&
                        bookData.map((book: BookCardProps, i) => (
                            <React.Fragment key={i}>
                                {book.isbn &&
                                    book.isbn.length > 0 &&
                                    book.title
                                        .toLowerCase()
                                        .includes(searchLower) && (
                                        <BookCard
                                            title={book.title}
                                            isbn={book.isbn}
                                            cover_i={book.cover_i}
                                            author_name={book.author_name}
                                        />
                                    )}
                            </React.Fragment>
                        ))}
                </div>
            </section>
        </>
    );
}
