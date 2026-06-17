/**
 * Seed de démonstration / test fonctionnel.
 *
 * Génère un jeu de données « léger » mais qui exerce TOUTES les fonctionnalités
 * de Nuit d'Encre :
 *  - comptes avec rôles variés (admin, modérateur, lecteur, nouveau venu),
 *    profils complets/partiels/vides, niveaux & XP cohérents avec l'historique
 *    d'actions (UserActions),
 *  - auteurs complets et incomplets (hasIncompleteInfo),
 *  - catégories dont « Autre »,
 *  - livres complets et importés-incomplets (hasIncompleteBookInfo), tous les
 *    formats, plusieurs langues, avec/sans critiques, avec/sans recommandations,
 *  - bibliothèques perso couvrant tous les ReadingStatus, favoris ordonnés,
 *    entrées publiques et privées,
 *  - critiques courtes et détaillées (bonus > 200 caractères),
 *  - votes d'utilité (jamais sur sa propre critique),
 *  - recommandations.
 *
 * ⚠️ Destructif : vide toutes les tables métier (sauf `title`) avant insertion.
 *
 * Lancement : `pnpm seed:db` (dans le conteneur back : `docker compose exec back pnpm seed:db`)
 */

import "reflect-metadata";
import "dotenv/config";

import { dataSource } from "../database/config/datasource";
import { User } from "../database/entities/user/user";
import { Author } from "../database/entities/author/author";
import { Category } from "../database/entities/category/category";
import { Book } from "../database/entities/book/book";
import { UserBook } from "../database/entities/user/user-book";
import { BookReview } from "../database/entities/book/bookReview";
import { BookReviewVote } from "../database/entities/book/bookReviewVote";
import { BookRecommendation } from "../database/entities/book/bookRecommendation";
import { UserActions } from "../database/entities/user/user-actions";
import { register } from "../services/auth-service";
import { seedTitles } from "./seed-titles";
import { addUserXP } from "../services/grind/user-xp-service";
import { ActionXPMap } from "../utils/actionsXpMap";
import { Roles, UserRole, ReadingStatus, UserActionType } from "../types/types";

// ---------------------------------------------------------------------------
// Données déclaratives (référencées par clés)
// ---------------------------------------------------------------------------

const PASSWORD = "Password123!"; // mot de passe commun à tous les comptes de test

// Livre « populaire » qui recevra une masse de critiques (test de pagination,
// page = 10 critiques côté resolver).
const POPULAR_BOOK_KEY = "1984";
// Nombre de lecteurs « figurants » qui critiquent le livre populaire.
const FILLER_REVIEWERS = 26;

type UserSeed = {
    key: string;
    email: string;
    userName: string;
    role: UserRole;
    avatar?: string;
    banner?: string;
    bio?: string;
};

const usersData: UserSeed[] = [
    {
        key: "admin",
        email: "admin@nuitdencre.test",
        userName: "Archiviste",
        role: Roles.Admin,
        avatar: "https://i.pravatar.cc/300?img=12",
        banner: "https://picsum.photos/seed/admin-banner/1200/320",
        bio: "Gardien des collections de la Nuit d'Encre. J'archive, je classe, je veille.",
    },
    {
        key: "elise",
        email: "elise@nuitdencre.test",
        userName: "EliseLit",
        role: Roles.User,
        avatar: "https://i.pravatar.cc/300?img=45",
        banner: "https://picsum.photos/seed/elise-banner/1200/320",
        bio: "Dévoreuse de science-fiction et de classiques. Toujours un marque-page à portée.",
    },
    {
        key: "marc",
        email: "marc@nuitdencre.test",
        userName: "MarcModere",
        role: Roles.Moderator,
        // profil partiel : bio seule, ni avatar ni bannière
        bio: "Modérateur du soir. J'aime les polars qui ne se laissent pas deviner.",
    },
    {
        key: "nora",
        email: "nora@nuitdencre.test",
        userName: "NoraNouvelle",
        role: Roles.User,
        // nouveau venu : aucun profil, aucune bibliothèque, niveau 1 / 0 XP
    },
];

type AuthorSeed = {
    key: string;
    firstname: string;
    lastname: string;
    birthDate?: string;
    nationality?: string;
    biography?: string;
    wikipediaUrl?: string;
    officialWebsite?: string;
    creator: string;
};

