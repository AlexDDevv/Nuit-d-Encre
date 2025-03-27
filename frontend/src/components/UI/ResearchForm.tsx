import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResearchForm() {
    const [search, setSearch] = useState("");
    const [bookData, setBookData] = useState([]);
    const [submitForm, setSubmitForm] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (search.trim() !== "") {
            setSubmitForm(true);
        }
    };

    useEffect(() => {
        if (submitForm) {
            const searchBooks = async () => {
                try {
                    const res = await fetch(
                        `https://openlibrary.org/search.json?q=${search}`,
                    );
                    if (!res.ok) {
                        throw new Error(
                            "Erreur lors de la recherche de livres",
                        );
                    }
                    const data = await res.json();
                    setBookData(data);
                    console.log(data);
                    navigate(`/livres?query=${encodeURIComponent(search)}`);
                } catch (error) {
                    console.error(
                        "Erreur lors de la recherche de livres :",
                        error,
                    );
                }
            };
            searchBooks();
        }
    }, [submitForm, search, navigate]);

    return (
        <form className="flex items-center gap-3" onSubmit={handleSubmit}>
            <label htmlFor="search">
                <Search className="text-card-foreground h-5 w-5" />
            </label>
            <input
                type="text"
                name="search"
                id="search"
                placeholder="Recherche un livre..."
                className="text-card-foreground font-body border-card-foreground placeholder:text-card-foreground/80 placeholder:font-body border-b bg-transparent pb-1 outline-none placeholder:text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </form>
    );
}
