import { EntityManager } from "typeorm";
import { Author } from "../database/entities/author/author";
import { User } from "../database/entities/user/user";
import { AuthorNameParts } from "../types/types";

/**
 * Parses the full name into first name and last name.
 * (Adjust as needed; here we split on the last space)
 */
export function parseFullName(fullName: string): AuthorNameParts {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) {
        return { firstname: parts[0], lastname: "" };
    }
    const lastname = parts.pop()!;
    const firstname = parts.join(" ");
    return { firstname, lastname };
}

/**
 * Finds an author by first and last name, or creates a new one if not found.
 *
 * Concurrent-safe: the insert uses ON CONFLICT DO NOTHING against the unique
 * constraint on (firstname, lastname), so two simultaneous requests for the
 * same author can't fail - the loser simply reads the row the winner created.
 * No error is raised, which also keeps an enclosing transaction usable.
 *
 * @param fullName The full name of the author (e.g., "Antoine de Saint-Exupéry")
 * @param user The user creating the author
 * @param manager Optional EntityManager to use within a transaction
 * @returns The existing or newly created Author entity
 */
export async function getOrCreateAuthorByFullName(
    fullName: string,
    user: User,
    manager?: EntityManager
): Promise<Author> {
    try {
        const { firstname, lastname } = parseFullName(fullName);

        const repo = manager ? manager.getRepository(Author) : Author.getRepository();

        const existing = await repo.findOne({
            where: { firstname, lastname },
        });

        if (existing) {
            return existing;
        }

        await repo
            .createQueryBuilder()
            .insert()
            .values({ firstname, lastname, user })
            .orIgnore()
            .execute();

        const author = await repo.findOne({
            where: { firstname, lastname },
        });

        if (!author) {
            throw new Error("Author not found after insert");
        }

        return author;
    } catch (error) {
        throw new Error(
            `Error finding or creating author "${fullName}": ${error instanceof Error ? error.message : String(error)}`
        );
    }
}