const authorsData: AuthorSeed[] = [
    {
        key: "exupery",
        firstname: "Antoine de",
        lastname: "Saint-Exupéry",
        birthDate: "1900-06-29",
        nationality: "fr",
        biography:
            "Écrivain, poète et aviateur français, auteur du Petit Prince, l'un des livres les plus lus au monde.",
        wikipediaUrl: "https://fr.wikipedia.org/wiki/Antoine_de_Saint-Exup%C3%A9ry",
        creator: "admin",
    },
    {
        key: "orwell",
        firstname: "George",
        lastname: "Orwell",
        birthDate: "1903-06-25",
        nationality: "en",
        biography:
            "Écrivain et journaliste britannique, célèbre pour 1984 et La Ferme des animaux, critiques du totalitarisme.",
        wikipediaUrl: "https://fr.wikipedia.org/wiki/George_Orwell",
        creator: "elise",
    },
    {
        key: "herbert",
        firstname: "Frank",
        lastname: "Herbert",
        birthDate: "1920-10-08",
        nationality: "us",
        biography:
            "Auteur américain de science-fiction, créateur du cycle de Dune, fresque écologique et politique.",
        wikipediaUrl: "https://fr.wikipedia.org/wiki/Frank_Herbert",
        creator: "elise",
    },
    {
        key: "shelley",
        firstname: "Mary",
        lastname: "Shelley",
        birthDate: "1797-08-30",
        nationality: "en",
        biography:
            "Romancière britannique, pionnière de la science-fiction avec Frankenstein, écrit à seulement dix-huit ans.",
        wikipediaUrl: "https://fr.wikipedia.org/wiki/Mary_Shelley",
        creator: "marc",
    },
    {
        key: "tolkien",
        firstname: "J.R.R.",
        lastname: "Tolkien",
        birthDate: "1892-01-03",
        nationality: "en",
        biography:
            "Écrivain et philologue britannique, père de la fantasy moderne avec Le Seigneur des Anneaux et Le Hobbit.",
        wikipediaUrl: "https://fr.wikipedia.org/wiki/J._R._R._Tolkien",
        officialWebsite: "https://www.tolkienestate.com/",
        creator: "admin",
    },
    {
        key: "christie",
        firstname: "Agatha",
        lastname: "Christie",
        birthDate: "1890-09-15",
        nationality: "en",
        biography:
            "Romancière britannique, reine du roman policier, créatrice d'Hercule Poirot et de Miss Marple.",
        wikipediaUrl: "https://fr.wikipedia.org/wiki/Agatha_Christie",
        creator: "marc",
    },
    {
        key: "hugo",
        firstname: "Victor",
        lastname: "Hugo",
        birthDate: "1802-02-26",
        nationality: "fr",
        biography:
            "Géant des lettres françaises, poète, dramaturge et romancier, auteur des Misérables et de Notre-Dame de Paris.",
        wikipediaUrl: "https://fr.wikipedia.org/wiki/Victor_Hugo",
        creator: "admin",
    },
    {
        key: "murakami",
        firstname: "Haruki",
        lastname: "Murakami",
        // partiellement incomplet : biographie présente mais ni date, ni nationalité, ni wikipedia
        biography:
            "Romancier japonais contemporain, mêlant réalisme et onirisme dans une œuvre traduite dans le monde entier.",
        creator: "elise",
    },
    {
        key: "inconnu",
        firstname: "Auteur",
        lastname: "Inconnu",
        // totalement incomplet : aucun champ optionnel renseigné (hasIncompleteInfo = true)
        creator: "marc",
    },
];

type BookSeed = {
    key: string;
    title: string;
    author: string;
    category: string;
    isbn13: string;
    isbn10?: string;
    pageCount: number;
    publishedYear: number;
    language: string;
    publisher: string;
    format: "hardcover" | "paperback" | "softcover" | "pocket";
    summary: string;
    cover: boolean; // si vrai, couverture Open Library dérivée de l'ISBN
    isImported: boolean;
    creator: string;
};

const IMPORT_SUMMARY = "Importé depuis une source externe.";

