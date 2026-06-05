import { BookSearchResult } from "../../graphql/types/book-search-result";
import { OpenLibrarySearchResponse, OpenLibraryWork } from "../../types/types";

const BASE_URL = "https://openlibrary.org";
const FIELDS =
    "title,author_name,isbn,publisher,first_publish_year,language,number_of_pages_median,cover_i";

// Open Library uses ISO 639-2 codes; normalize to ISO 639-1
const LANG_MAP: Record<string, string> = {
    eng: "en",
    fre: "fr",
    spa: "es",
    deu: "de",
    ita: "it",
    por: "pt",
    nld: "nl",
    rus: "ru",
    jpn: "ja",
    zho: "zh",
    ara: "ar",
};

function normalize(work: OpenLibraryWork): BookSearchResult | null {
    const isbn13 = work.isbn?.find((i) => i.length === 13);
    if (!isbn13) return null;

    const rawLang = work.language?.[0];
    const language = rawLang ? (LANG_MAP[rawLang] ?? rawLang) : undefined;

    return {
        title: work.title,
        author: work.author_name?.[0],
        isbn13,
        year: work.first_publish_year,
        publisher: work.publisher?.[0],
        language,
        coverUrl: work.cover_i
            ? `https://covers.openlibrary.org/b/id/${work.cover_i}-M.jpg`
            : undefined,
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
            if (!res.ok) {
                console.error(
                    `[OpenLibrary] search "${query}" → HTTP ${res.status}`,
                );
                return [];
            }
            const data: OpenLibrarySearchResponse = await res.json();
            return data.docs
                .map(normalize)
                .filter((r): r is BookSearchResult => r !== null);
        } catch (error) {
            if (signal.aborted) {
                console.error(
                    `[OpenLibrary] search "${query}" avortée (timeout)`,
                );
            } else {
                console.error(`[OpenLibrary] search "${query}" échouée:`, error);
            }
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
        } catch (error) {
            console.error(`[OpenLibrary] findByIsbn ${isbn13} échouée:`, error);
            return null;
        }
    }
}
