import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReviewSection from "../components/ReviewSection";
import { GoogleBooksVolume, OpenLibraryBook } from "../../types";
import Book from "../components/Book";

export default function BookPage() {
    const [bookDetails, setBookDetails] = useState<OpenLibraryBook>({});
    const [googleBookDetails, setGoogleBookDetails] =
        useState<GoogleBooksVolume>({});
    const [authorDetails, setAuthorDetails] = useState<{ name?: string }>({});
    const [error, setError] = useState("");
    const { slug } = useParams();
    const apiKey = import.meta.env.VITE_PUBLIC_API_KEY;

    const navigate = useNavigate();

    useEffect(() => {
        const isbn = sessionStorage.getItem("currentBookIsbn");
        if (!isbn) {
            navigate("/livres");
            return;
        }

        const fetchBookDetails = async () => {
            try {
                const [openLibraryRes, googleBooksRes] = await Promise.all([
                    fetch(`https://openlibrary.org/isbn/${isbn}.json`),
                    fetch(
                        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`,
                    ),
                ]);

                if (!openLibraryRes.ok || !googleBooksRes.ok) {
                    throw new Error(
                        "Erreur lors de la récupération des données.",
                    );
                }

                const dataOL = await openLibraryRes.json();
                const dataGB = await googleBooksRes.json();

                setBookDetails(dataOL);
                setGoogleBookDetails(dataGB.items[0]);
            } catch (err) {
                setError("Impossible de charger les données.");
                console.error(err);
            }
        };
        fetchBookDetails();
    }, [slug, apiKey]);

    console.log(bookDetails);
    console.log(googleBookDetails);

    const authorKey =
        bookDetails.authors && bookDetails.authors.length > 0
            ? bookDetails.authors[0].key
            : null;
    const authorSplit = authorKey ? authorKey.split("/").pop() : null;

    useEffect(() => {
        const fetchAuthorDetails = async () => {
            try {
                const resAuthor = await fetch(
                    `https://openlibrary.org/authors/${authorSplit}.json`,
                );

                if (!resAuthor.ok) {
                    throw new Error(
                        "Erreur lors de la récupération des détails de l'auteur",
                    );
                }

                const dataAuthor = await resAuthor.json();
                console.log("🚀 ~ fetchBookDetails ~ dataAuthor:", dataAuthor);
                setAuthorDetails(dataAuthor);
            } catch (error) {
                setError(
                    "Erreur lors de la récupération des détails de l'auteur",
                );
                console.error(error);
            }
        };
        fetchAuthorDetails();
    }, [bookDetails, googleBookDetails]);

    return (
        <>
            <Book
                book={bookDetails}
                googleBook={googleBookDetails}
                author={authorDetails}
            />
            <ReviewSection title={bookDetails.title} />
        </>
    );
}
