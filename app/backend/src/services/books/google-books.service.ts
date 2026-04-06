import { BookSearchResult } from "../../graphql/types/book-search-result";
import { GoogleBooksResponse, GoogleBooksVolume } from "../../types/types";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

function extractYear(date?: string): number | undefined {
    if (!date) return undefined;
    const year = parseInt(date.substring(0, 4), 10);
    return isNaN(year) ? undefined : year;
}

function normalize(volume: GoogleBooksVolume): BookSearchResult | null {
    const info = volume.volumeInfo;
    const isbn13 = info.industryIdentifiers?.find(
        (id) => id.type === "ISBN_13",
    )?.identifier;
    if (!isbn13) return null;

    return {
        title: info.title,
        author: info.authors?.[0],
        isbn13,
        year: extractYear(info.publishedDate),
        publisher: info.publisher,
        language: info.language,
        coverUrl: info.imageLinks?.thumbnail,
        pageCount: info.pageCount,
        description: info.description,
        isInDatabase: false,
        source: "google_books",
    };
}

export class GoogleBooksService {
    async search(
        query: string,
        limit: number,
        signal: AbortSignal,
    ): Promise<BookSearchResult[]> {
        try {
            const url = `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${limit}&fields=items(volumeInfo/title,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/publisher,volumeInfo/pageCount,volumeInfo/description,volumeInfo/language,volumeInfo/imageLinks,volumeInfo/industryIdentifiers)`;
            const res = await fetch(url, { signal });
            if (!res.ok) return [];
            const data: GoogleBooksResponse = await res.json();
            return (data.items ?? [])
                .map(normalize)
                .filter((r): r is BookSearchResult => r !== null);
        } catch {
            return [];
        }
    }

    async findByIsbn(isbn13: string): Promise<BookSearchResult | null> {
        try {
            const url = `${BASE_URL}?q=isbn:${isbn13}&fields=items(volumeInfo/title,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/publisher,volumeInfo/pageCount,volumeInfo/description,volumeInfo/language,volumeInfo/imageLinks,volumeInfo/industryIdentifiers)`;
            const res = await fetch(url);
            if (!res.ok) return null;
            const data: GoogleBooksResponse = await res.json();
            const volume = data.items?.[0];
            if (!volume) return null;
            return normalize(volume);
        } catch {
            return null;
        }
    }
}