const booksData: BookSeed[] = [
    // --- Livres complets -----------------------------------------------------
    {
        key: "petitprince",
        title: "Le Petit Prince",
        author: "exupery",
        category: "Roman",
        isbn13: "9782070612758",
        isbn10: "2070612759",
        pageCount: 96,
        publishedYear: 1943,
        language: "fr",
        publisher: "Gallimard",
        format: "pocket",
        summary:
            "Un aviateur échoué dans le désert rencontre un petit prince venu d'une autre planète. Un conte poétique sur l'enfance, l'amitié et l'essentiel qui est invisible pour les yeux.",
        cover: true,
        isImported: false,
        creator: "admin",
    },
    {
        key: "1984",
        title: "1984",
        author: "orwell",
        category: "Science-Fiction",
        isbn13: "9780451524935",
        isbn10: "0451524934",
        pageCount: 328,
        publishedYear: 1949,
        language: "en",
        publisher: "Signet Classics",
        format: "paperback",
        summary:
            "Dans une société de surveillance totale dirigée par Big Brother, Winston Smith tente de préserver sa liberté de penser. Une dystopie devenue référence absolue.",
        cover: true,
        isImported: false,
        creator: "elise",
    },
    {
        key: "dune",
        title: "Dune",
        author: "herbert",
        category: "Science-Fiction",
        isbn13: "9780441013593",
        isbn10: "0441013597",
        pageCount: 412,
        publishedYear: 1965,
        language: "en",
        publisher: "Ace",
        format: "hardcover",
        summary:
            "Sur la planète désertique Arrakis, seule source de l'épice convoitée, le jeune Paul Atreides devient le pivot d'une lutte de pouvoir interstellaire.",
        cover: true,
        isImported: false,
        creator: "elise",
    },
    {
        key: "frankenstein",
        title: "Frankenstein",
        author: "shelley",
        category: "Fantastique",
        isbn13: "9780486282114",
        isbn10: "0486282112",
        pageCount: 166,
        publishedYear: 1818,
        language: "en",
        publisher: "Dover Publications",
        format: "softcover",
        summary:
            "Le savant Victor Frankenstein donne vie à une créature qu'il abandonne aussitôt. Récit fondateur sur la responsabilité de la science et la solitude.",
        cover: true,
        isImported: false,
        creator: "marc",
    },
    {
        key: "lotr",
        title: "Le Seigneur des Anneaux",
        author: "tolkien",
        category: "Fantasy",
        isbn13: "9780544003415",
        isbn10: "0544003411",
        pageCount: 1178,
        publishedYear: 1954,
        language: "en",
        publisher: "Mariner Books",
        format: "hardcover",
        summary:
            "Le hobbit Frodon hérite d'un anneau de pouvoir qu'il doit détruire au cœur du Mordor. L'épopée fondatrice de la fantasy moderne.",
        cover: true,
        isImported: false,
        creator: "admin",
    },
    {
        key: "orient",
        title: "Le Crime de l'Orient-Express",
        author: "christie",
        category: "Policier",
        isbn13: "9780062693662",
        isbn10: "0062693662",
        pageCount: 274,
        publishedYear: 1934,
        language: "en",
        publisher: "William Morrow",
        format: "pocket",
        summary:
            "Bloqué par la neige, l'Orient-Express devient le théâtre d'un meurtre. Hercule Poirot doit démasquer un coupable parmi des passagers tous suspects.",
        cover: true,
        isImported: false,
        creator: "marc",
    },
    {
        key: "kafka",
        title: "Kafka sur le rivage",
        author: "murakami",
        category: "Roman",
        isbn13: "9782264043498",
        isbn10: "2264043490",
        pageCount: 618,
        publishedYear: 2002,
        language: "fr",
        publisher: "10/18",
        format: "paperback",
        summary:
            "Deux trajectoires s'entrelacent : un adolescent en fuite et un vieil homme qui parle aux chats. Un roman onirique où le réel se dérobe.",
        cover: true,
        isImported: false,
        creator: "elise",
    },
    {
        key: "ferme",
        title: "La Ferme des animaux",
        author: "orwell",
        category: "Roman",
        isbn13: "9780451526342",
        isbn10: "0451526341",
        pageCount: 112,
        publishedYear: 1945,
        language: "fr",
        publisher: "Folio",
        format: "pocket",
        // livre sans aucune critique ni recommandation : teste les états vides
        summary:
            "Les animaux d'une ferme se révoltent contre les humains pour instaurer l'égalité. Mais la révolution dérive peu à peu vers une nouvelle tyrannie.",
        cover: true,
        isImported: false,
        creator: "admin",
    },
    {
        key: "miserables",
        title: "Les Misérables",
        author: "hugo",
        category: "Roman",
        isbn13: "9782253096337",
        isbn10: "2253096334",
        pageCount: 1664,
        publishedYear: 1862,
        language: "fr",
        publisher: "Le Livre de Poche",
        format: "hardcover",
        summary:
            "De Jean Valjean à Cosette, une fresque sur la misère, la justice et la rédemption dans la France du XIXe siècle.",
        cover: true,
        isImported: false,
        creator: "admin",
    },

    // --- Livres importés / incomplets ---------------------------------------
    {
        key: "import_full_incomplete",
        title: "El Misterio Importado",
        author: "inconnu",
        category: "Autre",
        isbn13: "9990000000017",
        pageCount: 0, // incomplet : pageCount 0
        publishedYear: 2010,
        language: "es",
        publisher: "Editorial Desconocida",
        format: "paperback",
        summary: IMPORT_SUMMARY, // incomplet : résumé importé par défaut
        cover: false, // incomplet : pas de couverture
        isImported: true,
        creator: "marc",
    },
    {
        key: "import_cat_autre",
        title: "Das Unvollständige Buch",
        author: "inconnu",
        category: "Autre", // incomplet : catégorie « Autre »
        isbn13: "9990000000024",
        pageCount: 240, // pages renseignées…
        publishedYear: 2015,
        language: "de",
        publisher: "Unbekannter Verlag",
        format: "softcover",
        summary:
            "Un livre importé dont seul le rangement en catégorie « Autre » reste à corriger.",
        cover: true, // …et couverture présente : incomplet uniquement par la catégorie
        isImported: true,
        creator: "elise",
    },
    {
        key: "import_no_cover",
        title: "Racconto Senza Copertina",
        author: "murakami",
        category: "Roman",
        isbn13: "9990000000031",
        pageCount: 180,
        publishedYear: 2018,
        language: "it",
        publisher: "Casa Editrice Notturna",
        format: "pocket",
        summary:
            "Un récit importé complet en tout point, sauf sa couverture toujours manquante.",
        cover: false, // incomplet uniquement par l'absence de couverture
        isImported: true,
        creator: "elise",
    },
];

const categoriesData = [
    "Roman",
    "Science-Fiction",
    "Fantasy",
    "Fantastique",
    "Policier",
    "Essai",
    "Autre",
];

