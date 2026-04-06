import { BookSearchResult } from "../../graphql/types/book-search-result";
import { OpenLibrarySearchResponse, OpenLibraryWork } from "../../types/types";

const BASE_URL = "https://openlibrary.org";
const FIELDS =
    "title,author_name,isbn,publisher,first_publish_year,language,number_of_pages_median";

function normalize(work: OpenLibraryWork): BookSearchResult | null {
    const isbn13 = work.isbn?.find((i) => i.length === 13);
    if (!isbn13) return null;

    return {
        title: work.title,
        author: work.author_name?.[0],
        isbn13,
        year: work.first_publish_year,
        publisher: work.publisher?.[0],
        language: work.language?.[0],
        coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn13}-M.jpg`,
        isInDatabase: false,
        source: "open_library",
    };
}

export class OpenLibraryService {
    async search(
        query: string,
        limit: number,
        signal: AbortSignal,
    ): Promise<BookSearchResult[]> {
        try {
            const url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=${FIELDS}`;
            const res = await fetch(url, { signal });
            if (!res.ok) return [];
            const data: OpenLibrarySearchResponse = await res.json();
            return data.docs
                .map(normalize)
                .filter((r): r is BookSearchResult => r !== null);
        } catch {
            return [];
        }
    }

    async findByIsbn(isbn13: string): Promise<BookSearchResult | null> {
        try {
            const url = `${BASE_URL}/search.json?isbn=${isbn13}&fields=${FIELDS}`;
            const res = await fetch(url);
            if (!res.ok) return null;
            const data: OpenLibrarySearchResponse = await res.json();
            const work = data.docs[0];
            if (!work) return null;
            return normalize(work);
        } catch {
            return null;
        }
    }
}
