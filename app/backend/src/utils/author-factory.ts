import { EntityManager } from "typeorm";
import { Author } from "../database/entities/author/author";
import { User } from "../database/entities/user/user";
import { AuthorNameParts } from "../types/types";

/**
 * Parses the full name into first name and last name.
 * (Adjust as needed; here we split on the last space)
 */
function parseFullName(fullName: string): AuthorNameParts {
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

        let author = await repo.findOne({
            where: { firstname, lastname },
        });

        if (!author) {
            author = new Author();
            author.firstname = firstname;
            author.lastname = lastname;
            author.user = user;
            if (manager) {
                await manager.save(author);
            } else {
                await author.save();
            }
        }

        return author;
    } catch (error) {
        throw new Error(
            `Error finding or creating author "${fullName}": ${error instanceof Error ? error.message : String(error)}`
        );
    }
}
