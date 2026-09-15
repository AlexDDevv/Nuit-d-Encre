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
 *  - recommandations,
 *  - abonnements entre utilisateurs (graphe de follows crédible, sans XP),
 *  - commentaires plats sous des critiques existantes (sans XP),
 *  - catalogue assez volumineux pour paginer (livres, auteurs, bibliothèque),
 *  - contenus extrêmes pour le responsive (titres, noms, bio, critiques et
 *    commentaires très longs, mot insécable),
 *  - bannières de site (une active, les autres en historique),
 *  - compte Google sans mot de passe (bibliothèque entièrement privée),
 *  - compte supprimé via `eraseUserAccount` (contributions anonymisées).
 *
 * ⚠️ Destructif : vide toutes les tables métier (sauf `title`) avant insertion.
 * L'admin défini dans `.env` (ADMIN_*) est recréé en fin de seed.
 *
 * Mot de passe des comptes de test : variable d'environnement `SEED_PASSWORD`.
 * Défaut faible toléré en dev uniquement ; en production (`NODE_ENV=production`)
 * le script refuse de s'exécuter sans elle.
 *
 * Lancement :
 *  - dev : `pnpm seed:db` (ou `docker compose exec back pnpm seed:db`)
 *  - prod (conteneur compilé, sans ts-node) : `node dist/scripts/seed-database.js`
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
import { BookReviewComment } from "../database/entities/book/bookReviewComment";
import { BookRecommendation } from "../database/entities/book/bookRecommendation";
import { UserFollow } from "../database/entities/user/user-follow";
import { UserActions } from "../database/entities/user/user-actions";
import { SiteBanner } from "../database/entities/banner/site-banner";
import { register } from "../services/auth-service";
import { eraseUserAccount } from "../services/rgpd/erasure-service";
import { seedTitles } from "./seed-titles";
import { createAdmin } from "./create-admin";
import { addUserXP } from "../services/grind/user-xp-service";
import { ActionXPMap } from "../utils/actionsXpMap";
import {
    BannerAudience,
    BannerVariant,
    Roles,
    UserRole,
    ReadingStatus,
    UserActionType,
} from "../types/types";

// ---------------------------------------------------------------------------
// Données déclaratives (référencées par clés)
// ---------------------------------------------------------------------------

// Mot de passe commun aux comptes de test. Le défaut est public (versionné) :
// il n'est toléré qu'en dev, la prod exige SEED_PASSWORD pour ne jamais créer
// un compte admin de démo au mot de passe connu.
const PASSWORD = process.env.SEED_PASSWORD ?? "Password123!";