type LibrarySeed = {
    user: string;
    book: string;
    status: ReadingStatus;
    startedAt?: string;
    finishedAt?: string;
    isPublic: boolean;
    isFavorite?: boolean;
    favoriteRank?: number;
};

const libraryData: LibrarySeed[] = [
    // Elise : bibliothèque riche, tous les statuts, favoris ordonnés, public + privé
    {
        user: "elise",
        book: "1984",
        status: ReadingStatus.READ,
        startedAt: "2026-03-01",
        finishedAt: "2026-03-20",
        isPublic: true,
        isFavorite: true,
        favoriteRank: 1,
    },
    {
        user: "elise",
        book: "dune",
        status: ReadingStatus.READING,
        startedAt: "2026-06-01",
        isPublic: true,
    },
    {
        user: "elise",
        book: "petitprince",
        status: ReadingStatus.READ,
        startedAt: "2026-01-05",
        finishedAt: "2026-01-08",
        isPublic: false, // entrée privée
        isFavorite: true,
        favoriteRank: 2,
    },
    {
        user: "elise",
        book: "kafka",
        status: ReadingStatus.PAUSED,
        startedAt: "2026-05-10",
        isPublic: true,
    },
    {
        user: "elise",
        book: "lotr",
        status: ReadingStatus.TO_READ,
        isPublic: true,
    },
    // Marc : quelques lectures, un favori
    {
        user: "marc",
        book: "frankenstein",
        status: ReadingStatus.READ,
        startedAt: "2026-02-01",
        finishedAt: "2026-02-15",
        isPublic: true,
        isFavorite: true,
        favoriteRank: 1,
    },
    {
        user: "marc",
        book: "orient",
        status: ReadingStatus.READ,
        startedAt: "2026-04-01",
        finishedAt: "2026-04-10",
        isPublic: true,
    },
    {
        user: "marc",
        book: "1984",
        status: ReadingStatus.READING,
        startedAt: "2026-06-05",
        isPublic: false, // entrée privée
    },
    // Admin : bibliothèque modeste
    {
        user: "admin",
        book: "petitprince",
        status: ReadingStatus.READ,
        startedAt: "2025-12-01",
        finishedAt: "2025-12-03",
        isPublic: true,
        isFavorite: true,
        favoriteRank: 1,
    },
    {
        user: "admin",
        book: "lotr",
        status: ReadingStatus.READ,
        startedAt: "2026-01-10",
        finishedAt: "2026-02-20",
        isPublic: true,
    },
    {
        user: "admin",
        book: "miserables",
        status: ReadingStatus.TO_READ,
        isPublic: true,
    },
    // Nora : aucune entrée (état vide volontaire)
];

const DETAILED = (txt: string) => txt; // simple marqueur de lisibilité

type ReviewSeed = {
    user: string;
    book: string;
    rating: number;
    text?: string;
};

const reviewsData: ReviewSeed[] = [
    {
        user: "elise",
        book: "1984",
        rating: 5,
        text: DETAILED(
            "Une lecture qui hante longtemps après la dernière page. Orwell construit un monde d'une cohérence glaçante, où le langage lui-même devient une arme. La novlangue, la réécriture permanente du passé, la solitude de Winston : tout concourt à montrer comment un régime peut coloniser jusqu'à la pensée. Un classique qui n'a rien perdu de son tranchant.",
        ),
    },
    {
        user: "marc",
        book: "1984",
        rating: 4,
        text: "Glaçant et toujours d'actualité. Un peu lent au milieu.",
    },
    {
        user: "elise",
        book: "dune",
        rating: 4,
        text: DETAILED(
            "Un univers d'une densité rare : politique, écologie, religion et économie de l'épice s'entremêlent sans jamais perdre le lecteur. Herbert prend le temps d'installer Arrakis et ses enjeux, et la patience est récompensée. Quelques longueurs dans les passages contemplatifs, mais la construction du monde force le respect.",
        ),
    },
    {
        user: "marc",
        book: "frankenstein",
        rating: 5,
        text: DETAILED(
            "Bien plus qu'une histoire de monstre : un texte sur l'abandon, la responsabilité et la quête de reconnaissance. La créature, éloquente et désespérée, renverse notre regard. Que doit-on à ce que l'on crée ? Mary Shelley pose la question avec une modernité stupéfiante pour 1818.",
        ),
    },
    {
        user: "admin",
        book: "frankenstein",
        rating: 3,
        text: "Intéressant mais le style daté m'a tenu à distance.",
    },
    {
        user: "marc",
        book: "orient",
        rating: 5,
        text: DETAILED(
            "Le huis clos parfait. Christie distribue les indices avec une élégance redoutable et la résolution, audacieuse, relit toute l'enquête. Poirot y est au sommet de son art. Un modèle de mécanique narrative qu'on a envie de relire aussitôt pour repérer ce qu'on avait manqué.",
        ),
    },
    {
        user: "admin",
        book: "lotr",
        rating: 5,
        text: DETAILED(
            "La pierre angulaire de la fantasy. Tolkien ne raconte pas seulement une quête, il fait exister un monde entier — ses langues, ses peuples, sa géographie, son histoire profonde. Le souffle épique côtoie des moments d'une grande tendresse. Exigeant, parfois lent, mais d'une richesse inépuisable.",
        ),
    },
    {
        user: "elise",
        book: "lotr",
        rating: 4,
        text: "Magistral, même si les chansons m'ont parfois ralentie.",
    },
    {
        user: "admin",
        book: "petitprince",
        rating: 5,
        text: "Un livre dont on redécouvre le sens à chaque âge.",
    },
    {
        user: "elise",
        book: "petitprince",
        rating: 5,
        text: DETAILED(
            "On croit le connaître par cœur, et pourtant il dit toujours quelque chose de neuf. Sous la simplicité du conte affleure une mélancolie douce sur ce qu'on perd en grandissant. La rose, le renard, l'allumeur de réverbères : autant de petites leçons qui ne moralisent jamais. Bouleversant de sobriété.",
        ),
    },
];

