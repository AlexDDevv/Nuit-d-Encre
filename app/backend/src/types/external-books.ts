/* Types de réponse des API externes (Google Books, Open Library) utilisés par
 * les services d'enrichissement et de recherche hybride. */

interface GoogleBooksIdentifier {
    type: string;
    identifier: string;
}

interface GoogleBooksVolumeInfo {
    title: string;
    authors?: string[];
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    description?: string;
    language?: string;
    imageLinks?: { thumbnail?: string };
    industryIdentifiers?: GoogleBooksIdentifier[];
}

export interface GoogleBooksVolume {
    volumeInfo: GoogleBooksVolumeInfo;
}

export interface GoogleBooksResponse {
    items?: GoogleBooksVolume[];
}

export interface OpenLibraryWork {
    title: string;
    author_name?: string[];
    isbn?: string[];
    publisher?: string[];
    first_publish_year?: number;
    language?: string[];
    number_of_pages_median?: number;
    cover_i?: number;
}

export interface OpenLibrarySearchResponse {
    numFound: number;
    docs: OpenLibraryWork[];
}
