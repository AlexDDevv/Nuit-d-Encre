import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Brackets } from "typeorm";
import { Book } from "../../../database/entities/book/book";
import { Category } from "../../../database/entities/category/category";
import { BookSearchResult } from "../../types/book-search-result";
import { OpenLibraryService } from "../../../services/books/open-library.service";
import { GoogleBooksService } from "../../../services/books/google-books.service";
import { CloudinaryService } from "../../../services/cloudinary.service";
import { AppError } from "../../../middlewares/error-handler";
import { Context, Roles, UserActionType } from "../../../types/types";
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { getOrCreateAuthorByFullName } from "../../../utils/author-factory";

const DB_THRESHOLD = 5;
const EXTERNAL_LIMIT = 5;
// Open Library répond régulièrement en 4-8s : un timeout trop court
// avorte la quasi-totalité des recherches externes.
const EXTERNAL_TIMEOUT_MS = 8000;

@Resolver()
export class BookSearchResolver {
    private olService = new OpenLibraryService();
    private gbService = new GoogleBooksService();
    private cloudinaryService = new CloudinaryService();

    @Query(() => [BookSearchResult])
    async searchBooks(
        @Arg("query") query: string,
    ): Promise<BookSearchResult[]> {
        const trimmed = query.trim();
        if (trimmed.length < 3) return [];

        // Les ISBN sont stockés sans séparateurs : normaliser la saisie
        // "978-2-07-036822-8" → "9782070368228" pour le matching.
        const isbnQuery = trimmed.replace(/[-\s]/g, "");

        // 1. DB search
        const dbBooks = await Book.createQueryBuilder("book")
            .select(["book.id", "book.title", "book.isbn13", "book.publishedYear", "book.publisher", "book.language", "book.coverUrl"])
            .leftJoin("book.author", "author")
            .addSelect(["author.firstname", "author.lastname"])
            .where(
                new Brackets((qb) => {
                    qb.where("unaccent(book.title) ILIKE unaccent(:q)", {
                        q: `%${trimmed}%`,
                    })
                        .orWhere(
                            "unaccent(author.firstname) ILIKE unaccent(:q)",
                            { q: `%${trimmed}%` },
                        )
                        .orWhere(
                            "unaccent(author.lastname) ILIKE unaccent(:q)",
                            { q: `%${trimmed}%` },
                        )
                        .orWhere("book.isbn13 ILIKE :isbnQ", {
                            isbnQ: `%${isbnQuery}%`,
                        });
                }),
            )
            .limit(10)
            .getMany();

        const dbResults: BookSearchResult[] = dbBooks.map((b) => ({
            id: b.id,
            title: b.title,
            author: `${b.author.firstname} ${b.author.lastname}`.trim(),
            isbn13: b.isbn13,
            year: b.publishedYear,
            publisher: b.publisher,
            language: b.language,
            coverUrl: b.coverUrl,
            isInDatabase: true,
        }));

        // 2. Si DB suffisante, retour immédiat — zéro appel externe
        if (dbResults.length >= DB_THRESHOLD) return dbResults;

        // 3. OL + Google Books en parallèle avec timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            EXTERNAL_TIMEOUT_MS,
        );

        try {
            const [olSettled, gbSettled] = await Promise.allSettled([
                this.olService.search(
                    trimmed,
                    EXTERNAL_LIMIT,
                    controller.signal,
                ),
                this.gbService.search(
                    trimmed,
                    EXTERNAL_LIMIT,
                    controller.signal,
                ),
            ]);

            const seenIsbn13s = new Set<string>(
                dbBooks.map((b) => b.isbn13).filter(Boolean) as string[],
            );
            const externalResults: BookSearchResult[] = [];

            for (const settled of [olSettled, gbSettled]) {
                if (settled.status === "fulfilled") {
                    for (const result of settled.value) {
                        if (result.isbn13 && !seenIsbn13s.has(result.isbn13)) {
                            seenIsbn13s.add(result.isbn13);
                            externalResults.push(result);
                        }
                    }
                }
            }

            return [...dbResults, ...externalResults];
        } finally {
            clearTimeout(timeoutId);
        }
    }

    @Query(() => BookSearchResult, { nullable: true })
    async previewBook(
        @Arg("isbn13") isbn13: string,
    ): Promise<BookSearchResult | null> {
        // Vérifier si déjà en DB
        const dbBook = await Book.findOne({
            where: { isbn13 },
            relations: { author: true },
        });

        if (dbBook) {
            return {
                id: dbBook.id,
                title: dbBook.title,
                author: `${dbBook.author.firstname} ${dbBook.author.lastname}`.trim(),
                isbn13: dbBook.isbn13,
                year: dbBook.publishedYear,
                publisher: dbBook.publisher,
                language: dbBook.language,
                coverUrl: dbBook.coverUrl,
                isInDatabase: true,
            };
        }

        // OL d'abord, Google Books en fallback
        const olResult = await this.olService.findByIsbn(isbn13);
        if (olResult) return olResult;

        return this.gbService.findByIsbn(isbn13);
    }

    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => Book)
    async importBook(
        @Arg("isbn13") isbn13: string,
        @Ctx() ctx: Context,
    ): Promise<Book> {
        const user = ctx.user;
        if (!user) throw new AppError("User not found", 404, "NotFoundError");

        // Vérif doublon
        const existing = await Book.findOne({ where: { isbn13 } });
        if (existing)
            throw new AppError(
                "Ce livre est déjà dans la bibliothèque",
                409,
                "ConflictError",
            );

        // Données depuis OL ou Google Books
        const result =
            (await this.olService.findByIsbn(isbn13)) ??
            (await this.gbService.findByIsbn(isbn13));
        if (!result)
            throw new AppError(
                "Livre introuvable dans les sources externes",
                404,
                "NotFoundError",
            );

        // Cover → Cloudinary (non bloquant si échec)
        let coverUrl: string | undefined;
        if (result.coverUrl) {
            coverUrl =
                (await this.cloudinaryService.uploadFromUrl(
                    result.coverUrl,
                    "books",
                )) ?? undefined;
        }

        // Auteur
        const authorName = result.author ?? "Auteur inconnu";
        const author = await getOrCreateAuthorByFullName(authorName, user);

        // Catégorie par défaut
        let category = await Category.findOne({ where: { name: "Autre" } });
        if (!category) {
            category = Category.create({ name: "Autre" });
            await category.save();
        }

        const book = Book.create({
            title: result.title,
            summary: result.description ?? "Importé depuis une source externe.",
            isbn13,
            pageCount: result.pageCount ?? 0,
            publishedYear: result.year ?? 0,
            language: result.language ?? "fr",
            publisher: result.publisher ?? "Inconnu",
            format: "paperback",
            coverUrl,
            author,
            category,
            user,
            isImported: true,
        });

        try {
            await book.save();
        } catch (error: any) {
            if (error.code === "23505") {
                if (error.detail?.includes("title")) {
                    throw new AppError(
                        "Un livre avec ce titre existe déjà",
                        409,
                        "ConflictError",
                    );
                }
                throw new AppError(
                    "Ce livre est déjà dans la bibliothèque",
                    409,
                    "ConflictError",
                );
            }
            throw new AppError(
                "Erreur lors de l'import du livre",
                500,
                "InternalServerError",
            );
        }

        await grantXpService(user, UserActionType.BOOK_IMPORTED, {
            targetId: book.id.toString(),
            metadata: { title: book.title },
        });

        return book;
    }
}