type VoteSeed = {
    user: string;
    reviewUser: string; // auteur de la critique visée
    reviewBook: string; // livre de la critique visée
    helpful: boolean;
};

const votesData: VoteSeed[] = [
    // critique détaillée d'Elise sur 1984 : jugée utile
    { user: "marc", reviewUser: "elise", reviewBook: "1984", helpful: true },
    { user: "admin", reviewUser: "elise", reviewBook: "1984", helpful: true },
    // critique courte de Marc sur 1984 : avis partagés
    { user: "elise", reviewUser: "marc", reviewBook: "1984", helpful: true },
    { user: "admin", reviewUser: "marc", reviewBook: "1984", helpful: false },
    // critique d'Admin sur LOTR : jugée utile
    { user: "elise", reviewUser: "admin", reviewBook: "lotr", helpful: true },
    { user: "marc", reviewUser: "admin", reviewBook: "lotr", helpful: true },
    // critique de Marc sur Frankenstein
    { user: "admin", reviewUser: "marc", reviewBook: "frankenstein", helpful: true },
];

type RecommendationSeed = { user: string; book: string };

const recommendationsData: RecommendationSeed[] = [
    { user: "elise", book: "1984" },
    { user: "admin", book: "1984" },
    { user: "elise", book: "dune" },
    { user: "admin", book: "lotr" },
    { user: "elise", book: "lotr" },
    { user: "marc", book: "frankenstein" },
];

// Actions de complétion (corrections d'infos manquantes) pour exercer
// BOOK_COMPLETED / AUTHOR_COMPLETED dans l'historique de gamification.
const completionActions: {
    user: string;
    type: UserActionType;
    target: string;
    label: string;
}[] = [
    { user: "marc", type: UserActionType.BOOK_COMPLETED, target: "import_full_incomplete", label: "El Misterio Importado" },
    { user: "elise", type: UserActionType.AUTHOR_COMPLETED, target: "murakami", label: "Haruki Murakami" },
];

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

const coverFor = (isbn13: string) =>
    `https://covers.openlibrary.org/b/isbn/${isbn13}-L.jpg`;

const DETAILED_THRESHOLD = 200;

type PendingAction = {
    type: UserActionType;
    createdAt: Date;
    targetId?: string;
    metadata?: string;
};

