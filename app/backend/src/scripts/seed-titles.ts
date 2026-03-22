import { Title } from "../database/entities/gamification/title";

const TITLES_DATA = [
    { label: "Flâneur de Pages", minLevel: 1, iconKey: "flaneur-de-pages", ornamentKey: "flaneur-de-pages" },
    { label: "Scribe Apprenti", minLevel: 2, iconKey: "scribe-apprenti", ornamentKey: "scribe-apprenti" },
    { label: "Lecteur des Chandelles", minLevel: 3, iconKey: "lecteur-des-chandelles", ornamentKey: "lecteur-des-chandelles" },
    { label: "Glaneur d'Histoires", minLevel: 4, iconKey: "glaneur-d-histoires", ornamentKey: "glaneur-d-histoires" },
    { label: "Hibou des Bibliothèques", minLevel: 5, iconKey: "hibou-des-bibliotheques", ornamentKey: "hibou-des-bibliotheques" },
    { label: "Gardien des Parchemins", minLevel: 6, iconKey: "gardien-des-parchemins", ornamentKey: "gardien-des-parchemins" },
    { label: "Érudit Nocturne", minLevel: 7, iconKey: "erudit-nocturne", ornamentKey: "erudit-nocturne" },
    { label: "Archiviste de l'Ombre", minLevel: 8, iconKey: "archiviste-de-l-ombre", ornamentKey: "archiviste-de-l-ombre" },
    { label: "Veilleur d'Encre", minLevel: 9, iconKey: "veilleur-d-encre", ornamentKey: "veilleur-d-encre" },
    { label: "Âme de la Nuit d'Encre", minLevel: 10, iconKey: "ame-de-la-nuit-d-encre", ornamentKey: "ame-de-la-nuit-d-encre" },
];

export async function seedTitles(): Promise<void> {
    const existingCount = await Title.count();

    if (existingCount === 0) {
        for (const data of TITLES_DATA) {
            const title = Title.create(data);
            await title.save();
        }
        console.log(`✅ ${TITLES_DATA.length} titres insérés en base`);
        return;
    }

    // Backfill ornamentKey on existing titles
    for (const data of TITLES_DATA) {
        const title = await Title.findOne({ where: { label: data.label } });
        if (title && !title.ornamentKey) {
            title.ornamentKey = data.ornamentKey;
            await title.save();
        }
    }
}