if (process.env.NODE_ENV === "production" && !process.env.SEED_PASSWORD) {
    throw new Error(
        "SEED_PASSWORD est obligatoire en production (mot de passe par défaut public).",
    );
}

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
    // Compte Google pur : pas de mot de passe, connexion impossible en local.
    googleId?: string;
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
    {
        key: "insomniaque",
        email: "insomniaque@nuitdencre.test",
        // cas limite responsive : pseudo long, bio à 300 caractères (max)
        userName: "Bibliothécaire_Insomniaque_des_Grands_Boulevards",
        role: Roles.User,
        avatar: "https://i.pravatar.cc/300?img=32",
        banner: "https://picsum.photos/seed/insomniaque-banner/1600/400",
        bio: "Je lis la nuit, je relis à l'aube et je note tout dans des carnets qui débordent des étagères. Amatrice de sommes interminables, de notes de bas de page et de digressions, je laisse des critiques beaucoup trop longues. Si vous cherchez un avis concis, passez votre chemin : ici on prend son temps.",
    },
    {
        key: "gaspard",
        email: "gaspard.google@nuitdencre.test",
        userName: "Gaspard",
        role: Roles.User,
        avatar: "https://i.pravatar.cc/300?img=68",
        googleId: "seed-google-000000000001",
        // compte Google pur, bibliothèque entièrement privée, ni bio ni bannière
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

    // --- Volume (pagination de la page Auteurs : 12 par page) ---------------
    ...(
        [
            ["camus", "Albert", "Camus", "1913-11-07", "fr", "Romancier, essayiste et dramaturge français, prix Nobel de littérature 1957, penseur de l'absurde et de la révolte.", "Albert_Camus", "admin"],
            ["zola", "Émile", "Zola", "1840-04-02", "fr", "Chef de file du naturalisme, auteur des vingt romans des Rougon-Macquart et figure de l'affaire Dreyfus.", "%C3%89mile_Zola", "admin"],
            ["verne", "Jules", "Verne", "1828-02-08", "fr", "Pionnier du roman d'aventures scientifiques, auteur des Voyages extraordinaires.", "Jules_Verne", "elise"],
            ["asimov", "Isaac", "Asimov", "1920-01-02", "us", "Biochimiste et écrivain américain, maître de l'âge d'or de la science-fiction, père des lois de la robotique.", "Isaac_Asimov", "elise"],
            ["leguin", "Ursula K.", "Le Guin", "1929-10-21", "us", "Autrice américaine de science-fiction et de fantasy, créatrice de Terremer et de l'Ekumen.", "Ursula_K._Le_Guin", "elise"],
            ["simenon", "Georges", "Simenon", "1903-02-13", "be", "Romancier belge prolifique, créateur du commissaire Maigret.", "Georges_Simenon", "marc"],
            ["yourcenar", "Marguerite", "Yourcenar", "1903-06-08", "fr", "Romancière et essayiste, première femme élue à l'Académie française.", "Marguerite_Yourcenar", "admin"],
            ["pratchett", "Terry", "Pratchett", "1948-04-28", "en", "Romancier britannique, auteur satirique des Annales du Disque-monde.", "Terry_Pratchett", "insomniaque"],
            ["atwood", "Margaret", "Atwood", "1939-11-18", "ca", "Romancière et poétesse canadienne, autrice de La Servante écarlate.", "Margaret_Atwood", "elise"],
            ["dumas", "Alexandre", "Dumas", "1802-07-24", "fr", "Romancier et dramaturge, maître du roman historique et feuilletonesque.", "Alexandre_Dumas", "admin"],
            ["beauvoir", "Simone de", "Beauvoir", "1908-01-09", "fr", "Philosophe, romancière et essayiste, figure majeure de l'existentialisme et du féminisme.", "Simone_de_Beauvoir", "insomniaque"],
        ] as const
    ).map(
        ([key, firstname, lastname, birthDate, nationality, biography, wiki, creator]): AuthorSeed => ({
            key,
            firstname,
            lastname,
            birthDate,
            nationality,
            biography,
            wikipediaUrl: `https://fr.wikipedia.org/wiki/${wiki}`,
            creator,
        }),
    ),

    // --- Cas limite responsive : noms très longs, biographie fleuve ---------
    {
        key: "longname",
        firstname: "Anne-Marie Clémentine Joséphine",
        lastname: "de La Tour-d'Auvergne-Montmorency-Laval",
        birthDate: "1954-03-21",
        nationality: "ch",
        biography: [
            "Bibliothécaire de formation, archiviste par vocation et romancière par accident, elle a passé trente ans à classer les fonds oubliés des bibliothèques municipales de Suisse romande avant de publier, sur le tard, une série de chroniques dont la longueur des titres est devenue une marque de fabrique.",
            "Son œuvre, volontiers digressive, mêle souvenirs de lecture, inventaires imaginaires et portraits de lecteurs de passage. Chaque volume s'ouvre sur une liste d'objets trouvés entre les pages des livres rendus : tickets de métro, fleurs séchées, lettres jamais envoyées.",
            "Traduite dans une dizaine de langues, elle refuse toute interview et ne répond qu'au courrier manuscrit, qu'elle archive évidemment avec le plus grand soin.",
        ].join("\n\n"),
        wikipediaUrl: "https://fr.wikipedia.org/wiki/Biblioth%C3%A9caire",
        officialWebsite:
            "https://www.chroniques-crepusculaires-de-la-bibliothecaire-insomniaque.example.org/",
        creator: "insomniaque",
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
    coverUrl?: string; // couverture explicite (prioritaire sur `cover`)
    isImported: boolean;
    creator: string;
    // Exclu du parcours du doyen : garde un livre sans critique ni recommandation.
    untouched?: boolean;
};

const IMPORT_SUMMARY = "Importé depuis une source externe.";

// ISBN-13 fictif mais valide (clé de contrôle calculée), préfixe 979-10-9.
const fakeIsbn13 = (seq: number) => {
    const base = `9791090${String(seq).padStart(5, "0")}`;
    const sum = [...base].reduce(
        (acc, digit, i) => acc + Number(digit) * (i % 2 === 0 ? 1 : 3),
        0,
    );
    return `${base}${(10 - (sum % 10)) % 10}`;
};

// Couverture de substitution stable pour les livres de volume.
const placeholderCover = (key: string) =>
    `https://picsum.photos/seed/nde-${key}/400/600`;

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
        untouched: true,
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

    // --- Volume (pagination de l'accueil : 12 livres par page) --------------
    // [clé, titre, auteur, catégorie, année, pages, éditeur, format, résumé, créateur, untouched]
    ...(
        [
            ["etranger", "L'Étranger", "camus", "Roman", 1942, 184, "Gallimard", "pocket", "Meursault, employé de bureau à Alger, tue un homme sur une plage écrasée de soleil. Son procès devient celui de son indifférence.", "admin", false],
            ["peste", "La Peste", "camus", "Roman", 1947, 352, "Folio", "pocket", "Une épidémie de peste met Oran en quarantaine. Le docteur Rieux et quelques hommes résistent au fléau, chacun à sa manière.", "admin", false],
            ["sisyphe", "Le Mythe de Sisyphe", "camus", "Essai", 1942, 187, "Folio", "pocket", "Essai sur l'absurde : faut-il que la vie ait un sens pour être vécue ? Il faut imaginer Sisyphe heureux.", "insomniaque", false],
            ["germinal", "Germinal", "zola", "Roman", 1885, 592, "Le Livre de Poche", "pocket", "Étienne Lantier arrive dans le bassin minier du Nord et prend la tête d'une grève qui tourne à la tragédie.", "admin", false],
            ["assommoir", "L'Assommoir", "zola", "Roman", 1877, 576, "Folio", "paperback", "Gervaise, blanchisseuse courageuse, voit sa vie emportée par l'alcool et la misère du Paris ouvrier.", "admin", false],
            ["vingtmille", "Vingt mille lieues sous les mers", "verne", "Science-Fiction", 1870, 512, "Hetzel", "hardcover", "Le professeur Aronnax est fait prisonnier à bord du Nautilus, le sous-marin du mystérieux capitaine Nemo.", "elise", false],
            ["tourdumonde", "Le Tour du monde en quatre-vingts jours", "verne", "Roman", 1872, 320, "Le Livre de Poche", "pocket", "Phileas Fogg parie sa fortune qu'il bouclera le tour du globe en quatre-vingts jours, flanqué de son valet Passepartout.", "elise", false],
            ["terrelune", "De la Terre à la Lune", "verne", "Science-Fiction", 1865, 288, "Folio", "softcover", "Les membres du Gun-Club de Baltimore décident d'envoyer un obus habité vers la Lune.", "elise", true],
            ["fondation", "Fondation", "asimov", "Science-Fiction", 1951, 416, "Folio SF", "pocket", "Le mathématicien Hari Seldon prédit la chute de l'Empire galactique et fonde une communauté chargée d'abréger l'âge des ténèbres.", "elise", false],
            ["robots", "Les Robots", "asimov", "Science-Fiction", 1950, 320, "J'ai lu", "pocket", "Neuf nouvelles explorant les paradoxes des trois lois de la robotique à travers la carrière de la robopsychologue Susan Calvin.", "elise", false],
            ["terremer", "Le Sorcier de Terremer", "leguin", "Fantasy", 1968, 256, "Le Livre de Poche", "pocket", "Le jeune Ged, doué pour la magie, libère par orgueil une ombre qu'il devra pourchasser jusqu'aux confins de l'archipel.", "elise", false],
            ["maingauche", "La Main gauche de la nuit", "leguin", "Science-Fiction", 1969, 352, "Robert Laffont", "paperback", "Un envoyé terrien sur la planète glacée Nivôse doit comprendre une société où le genre n'est pas fixe.", "insomniaque", false],
            ["pietr", "Pietr-le-Letton", "simenon", "Policier", 1931, 190, "Le Livre de Poche", "pocket", "La première enquête du commissaire Maigret, sur la piste d'un escroc international insaisissable.", "marc", false],
            ["clochard", "Maigret et le Clochard", "simenon", "Policier", 1963, 180, "Presses de la Cité", "softcover", "Un clochard est repêché dans la Seine après une agression. Maigret s'intéresse à cet ancien médecin devenu vagabond.", "marc", true],
            ["hadrien", "Mémoires d'Hadrien", "yourcenar", "Roman", 1951, 364, "Gallimard", "paperback", "Au soir de sa vie, l'empereur Hadrien écrit à son successeur Marc Aurèle une longue lettre sur le pouvoir, l'amour et la mort.", "admin", false],
            ["huitiemecouleur", "La Huitième Couleur", "pratchett", "Fantasy", 1983, 288, "Pocket", "pocket", "Rincevent, mage raté, doit escorter Deuxfleurs, premier touriste du Disque-monde, à travers mille catastrophes.", "insomniaque", false],
            ["mortimer", "Mortimer", "pratchett", "Fantasy", 1987, 320, "Pocket", "pocket", "La Mort prend un apprenti, Mortimer, qui s'empresse de tout dérégler en sauvant une princesse promise au trépas.", "insomniaque", false],
            ["servante", "La Servante écarlate", "atwood", "Science-Fiction", 1985, 512, "Robert Laffont", "paperback", "Dans la république théocratique de Galaad, Defred est une servante vouée à la reproduction. Elle se souvient d'avant.", "elise", false],
            ["mousquetaires", "Les Trois Mousquetaires", "dumas", "Roman", 1844, 896, "Folio", "pocket", "Le jeune d'Artagnan monte à Paris et se lie à Athos, Porthos et Aramis au service du roi contre les intrigues de Richelieu.", "admin", false],
            ["montecristo", "Le Comte de Monte-Cristo", "dumas", "Roman", 1844, 1504, "Le Livre de Poche", "hardcover", "Trahi et emprisonné au château d'If, Edmond Dantès s'évade et prépare une vengeance patiente et implacable.", "admin", false],
            ["deuxiemesexe", "Le Deuxième Sexe", "beauvoir", "Essai", 1949, 1000, "Gallimard", "paperback", "« On ne naît pas femme : on le devient. » Une analyse fondatrice de la condition féminine.", "insomniaque", false],
            ["jeunefille", "Mémoires d'une jeune fille rangée", "beauvoir", "Essai", 1958, 480, "Folio", "pocket", "Premier volet autobiographique : l'enfance bourgeoise et l'émancipation intellectuelle de la jeune Simone.", "insomniaque", true],
            ["nil", "Mort sur le Nil", "christie", "Policier", 1937, 352, "Le Livre de Poche", "pocket", "Une riche héritière est assassinée lors d'une croisière sur le Nil. Hercule Poirot est à bord.", "marc", false],
            ["ackroyd", "Le Meurtre de Roger Ackroyd", "christie", "Policier", 1926, 312, "Le Livre de Poche", "pocket", "Dans un paisible village anglais, un notable est poignardé. Le dénouement a fait scandale à sa parution.", "marc", false],
            ["notredame", "Notre-Dame de Paris", "hugo", "Roman", 1831, 940, "Folio", "pocket", "Autour de la cathédrale, le destin tragique d'Esmeralda, de Quasimodo et de l'archidiacre Frollo.", "admin", false],
            ["hobbit", "Le Hobbit", "tolkien", "Fantasy", 1937, 400, "Le Livre de Poche", "pocket", "Bilbon Sacquet, hobbit casanier, est entraîné par Gandalf et treize nains dans la reconquête d'un trésor gardé par un dragon.", "admin", false],
            ["messie", "Le Messie de Dune", "herbert", "Science-Fiction", 1969, 336, "Pocket", "pocket", "Douze ans après sa victoire, Paul Atréides règne sur un empire que son propre culte menace de consumer.", "elise", false],
            ["1q84", "1Q84", "murakami", "Roman", 2009, 560, "10/18", "paperback", "Tokyo, 1984. Aomamé et Tengo glissent dans un monde parallèle éclairé par deux lunes.", "elise", false],
        ] as const
    ).map(
        (
            [key, title, author, category, publishedYear, pageCount, publisher, format, summary, creator, untouched],
            i,
        ): BookSeed => ({
            key,
            title,
            author,
            category,
            isbn13: fakeIsbn13(i + 1),
            pageCount,
            publishedYear,
            language: "fr",
            publisher,
            format,
            summary,
            cover: false,
            coverUrl: placeholderCover(key),
            isImported: false,
            creator,
            untouched,
        }),
    ),

    // --- Cas limite responsive : titre, éditeur et résumé très longs --------
    {
        key: "longtitle",
        title: "Chroniques crépusculaires d'une bibliothécaire insomniaque qui archivait les rêves oubliés des lecteurs de passage entre deux averses sur les quais de la Seine, tome premier : l'encre et la nuit",
        author: "longname",
        category: "Littérature de l'imaginaire, récits d'anticipation et autres contrées oniriques",
        isbn13: fakeIsbn13(999),
        pageCount: 2468,
        publishedYear: 2024,
        language: "fr",
        publisher:
            "Éditions des Veilleurs Nocturnes et des Bibliothèques Imaginaires Réunies",
        format: "hardcover",
        summary: [
            "Chaque nuit, lorsque la bibliothèque municipale ferme ses portes, Clémence reste à l'intérieur. Officiellement pour inventorier les retours ; en réalité pour recueillir ce que les lecteurs abandonnent entre les pages : des tickets, des fleurs séchées, des listes de courses, et parfois des rêves entiers, pliés en quatre, que personne n'est jamais revenu chercher.",
            "Au fil des saisons, elle constitue un fonds clandestin où chaque rêve est classé, coté et relié. Mais lorsqu'un lecteur se présente au guichet pour réclamer le sien, l'ordre patient de ses rayonnages vacille : que se passe-t-il quand on rend à quelqu'un ce qu'il a oublié avoir perdu ?",
            "Premier tome d'une saga en sept volumes, ce roman-fleuve entremêle journal de bord, fiches de catalogage, correspondances et fragments oniriques. Une déclaration d'amour aux bibliothèques, aux lecteurs anonymes et à toutes les histoires qui continuent de vivre une fois le livre refermé.",
            "Édition augmentée d'un index des rêves, d'une cartographie des quais et de soixante pages de notes de l'autrice.",
        ].join("\n\n"),
        cover: false,
        coverUrl: placeholderCover("longtitle"),
        isImported: false,
        creator: "insomniaque",
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
    // catégorie sans aucun livre (filtre vide)
    "Poésie",
    // cas limite responsive : nom de catégorie long (max 100)
    "Littérature de l'imaginaire, récits d'anticipation et autres contrées oniriques",
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
    // Insomniaque : contenus longs, trois favoris ordonnés
    {
        user: "insomniaque",
        book: "longtitle",
        status: ReadingStatus.READ,
        startedAt: "2026-04-01",
        finishedAt: "2026-07-30",
        isPublic: true,
        isFavorite: true,
        favoriteRank: 1,
    },
    {
        user: "insomniaque",
        book: "montecristo",
        status: ReadingStatus.READ,
        startedAt: "2026-02-01",
        finishedAt: "2026-03-28",
        isPublic: true,
        isFavorite: true,
        favoriteRank: 2,
    },
    {
        user: "insomniaque",
        book: "mortimer",
        status: ReadingStatus.READ,
        startedAt: "2026-08-01",
        finishedAt: "2026-08-09",
        isPublic: true,
        isFavorite: true,
        favoriteRank: 3,
    },
    {
        user: "insomniaque",
        book: "deuxiemesexe",
        status: ReadingStatus.READING,
        startedAt: "2026-09-01",
        isPublic: true,
    },
    {
        user: "insomniaque",
        book: "sisyphe",
        status: ReadingStatus.PAUSED,
        startedAt: "2026-06-15",
        isPublic: true,
    },
    {
        user: "insomniaque",
        book: "import_cat_autre",
        status: ReadingStatus.READ,
        startedAt: "2026-05-02",
        finishedAt: "2026-05-04",
        isPublic: true,
    },
    // Gaspard (Google) : bibliothèque entièrement privée
    {
        user: "gaspard",
        book: "fondation",
        status: ReadingStatus.READING,
        startedAt: "2026-08-20",
        isPublic: false,
    },
    {
        user: "gaspard",
        book: "hobbit",
        status: ReadingStatus.READ,
        startedAt: "2026-07-01",
        finishedAt: "2026-07-12",
        isPublic: false,
        isFavorite: true,
        favoriteRank: 1,
    },
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
            "La pierre angulaire de la fantasy. Tolkien ne raconte pas seulement une quête, il fait exister un monde entier - ses langues, ses peuples, sa géographie, son histoire profonde. Le souffle épique côtoie des moments d'une grande tendresse. Exigeant, parfois lent, mais d'une richesse inépuisable.",
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
    // Cas limites : critique fleuve, note minimale, note seule
    {
        user: "insomniaque",
        book: "montecristo",
        rating: 5,
        text: [
            "Il m'a fallu près de deux mois pour venir à bout de ces mille cinq cents pages, et je ne regrette pas une seule minute passée au château d'If ou dans les salons parisiens. Dumas a ce talent rare de rendre chaque chapitre indispensable tout en donnant l'impression d'improviser au fil de la plume.",
            "La première partie, celle de l'emprisonnement d'Edmond Dantès, est un sommet. La rencontre avec l'abbé Faria, l'apprentissage des langues, des sciences et de la patience, puis l'évasion dans le linceul : tout y est haletant, et pourtant d'une grande profondeur. On assiste à la mort d'un homme et à la naissance d'un autre, plus froid, plus lucide, plus terrible.",
            "Vient ensuite la longue mécanique de la vengeance. Certains lecteurs la trouvent interminable ; je l'ai savourée comme une partie d'échecs dont on connaîtrait l'issue sans deviner les coups. Fernand, Danglars, Villefort : chacun tombe par où il a péché, et Monte-Cristo ne fait souvent que tirer sur le fil que leurs propres fautes ont tissé.",
            "Ce qui m'a le plus frappée, c'est la façon dont le roman interroge la légitimité de cette justice privée. Plus le comte triomphe, plus il doute. La mort du petit Édouard est un point de bascule bouleversant : le justicier découvre qu'il n'est pas la Providence, et que la vengeance a un prix qu'on ne choisit pas de payer.",
            "Quelques bémols tout de même : certains personnages secondaires restent des silhouettes, les coïncidences s'accumulent parfois un peu trop commodément, et les dialogues ont les défauts de leurs qualités feuilletonesques. Mais qu'importe : « Attendre et espérer », la dernière phrase, résonne longtemps après avoir refermé le livre. Un monument à lire au moins une fois, idéalement lors d'un long hiver.",
        ].join("\n\n"),
    },
    {
        user: "insomniaque",
        book: "import_cat_autre",
        rating: 1,
        text: "Traduction introuvable, mise en page illisible, et une fin qui n'en est pas une. Je ne le recommande pas.",
    },
    { user: "insomniaque", book: "mortimer", rating: 4 },
    { user: "marc", book: "longtitle", rating: 3, text: "Le titre est plus long que certains chapitres, mais l'idée des rêves oubliés est charmante." },
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

// Graphe d'abonnements (follower → following). Ni auto-suivi, ni doublon
// (contrainte d'unicité côté entité). Le doyen « power » est la figure la plus
// suivie ; « nora » (nouvelle venue) suit quelques actifs sans être suivie ;
// les figurants gonflent les compteurs d'abonnés des profils phares.
type FollowSeed = { follower: string; following: string };

const followsData: FollowSeed[] = [
    // Utilisateurs nommés
    { follower: "elise", following: "power" },
    { follower: "elise", following: "admin" },
    { follower: "elise", following: "marc" },
    { follower: "admin", following: "elise" },
    { follower: "admin", following: "power" },
    { follower: "marc", following: "elise" },
    { follower: "marc", following: "power" },
    { follower: "nora", following: "power" },
    { follower: "nora", following: "elise" },
    { follower: "nora", following: "admin" },
    // Le doyen n'est pas complètement à part : il suit deux profils actifs
    { follower: "power", following: "elise" },
    { follower: "power", following: "admin" },
    // Figurants → profils phares (compteurs d'abonnés crédibles)
    { follower: "filler1", following: "power" },
    { follower: "filler1", following: "elise" },
    { follower: "filler2", following: "power" },
    { follower: "filler2", following: "elise" },
    { follower: "filler3", following: "power" },
    { follower: "filler3", following: "admin" },
    { follower: "filler4", following: "power" },
    { follower: "filler5", following: "power" },
    { follower: "filler6", following: "power" },
    { follower: "filler6", following: "marc" },
    { follower: "filler7", following: "power" },
    { follower: "filler7", following: "marc" },
    { follower: "filler8", following: "elise" },
    { follower: "filler9", following: "elise" },
    { follower: "filler10", following: "admin" },
    { follower: "filler11", following: "power" },
    { follower: "filler12", following: "power" },
    // Nouveaux profils
    { follower: "insomniaque", following: "elise" },
    { follower: "insomniaque", following: "power" },
    { follower: "elise", following: "insomniaque" },
    { follower: "filler5", following: "insomniaque" },
    { follower: "gaspard", following: "power" },
];

// Commentaires (liste plate) accrochés à des critiques existantes, référencées
// par la clé `user|book` de `reviewsByKey`. Les commentateurs sont en général
// différents de l'auteur de la critique — mais l'auteur peut répondre.
type CommentSeed = { review: string; user: string; content: string };

const commentsData: CommentSeed[] = [
    // Fil sous la critique détaillée de 1984 par Elise
    {
        review: "elise|1984",
        user: "marc",
        content:
            "Entièrement d'accord sur la novlangue — c'est la partie qui m'a le plus marqué. Le passage sur la réduction du vocabulaire donne le vertige.",
    },
    {
        review: "elise|1984",
        user: "admin",
        content:
            "Belle analyse. À rapprocher de l'appendice sur le novlangue, souvent zappé, qui prolonge exactement ton propos.",
    },
    {
        review: "elise|1984",
        user: "filler1",
        content: "Ça me donne envie de le relire, merci pour la critique.",
    },
    {
        review: "elise|1984",
        user: "elise",
        content:
            "@Archiviste bien vu pour l'appendice, je l'avais survolé la première fois. Relecture obligatoire du coup !",
    },
    // Fil sous la critique courte de 1984 par Marc
    {
        review: "marc|1984",
        user: "elise",
        content:
            "Le ventre mou du milieu, je l'ai ressenti aussi — mais je crois que cette lenteur sert la sensation d'enfermement.",
    },
    {
        review: "marc|1984",
        user: "marc",
        content:
            "Pas faux, vu comme ça la longueur devient un parti pris plutôt qu'un défaut.",
    },
    // Fil sous la critique de Dune par Elise
    {
        review: "elise|dune",
        user: "filler2",
        content:
            "Les longueurs contemplatives, c'est justement ce que je préfère ! Chacun son Arrakis.",
    },
    {
        review: "elise|dune",
        user: "marc",
        content:
            "Le glossaire à la fin m'a sauvé, sinon je me serais perdu dans les maisons et l'épice.",
    },
    // Fil sous une critique du doyen (Dune)
    {
        review: "power|dune",
        user: "elise",
        content:
            "« chaque relecture en révèle une strate nouvelle » — c'est exactement ça. On n'y lit pas la même chose à 20 et à 40 ans.",
    },
    {
        review: "power|dune",
        user: "admin",
        content: "Une référence pour la fiche du livre, merci pour la profondeur.",
    },
    // Fil sous une critique figurante du livre populaire
    {
        review: "filler3|1984",
        user: "power",
        content:
            "Critique honnête et bien tournée. J'ai voté utile — continue à partager tes lectures.",
    },
    {
        review: "filler3|1984",
        user: "marc",
        content: "D'accord avec le doyen, point de vue rafraîchissant.",
    },
    // Cas limites responsive sous la critique fleuve de Monte-Cristo
    {
        review: "insomniaque|montecristo",
        user: "elise",
        content:
            "Ta critique est presque aussi longue que le roman, et je l'ai lue d'une traite. La partie sur la mort d'Édouard m'a convaincue de le relire cet hiver.",
    },
    {
        review: "insomniaque|montecristo",
        user: "filler4",
        content:
            "Attendreetespéreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer !!! https://fr.wikipedia.org/wiki/Le_Comte_de_Monte-Cristo#Accueil_et_post%C3%A9rit%C3%A9_de_l%27%C5%93uvre",
    },
    {
        review: "insomniaque|montecristo",
        user: "insomniaque",
        content: "Merci à vous deux !",
    },
];

// Bannières de site : une seule active à la fois (invariant du resolver) ;
// les autres couvrent chaque variante/audience pour l'onglet admin.
const bannersData: {
    title: string;
    message?: string;
    variant: BannerVariant;
    audience: BannerAudience;
    dismissible: boolean;
    actionLabel?: string;
    actionUrl?: string;
    isActive: boolean;
}[] = [
    {
        title: "Nouveau : suivez vos lecteurs préférés",
        message:
            "Abonnez-vous aux profils qui vous inspirent et retrouvez leurs dernières lectures dans votre fil d'activité.",
        variant: BannerVariant.INFO,
        audience: BannerAudience.ALL,
        dismissible: true,
        actionLabel: "Découvrir le catalogue",
        actionUrl: "/books",
        isActive: true,
    },
    {
        title: "Maintenance programmée dimanche de 2h à 4h",
        message:
            "Le site sera ponctuellement indisponible pendant la mise à jour de la base de données. Vos bibliothèques ne seront pas affectées.",
        variant: BannerVariant.WARNING,
        audience: BannerAudience.AUTHENTICATED,
        dismissible: false,
        isActive: false,
    },
    {
        title: "Merci ! La Nuit d'Encre a franchi le cap des 1 000 critiques",
        variant: BannerVariant.SUCCESS,
        audience: BannerAudience.ALL,
        dismissible: true,
        actionLabel: "Lire le billet",
        actionUrl: "https://example.org/blog/1000-critiques",
        isActive: false,
    },
    {
        // sans message : titre seul
        title: "Incident en cours sur l'import Google Books",
        variant: BannerVariant.ERROR,
        audience: BannerAudience.ALL,
        dismissible: false,
        isActive: false,
    },
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
            "user_follow",
            "book_review_comment",
            "book_review_vote",
            "book_recommendation",
            "book_review",
            "user_book",
            "book",
            "author",
            "category",
            "site_banner",
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
        const user = u.googleId
            ? User.create({
                  email: u.email,
                  googleId: u.googleId,
                  hashedPassword: null,
                  userName: u.userName,
                  role: u.role,
                  level: 1,
                  xp: 0,
              })
            : await register(u.email, PASSWORD, u.userName, u.role);
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
            coverUrl: b.coverUrl ?? (b.cover ? coverFor(b.isbn13) : undefined),
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
    //   2. Un lecteur « doyen » poussé au moins au niveau maximum des titres
    //      (10) ; l'XP n'étant pas plafonné, son catalogue le fait dépasser.
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

    // Le doyen a lu, critiqué (en détail) et recommandé l'ensemble du catalogue,
    // hormis les livres `untouched` qui doivent rester sans critique.
    for (const b of booksData.filter((b) => !b.untouched)) {
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

    // --- Abonnements (follows) ----------------------------------------------
    // Aucun XP associé : purs inserts relationnels. On écarte l'auto-suivi et
    // les doublons pour respecter la contrainte d'unicité de l'entité.
    const seenFollows = new Set<string>();
    let followCount = 0;
    for (const f of followsData) {
        if (f.follower === f.following) continue;
        const pairKey = `${f.follower}|${f.following}`;
        if (seenFollows.has(pairKey)) continue;
        seenFollows.add(pairKey);

        const follow = UserFollow.create({
            follower: usersByKey.get(f.follower)!,
            following: usersByKey.get(f.following)!,
        });
        await follow.save();
        followCount++;
    }
    console.log(`🔗 ${followCount} abonnements créés`);

    // --- Commentaires de critiques ------------------------------------------
    // Liste plate, aucun XP associé. Accrochés aux critiques via `reviewsByKey`.
    let commentCount = 0;
    for (const c of commentsData) {
        const review = reviewsByKey.get(c.review)!;
        const comment = BookReviewComment.create({
            content: c.content,
            user: usersByKey.get(c.user)!,
            review,
        });
        await comment.save();
        commentCount++;
    }
    console.log(`💬 ${commentCount} commentaires de critiques créés`);

    // --- Bannières de site ---------------------------------------------------
    for (const b of bannersData) {
        await SiteBanner.create({
            ...b,
            message: b.message ?? null,
            actionLabel: b.actionLabel ?? null,
            actionUrl: b.actionUrl ?? null,
            createdBy: admin,
        }).save();
    }
    console.log(`📢 ${bannersData.length} bannières créées (1 active)`);

    // --- Compte supprimé (RGPD) ----------------------------------------------
    // Le compte contribue normalement puis est effacé via le vrai service :
    // ses critiques, recommandation, commentaire, livre et auteur restent en
    // base avec un userId NULL (« Lecteur supprimé » côté front).
    const departed = await register(
        "parti@nuitdencre.test",
        PASSWORD,
        "LecteurParti",
        Roles.User,
    );
    const calvino = await Author.create({
        firstname: "Italo",
        lastname: "Calvino",
        birthDate: "1923-10-15",
        nationality: "it",
        biography:
            "Écrivain italien, conteur des Villes invisibles et architecte de récits combinatoires.",
        wikipediaUrl: "https://fr.wikipedia.org/wiki/Italo_Calvino",
        user: departed,
    }).save();
    const voyageur = await Book.create({
        title: "Si par une nuit d'hiver un voyageur",
        summary:
            "Un lecteur commence un roman, puis un autre, puis un autre : dix débuts de livres enchâssés dans une enquête sur l'acte même de lire.",
        author: calvino,
        category: categoriesByName.get("Roman")!,
        isbn13: fakeIsbn13(998),
        pageCount: 288,
        publishedYear: 1979,
        language: "fr",
        publisher: "Points",
        format: "pocket",
        coverUrl: placeholderCover("voyageur"),
        isImported: false,
        user: departed,
    }).save();
    await UserBook.create({
        user: departed,
        book: voyageur,
        status: ReadingStatus.READ,
        isPublic: true,
    }).save();
    const departedReview = await BookReview.create({
        rating: 4,
        reviewText:
            "Un vertige de lecteur : on se fait piéger à chaque chapitre, et on en redemande.",
        user: departed,
        book: voyageur,
    }).save();
    await BookReview.create({
        rating: 2,
        reviewText: "Trop long pour moi, j'ai décroché à la moitié.",
        user: departed,
        book: booksByKey.get("dune")!,
    }).save();
    await BookRecommendation.create({
        user: departed,
        book: booksByKey.get("dune")!,
    }).save();
    await BookReviewComment.create({
        content:
            "Je découvre ta critique trop tard, mais elle m'a donné envie de m'y remettre.",
        user: departed,
        review: reviewsByKey.get("elise|dune")!,
    }).save();
    await BookReviewComment.create({
        content: "Ravie qu'il t'ait plu autant qu'à moi !",
        user: usersByKey.get("elise")!,
        review: departedReview,
    }).save();
    await BookReviewVote.create({
        isHelpful: true,
        user: departed,
        review: reviewsByKey.get("elise|1984")!,
    }).save();
    await BookReviewVote.create({
        isHelpful: true,
        user: usersByKey.get("marc")!,
        review: departedReview,
    }).save();
    await UserFollow.create({
        follower: departed,
        following: usersByKey.get("elise")!,
    }).save();
    await eraseUserAccount(departed.id);
    console.log(
        "🕳️  Compte « LecteurParti » effacé (critiques, livre, auteur et commentaire anonymisés)",
    );

    // --- Admin .env ----------------------------------------------------------
    // Le TRUNCATE a supprimé l'admin créé au boot : on le restaure.
    await createAdmin();

    console.log("\n✅ Seed terminé.");
    console.log("   Comptes de test (mot de passe commun) :");
    for (const u of usersData) {
        console.log(
            `   • ${u.email}  (${u.role}${u.googleId ? ", compte Google, connexion impossible en local" : ""})`,
        );
    }
    console.log(
        `   • doyen@nuitdencre.test  (user, niveau ${usersByKey.get("power")!.level}, au-delà du niveau max affiché)`,
    );
    console.log(
        `   • lecteur01..${String(FILLER_REVIEWERS).padStart(2, "0")}@nuitdencre.test  (figurants, critiques de « ${popularTitle} »)`,
    );
    console.log(
        process.env.SEED_PASSWORD
            ? "   Mot de passe : valeur de SEED_PASSWORD"
            : `   Mot de passe : ${PASSWORD}`,
    );

    await dataSource.destroy();
}

seed().catch(async (error) => {
    console.error("🚨 Échec du seed :", error);
    if (dataSource.isInitialized) await dataSource.destroy();
    process.exit(1);
});
