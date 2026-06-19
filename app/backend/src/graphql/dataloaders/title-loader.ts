import { Title } from "../../database/entities/gamification/title";

/** Titre au minLevel le plus haut tel que minLevel <= level, sinon null. */
export function resolveTitleForLevel(
    level: number,
    titles: Title[],
): Title | null {
    let best: Title | null = null;
    for (const title of titles) {
        if (title.minLevel <= level) {
            if (!best || title.minLevel > best.minLevel) best = title;
        }
    }
    return best;
}

export async function batchTitles(
    levels: readonly number[],
): Promise<(Title | null)[]> {
    const titles = await Title.find();
    return levels.map((level) => resolveTitleForLevel(level, titles));
}