async function seed() {
    await dataSource.initialize();
    console.log("🔌 Connexion à la base établie");

    // Les titres de gamification sont conservés et garantis présents.
    await seedTitles();

    // Purge des tables métier (l'ordre importe peu grâce à CASCADE).
    await dataSource.query(
        `TRUNCATE TABLE
            "user_actions",
            "book_review_vote",
            "book_recommendation",
            "book_review",
            "user_book",
            "book",
            "author",
            "category",
            "user"
        RESTART IDENTITY CASCADE`,
    );
    console.log("🧹 Tables métier vidées");

    // --- Utilisateurs --------------------------------------------------------
    const usersByKey = new Map<string, User>();
    // Historique d'actions par utilisateur (clé = userKey)
    const actionsByUser = new Map<string, PendingAction[]>();
    for (const u of usersData) actionsByUser.set(u.key, []);

    for (const u of usersData) {
        const user = await register(u.email, PASSWORD, u.userName, u.role);
        user.avatar = u.avatar ?? null;
        user.banner = u.banner ?? null;
        user.bio = u.bio ?? null;
        await user.save();
        usersByKey.set(u.key, user);
    }
    console.log(`👤 ${usersData.length} utilisateurs créés`);

    // Base de temps : on étale les actions sur ~90 derniers jours.
    const now = Date.now();
    const seqByUser = new Map<string, number>();
    const pushAction = (
        userKey: string,
        type: UserActionType,
        targetId?: string,
        metadata?: Record<string, unknown>,
    ) => {
        const seq = seqByUser.get(userKey) ?? 0;
        seqByUser.set(userKey, seq + 1);
        const createdAt = new Date(now - (90 - seq) * 24 * 60 * 60 * 1000);
        actionsByUser.get(userKey)!.push({
            type,
            createdAt,
            targetId,
            metadata: metadata ? JSON.stringify(metadata) : undefined,
        });
    };

    // --- Catégories ----------------------------------------------------------
    const admin = usersByKey.get("admin")!;
    const categoriesByName = new Map<string, Category>();
    for (const name of categoriesData) {
        const category = Category.create({ name, createdBy: admin });
        await category.save();
        categoriesByName.set(name, category);
    }
    console.log(`🏷️  ${categoriesData.length} catégories créées`);

    // --- Auteurs -------------------------------------------------------------
    const authorsByKey = new Map<string, Author>();
    for (const a of authorsData) {
        const author = Author.create({
            firstname: a.firstname,
            lastname: a.lastname,
            birthDate: a.birthDate,
            nationality: a.nationality,
            biography: a.biography,
            wikipediaUrl: a.wikipediaUrl,
            officialWebsite: a.officialWebsite,
            user: usersByKey.get(a.creator)!,
        });
        await author.save();
        authorsByKey.set(a.key, author);
        pushAction(a.creator, UserActionType.AUTHOR_ADDED, author.id, {
            author: `${a.firstname} ${a.lastname}`,
        });
    }
    console.log(`✍️  ${authorsData.length} auteurs créés`);

    // --- Livres --------------------------------------------------------------
    const booksByKey = new Map<string, Book>();
    for (const b of booksData) {
        const book = Book.create({
            title: b.title,
            summary: b.summary,
            author: authorsByKey.get(b.author)!,
            category: categoriesByName.get(b.category)!,
            isbn10: b.isbn10,
            isbn13: b.isbn13,
            pageCount: b.pageCount,
            publishedYear: b.publishedYear,
            language: b.language,
            publisher: b.publisher,
            format: b.format,
            coverUrl: b.cover ? coverFor(b.isbn13) : undefined,
            isImported: b.isImported,
            user: usersByKey.get(b.creator)!,
        });
        await book.save();
        booksByKey.set(b.key, book);
        pushAction(
            b.creator,
            b.isImported
                ? UserActionType.BOOK_IMPORTED
                : UserActionType.BOOK_ADDED,
            book.id,
            { title: b.title },
        );
    }
    console.log(`📚 ${booksData.length} livres créés`);

    // --- Bibliothèques -------------------------------------------------------
    for (const l of libraryData) {
        const entry = UserBook.create({
            user: usersByKey.get(l.user)!,
            book: booksByKey.get(l.book)!,
            status: l.status,
            startedAt: l.startedAt ? new Date(l.startedAt) : null,
            finishedAt: l.finishedAt ? new Date(l.finishedAt) : null,
            isPublic: l.isPublic,
            isFavorite: l.isFavorite ?? false,
            favoriteRank: l.favoriteRank ?? null,
        });
        await entry.save();
        pushAction(l.user, UserActionType.BOOK_ADDED_TO_LIBRARY, entry.id, {
            title: booksData.find((b) => b.key === l.book)?.title,
        });
        if (l.status === ReadingStatus.READ) {
            pushAction(l.user, UserActionType.BOOK_FINISHED, entry.id, {
                title: booksData.find((b) => b.key === l.book)?.title,
            });
        }
    }
    console.log(`📖 ${libraryData.length} entrées de bibliothèque créées`);

    // --- Critiques -----------------------------------------------------------
    // clé = `${userKey}|${bookKey}`
    const reviewsByKey = new Map<string, BookReview>();
    for (const r of reviewsData) {
        const review = BookReview.create({
            rating: r.rating,
            reviewText: r.text,
            user: usersByKey.get(r.user)!,
            book: booksByKey.get(r.book)!,
        });
        await review.save();
        reviewsByKey.set(`${r.user}|${r.book}`, review);
        pushAction(r.user, UserActionType.REVIEW_CREATED, review.id, {
            book: booksData.find((b) => b.key === r.book)?.title,
        });
        if (r.text && r.text.length > DETAILED_THRESHOLD) {
            pushAction(r.user, UserActionType.DETAILED_REVIEW_BONUS, review.id, {
                book: booksData.find((b) => b.key === r.book)?.title,
            });
        }
    }
    console.log(`⭐ ${reviewsData.length} critiques créées`);

    // --- Votes ---------------------------------------------------------------
    let voteCount = 0;
    for (const v of votesData) {
        const review = reviewsByKey.get(`${v.reviewUser}|${v.reviewBook}`);
        if (!review) continue;
        if (v.user === v.reviewUser) continue; // garde-fou : pas de vote sur sa propre critique
        const vote = BookReviewVote.create({
            isHelpful: v.helpful,
            user: usersByKey.get(v.user)!,
            review,
        });
        await vote.save();
        voteCount++;
        // L'XP « critique jugée utile » revient à l'auteur de la critique.
        if (v.helpful) {
            pushAction(v.reviewUser, UserActionType.REVIEW_VOTED_HELPFUL, review.id);
        }
    }
    console.log(`👍 ${voteCount} votes créés`);

    // --- Recommandations -----------------------------------------------------
    for (const rec of recommendationsData) {
        const recommendation = BookRecommendation.create({
            user: usersByKey.get(rec.user)!,
            book: booksByKey.get(rec.book)!,
        });
        await recommendation.save();
        pushAction(rec.user, UserActionType.BOOK_RECOMMENDED, recommendation.id, {
            book: booksData.find((b) => b.key === rec.book)?.title,
        });
    }
    console.log(`🤝 ${recommendationsData.length} recommandations créées`);

    // -----------------------------------------------------------------------
    // Cas de charge
    //   1. Une masse de critiques sur un même livre (pagination).
    //   2. Un lecteur « doyen » poussé au niveau maximum (10).
    // Ces utilisateurs supplémentaires rejoignent le calcul d'XP via
    // `extraXpUsers` ; `targetLevel` déclenche un complément d'actions.
    // -----------------------------------------------------------------------
    const extraXpUsers: { key: string; targetLevel?: number }[] = [];

    const popularBook = booksByKey.get(POPULAR_BOOK_KEY)!;
    const popularTitle = booksData.find((b) => b.key === POPULAR_BOOK_KEY)!.title;

    const fillerShort = [
        "Un classique indémodable.",
        "Bof, un peu surcoté à mon goût.",
        "Glaçant et brillant.",
        "Je n'ai pas réussi à entrer dedans.",
        "Lecture marquante, à conseiller.",
        "Dérangeant, dans le bon sens.",
        "Daté par endroits mais puissant.",
        "Une claque littéraire.",
    ];
    const fillerLong = [
        "Relu des années après, l'effet est intact : la mécanique de l'oppression y est décrite avec une précision presque clinique. Ce qui frappe, c'est moins l'intrigue que la lente érosion de la capacité à penser par soi-même. Un livre dont chaque page résonne avec une actualité dérangeante.",
        "Difficile de rester indifférent face à ce huis clos mental. L'auteur ne cherche pas à séduire mais à alerter, et c'est précisément ce qui rend la lecture si inconfortable et si nécessaire. La dernière partie, en particulier, m'a hanté longtemps après avoir refermé le livre.",
    ];

    // Clés des critiques figurantes, pour les votes du doyen.
    const fillerReviewRefs: { reviewKey: string; ownerKey: string }[] = [];

    for (let i = 1; i <= FILLER_REVIEWERS; i++) {
        const key = `filler${i}`;
        const num = String(i).padStart(2, "0");
        const user = await register(
            `lecteur${num}@nuitdencre.test`,
            PASSWORD,
            `Lecteur ${num}`,
            Roles.User,
        );
        usersByKey.set(key, user);
        actionsByUser.set(key, []);
        extraXpUsers.push({ key });

        // Entrée de bibliothèque (lu) sur le livre populaire.
        const entry = UserBook.create({
            user,
            book: popularBook,
            status: ReadingStatus.READ,
            startedAt: new Date(now - (i + 30) * 24 * 60 * 60 * 1000),
            finishedAt: new Date(now - i * 24 * 60 * 60 * 1000),
            isPublic: true,
            isFavorite: false,
            favoriteRank: null,
        });
        await entry.save();
        pushAction(key, UserActionType.BOOK_ADDED_TO_LIBRARY, entry.id, {
            title: popularTitle,
        });
        pushAction(key, UserActionType.BOOK_FINISHED, entry.id, {
            title: popularTitle,
        });

        // Critique variée : certaines détaillées, certaines courtes,
        // une sur cinq sans texte (note seule).
        const noText = i % 5 === 0;
        const detailed = i % 5 === 2;
        const text = noText
            ? undefined
            : detailed
              ? fillerLong[i % fillerLong.length]
              : fillerShort[i % fillerShort.length];
        const rating = 2 + (i % 4); // 2 → 5

        const review = BookReview.create({
            rating,
            reviewText: text,
            user,
            book: popularBook,
        });
        await review.save();
        const reviewKey = `${key}|${POPULAR_BOOK_KEY}`;
        reviewsByKey.set(reviewKey, review);
        fillerReviewRefs.push({ reviewKey, ownerKey: key });

        pushAction(key, UserActionType.REVIEW_CREATED, review.id, {
            book: popularTitle,
        });
        if (text && text.length > DETAILED_THRESHOLD) {
            pushAction(key, UserActionType.DETAILED_REVIEW_BONUS, review.id, {
                book: popularTitle,
            });
        }
    }
    console.log(
        `🧑‍🤝‍🧑 ${FILLER_REVIEWERS} lecteurs figurants + critiques sur « ${popularTitle} »`,
    );

    // --- Doyen : lecteur poussé au niveau maximum ---------------------------
    const powerReviewText = (title: string) =>
        `Après tant de lectures, « ${title} » conserve une place à part dans ma bibliothèque. ` +
        "On y revient comme à un repère : chaque relecture en révèle une strate nouvelle, " +
        "une nuance qu'on avait laissée filer. C'est le genre d'ouvrage qui ne se referme " +
        "jamais vraiment et continue de dialoguer avec tout ce qu'on lira ensuite.";

    const doyen = await register(
        "doyen@nuitdencre.test",
        PASSWORD,
        "Doyen",
        Roles.User,
    );
    usersByKey.set("power", doyen);
    actionsByUser.set("power", []);
    extraXpUsers.push({ key: "power", targetLevel: 10 });

    // Le doyen a lu, critiqué (en détail) et recommandé l'ensemble du catalogue.
    for (const b of booksData) {
        const book = booksByKey.get(b.key)!;

        const entry = UserBook.create({
            user: doyen,
            book,
            status: ReadingStatus.READ,
            startedAt: new Date(now - 200 * 24 * 60 * 60 * 1000),
            finishedAt: new Date(now - 120 * 24 * 60 * 60 * 1000),
            isPublic: true,
            isFavorite: false,
            favoriteRank: null,
        });
        await entry.save();
        pushAction("power", UserActionType.BOOK_ADDED_TO_LIBRARY, entry.id, {
            title: b.title,
        });
        pushAction("power", UserActionType.BOOK_FINISHED, entry.id, {
            title: b.title,
        });

        const review = BookReview.create({
            rating: 5,
            reviewText: powerReviewText(b.title),
            user: doyen,
            book,
        });
        await review.save();
        reviewsByKey.set(`power|${b.key}`, review);
        pushAction("power", UserActionType.REVIEW_CREATED, review.id, {
            book: b.title,
        });
        pushAction("power", UserActionType.DETAILED_REVIEW_BONUS, review.id, {
            book: b.title,
        });

        const reco = BookRecommendation.create({ user: doyen, book });
        await reco.save();
        pushAction("power", UserActionType.BOOK_RECOMMENDED, reco.id, {
            book: b.title,
        });
    }

    // Le doyen juge utiles quelques critiques figurantes (alimente le tri
    // « helpful » sur le livre populaire et récompense leurs auteurs).
    const votesToCast = Math.min(8, fillerReviewRefs.length);
    for (let i = 0; i < votesToCast; i++) {
        const { reviewKey, ownerKey } = fillerReviewRefs[i];
        const review = reviewsByKey.get(reviewKey)!;
        const vote = BookReviewVote.create({
            isHelpful: true,
            user: doyen,
            review,
        });
        await vote.save();
        pushAction(ownerKey, UserActionType.REVIEW_VOTED_HELPFUL, review.id);
    }
    console.log(
        `🎖️  Doyen créé (catalogue complet lu/critiqué/recommandé, ${votesToCast} votes émis)`,
    );

    // --- Actions de complétion ----------------------------------------------
    for (const c of completionActions) {
        const targetId =
            c.type === UserActionType.BOOK_COMPLETED
                ? booksByKey.get(c.target)?.id
                : authorsByKey.get(c.target)?.id;
        pushAction(c.user, c.type, targetId, { label: c.label });
    }

    // --- Persistance des UserActions + recalcul niveau/XP --------------------
    // Base + utilisateurs supplémentaires (figurants, doyen).
    const xpUsers: { key: string; targetLevel?: number }[] = [
        ...usersData.map((u) => ({ key: u.key })),
        ...extraXpUsers,
    ];

    for (const xu of xpUsers) {
        const actions = actionsByUser.get(xu.key)!;
        const user = usersByKey.get(xu.key)!;

        let xp = 0;
        let level = 1;

        const persist = async (
            type: UserActionType,
            createdAt: Date,
            targetId?: string,
            metadata?: string,
        ) => {
            const gained = ActionXPMap[type];
            const action = UserActions.create({
                user,
                type,
                xp: gained,
                createdAt,
                targetId,
                metadata,
            });
            await action.save();
            const result = addUserXP(xp, level, gained);
            xp = result.newXP;
            level = result.newLevel;
        };

        for (const a of actions) {
            await persist(a.type, a.createdAt, a.targetId, a.metadata);
        }

        // Complément jusqu'au niveau cible : on consigne des jalons de lecture
        // supplémentaires (BOOK_FINISHED) jusqu'à franchir le palier demandé.
        let padding = 0;
        while (xu.targetLevel && level < xu.targetLevel) {
            await persist(
                UserActionType.BOOK_FINISHED,
                new Date(now - padding * 12 * 60 * 60 * 1000),
                undefined,
                JSON.stringify({ note: "Jalon de lecture" }),
            );
            padding++;
        }

        user.xp = xp;
        user.level = level;
        await user.save();
        console.log(
            `   ↳ ${user.userName} : niveau ${level}, ${xp} XP, ${actions.length + padding} actions`,
        );
    }

    console.log("\n✅ Seed terminé.");
    console.log("   Comptes de test (mot de passe commun) :");
    for (const u of usersData) {
        console.log(`   • ${u.email}  (${u.role})`);
    }
    console.log("   • doyen@nuitdencre.test  (user, niveau 10)");
    console.log(
        `   • lecteur01..${String(FILLER_REVIEWERS).padStart(2, "0")}@nuitdencre.test  (figurants, critiques de « ${popularTitle} »)`,
    );
    console.log(`   Mot de passe : ${PASSWORD}`);

    await dataSource.destroy();
}

seed().catch(async (error) => {
    console.error("🚨 Échec du seed :", error);
    if (dataSource.isInitialized) await dataSource.destroy();
    process.exit(1);
});
