import { LucideIcon } from "lucide-react";

export interface LinksType {
    href: string;
    label: string;
    category: string;
    ariaLabel: string;
    Icon?: LucideIcon;
}

export type BookCardProps = {
    title: string;
    isbn: string[];
    cover_i: string;
    author_name: string;
};

export type OpenLibraryBook = {
    covers?: number[];
    title?: string;
    publishers?: string[];
    publish_country?: string;
    publish_date?: string;
    number_of_pages?: number;
    isbn_10?: string[];
    isbn_13?: string[];
    authors?: { key: string }[];
};

export type GoogleBooksVolume = {
    volumeInfo?: {
        description?: string;
        categories?: string[];
    };
    saleInfo?: {
        isEbook?: boolean;
    };
};

export type BookProps = {
    book: OpenLibraryBook;
    googleBook: GoogleBooksVolume;
    author: {
        name?: string;
    };
};
