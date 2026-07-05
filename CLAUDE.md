# Nuit d'Encre

Plateforme sociale de bibliothèque en ligne (SPA + API GraphQL) permettant aux utilisateurs de gérer leurs lectures, découvrir des livres, écrire des critiques, recommander des ouvrages et progresser via un système de gamification (XP, niveaux, titres).

## Commands

### Développement (depuis la racine)

```bash
docker compose up --build   # Démarre tous les services (frontend, backend, BDD)
docker compose up           # Démarre sans rebuild
docker compose down         # Arrête les services
```

### Frontend (`app/frontend/`)

```bash
pnpm dev       # Dev server sur le port 5173
pnpm build     # Build TypeScript + Vite
pnpm lint      # ESLint
pnpm preview   # Prévisualisation du build
```

### Backend (`app/backend/`)

```bash
pnpm start          # Dev server avec ts-node-dev (hot reload)
pnpm build          # Compile TypeScript → dist/
pnpm start:prod     # Démarre le serveur compilé
pnpm seed:books     # Seed de données livres
```

## Architecture

```
Nuit-d-Encre/
├── app/
│   ├── frontend/                         # React 19 + Vite SPA
│   │   └── src/
│   │       ├── App.tsx                   # Layout racine (sidebar + contenu + toasts)
│   │       ├── main.tsx                  # Point d'entrée (StrictMode, HelmetProvider, Apollo, Auth)
│   │       ├── components/
│   │       │   ├── sections/             # Composants fonctionnels par domaine
│   │       │   │   ├── book/             # Cartes livre, formulaires, critiques, recommandations
│   │       │   │   ├── author/           # Cartes auteur, formulaires
│   │       │   │   ├── library/          # Bibliothèque utilisateur, favoris (favoriteBook/)
│   │       │   │   ├── profile/          # Page profil : hero, stats, progression, favoris, édition (editProfile/, hero/)
│   │       │   │   ├── admin/            # Panel admin : onglets (tabs/), banners/, categories/, reviews/, dashboard/, ui/
│   │       │   │   ├── shared/           # Primitives partagées entre pages détail (Diamond via UI, CollectionSeam, SectionHairline, FicheManagementBar, Notice)
│   │       │   │   ├── sidebar/          # Navigation latérale (collapsible, localStorage)
│   │       │   │   ├── auth/             # Formulaires connexion/inscription
│   │       │   │   └── form/             # Champs de formulaire partagés
│   │       │   ├── UI/                   # Composants UI réutilisables
│   │       │   │   ├── form/             # Inputs, selects (CVA-based)
│   │       │   │   ├── skeleton/         # Squelettes de chargement par page
│   │       │   │   ├── Button/           # Composant bouton avec variantes CVA
│   │       │   │   ├── Banner/           # Bannière contextuelle (XP, completion)
│   │       │   │   └── ErrorElement.tsx  # Composant d'erreur global (404, etc.)
│   │       │   └── hoc/                  # Higher-order components (guards de route)
│   │       │       ├── ProtectedRoute.tsx  # Requiert authentification
│   │       │       ├── PublicRoute.tsx     # Redirige si déjà connecté
│   │       │       └── AdminRoute.tsx      # Requiert rôle admin
│   │       ├── pages/                    # Composants de page liés aux routes
│   │       │   ├── books/                # Books, BookDetails, BookScribe, BookUpdate, BookPreview
│   │       │   ├── authors/              # Authors, AuthorDetails, AuthorScribe, AuthorUpdate
│   │       │   ├── Auth.tsx              # Page login/register
│   │       │   ├── UserLibrary.tsx       # Bibliothèque personnelle
│   │       │   ├── UserProfile.tsx       # Profil utilisateur (public + privé) — implémenté + câblé
│   │       │   ├── Admin.tsx             # Panel admin (7 onglets + analytics) — implémenté + câblé
│   │       │   └── TermsOfUse.tsx
│   │       ├── hooks/                    # Custom React hooks organisés par domaine
│   │       │   ├── book/                 # useBookData, useBookMutations, etc.
│   │       │   ├── author/               # useAuthorData, useAuthorMutations
│   │       │   ├── userBook/             # useUserBooksData, useUserBookMutations
│   │       │   ├── category/             # useCategoryData
│   │       │   ├── auth/                 # useAuthContext
│   │       │   ├── responsive/           # useMediaQuery, useScreenDetector
│   │       │   ├── storage/              # useLocalStorage
│   │       │   ├── toast/                # useToast
│   │       │   └── search/               # useDebounce
│   │       ├── graphql/                  # Définitions Apollo (queries & mutations)
│   │       │   ├── book/                 # book.ts, book-search.ts, book-review.ts, book-review-vote.ts, book-recommendation.ts
│   │       │   ├── author/
│   │       │   ├── user/                 # auth.ts (WHOAMI, LOGIN, REGISTER, LOGOUT), userBook.ts, profile.ts
│   │       │   ├── category/
│   │       │   ├── admin/                # stats, activité, listes paginées, mutations de suppression
│   │       │   └── banner/               # bannières de site (CRUD admin + bannière active publique)
│   │       ├── contexts/
│   │       │   ├── AuthContext.ts        # Type AuthContextType
│   │       │   └── AuthContextProvider.tsx  # Provider avec query WHOAMI + mutation LOGOUT
│   │       ├── config/
│   │       │   ├── client.tsx            # Apollo Client (cache-and-network hybride, credentials: include)
│   │       │   ├── config.ts             # Endpoint GraphQL (/api)
│   │       │   └── router.tsx            # React Router v7 avec lazy loading + guards
│   │       ├── constants/
│   │       │   └── bookStatus.ts         # Mapping statuts de lecture
│   │       ├── types/
│   │       │   └── types.ts              # Types TypeScript partagés frontend (~690 lignes)
│   │       ├── lib/
│   │       │   ├── utils.ts              # cn(), slugify(), hasIncompleteBookInfo(), hasIncompleteInfo(), getRatingClasses()
│   │       │   └── filterMaps.ts         # Mappings format/langue/statut pour filtres
│   │       ├── styles/
│   │       │   ├── index.css             # Imports Tailwind + CSS global
│   │       │   ├── theme.css             # Variables CSS (design tokens)
│   │       │   └── loader.css            # Styles d'animation
│   │       └── data/                     # Données statiques
│   │
│   └── backend/                          # Apollo Server 4 + TypeGraphQL + TypeORM
│       └── src/
│           ├── server.ts                 # Initialisation (BDD → admin → titres → schema → serveur)
│           ├── types/
│           │   └── types.ts              # Enums et types partagés backend (UserRole, UserActionType, Context)
│           ├── database/
│           │   ├── config/datasource.ts  # Configuration TypeORM DataSource (PostgreSQL)
│           │   ├── entities/             # Entités TypeORM + TypeGraphQL (11 entités)
│           │   │   ├── user/             # User, UserBook, UserActions
│           │   │   ├── book/             # Book, BookReview, BookReviewVote, BookRecommendation
│           │   │   ├── author/           # Author
│           │   │   ├── category/         # Category
│           │   │   ├── banner/           # SiteBanner
│           │   │   └── gamification/     # Title
│           │   └── filteredResults/      # Types TypeGraphQL pour pagination (BooksResult, etc.)
│           ├── graphql/
│           │   ├── resolvers/            # 14 resolvers TypeGraphQL
│           │   │   ├── user/             # AuthResolver, UserBooksResolver, ProfileResolver, UserActionsResolver
│           │   │   ├── book/             # BooksResolver, BookReviewsResolver, BookReviewVotesResolver, BookRecommendationsResolver, BookSearchResolver
│           │   │   ├── author/           # AuthorsResolver
│           │   │   ├── category/         # CategoryResolver
│           │   │   ├── admin/            # AdminResolver (adminStats, recentActivity, listes/suppressions)
│           │   │   ├── banner/           # SiteBannersResolver (CRUD admin + activeSiteBanner public)
│           │   │   └── gamification/     # TitleResolver
│           │   ├── inputs/               # Input types TypeGraphQL (create/, update/)
│           │   └── queries/              # Types d'entrée pour les queries de recherche
│           ├── services/                 # Logique métier
│           │   ├── auth-service.ts       # Register, login, whoami (Argon2 + JWT)
│           │   ├── grind/
│           │   │   ├── grant-xp-service.ts  # Attribution XP et calcul de niveau
│           │   │   └── user-xp-service.ts   # Mapping XP → niveau
│           │   ├── cloudinary.service.ts # Upload images (avatar, bannière, couverture)
│           │   └── books/
│           │       ├── google-books.service.ts    # Intégration API Google Books
│           │       └── open-library.service.ts    # Intégration API Open Library
│           ├── middlewares/
│           │   ├── auth-checker.ts       # AuthChecker TypeGraphQL (JWT via cookie)
│           │   └── error-handler.ts      # Classe AppError avec errorType et statusCode
│           ├── utils/
│           │   ├── author-factory.ts     # getOrCreateAuthorByFullName()
│           │   ├── authorizations.ts     # Vérifications de permissions
│           │   └── actionsXpMap.ts       # Table XP par action (BOOK_ADDED: 50, REVIEW_CREATED: 100, etc.)
│           └── scripts/
│               ├── create-admin.ts       # Seeding de l'utilisateur admin
│               └── seed-titles.ts        # Seeding des titres/badges de gamification
│
├── docs/superpowers/
│   ├── specs/                            # Design specs (sidebar, recherche hybride, bannière, admin, etc.)
│   └── plans/                            # Plans d'implémentation
├── compose.yaml                          # Docker Compose (front, back, PostgreSQL 15)
└── pnpm-workspace.yaml                   # Workspace pnpm (app/frontend, app/backend)
```

## Key Patterns

### Styling

- **Tailwind CSS 4** via PostCSS (`@tailwindcss/postcss`)
- **Variables CSS** dans `src/styles/theme.css` pour les design tokens (couleurs, espacements)
- **`cn()`** depuis `@/lib/utils` (clsx + tailwind-merge) — utilisé dans chaque composant
- **CVA (class-variance-authority)** pour les variantes de composants UI (Button, inputs)
- **4 espaces** d'indentation — configuré dans Prettier (tabWidth: 4)

### Composants

- **Organisation par domaine** : `components/sections/<domaine>/` pour les composants fonctionnels
- **UI générique** : `components/UI/` pour les composants purement visuels réutilisables
- **Skeletons dédiés** : un squelette par page (`BookDetailsSkeleton`, `AuthorDetailsSkeleton`, etc.) utilisé dans les `<Suspense>`
- **Guards HOC** : `ProtectedRoute`, `PublicRoute`, `AdminRoute` dans `components/hoc/`
- **Aria labels** : générés via `buildBookAriaLabel()` et `buildAuthorAriaLabel()` depuis `@/lib/utils`

### State Management

- **Auth globale** : React Context (`AuthContext` + `AuthProvider`) — seul état global de l'application
- **État UI local** : `useState` / `useReducer` dans les composants
- **Cache serveur** : Apollo Client en mode hybride — `cache-and-network` (watchQuery) / `cache-first` (query) par défaut ; les vues à fraîcheur critique (whoami, bannières, favoris) conservent un `fetchPolicy: "network-only"` explicite dans leur hook
- **Persistance locale** : `useLocalStorage` pour l'état de la sidebar (collapsé/déployé)
- **Pattern hooks** : la logique de fetch est encapsulée dans des custom hooks par domaine (ex : `useBookData`, `useUserBooksData`)

### Routing

- **React Router v7** avec `createBrowserRouter`
- **Lazy loading** sur toutes les pages sauf `Books` (page d'accueil) — via `lazy()` + `<Suspense>`
- **Guards de route** : wrapping HOC dans la définition de route (`<ProtectedRoute>`, `<AdminRoute>`)
- **Slugs** : les livres et auteurs utilisent `/books/:slug` et `/authors/:slug` générés via `slugify()`
- **Route catch-all** : `path: "*"` lance une `Response` 404 vers `<ErrorElement>`
- **Profil** : `/profil` (connecté, profil propre) et `/profil/:id` (public, lecture seule)
- **Livre preview** : `/books/preview/:isbn13` pour les livres importés non encore enregistrés

### API & Data Fetching

- **GraphQL via Apollo Client** (`@apollo/client`) — pas d'Axios, pas de REST
- **Endpoint unique** : `/api` proxifié vers le backend Docker (configuré dans `vite.config.ts`)
- **Credentials** : `credentials: "include"` pour les cookies HTTP-only
- **Queries** : politique hybride par défaut — `cache-and-network` (watchQuery) / `cache-first` (query) ; vues critiques (auth, bannières, favoris) avec `fetchPolicy: "network-only"` explicite
- **Mutations** : refetch manuel ou mise à jour du cache Apollo après mutation
- **FieldResolvers** backend : `averageRating`, `reviewCount`, `hasUserReviewed`, `isInLibrary` calculés côté serveur dans `BooksResolver`
- **Recherche hybride** : `BookSearchResolver` interroge la BDD + Google Books + Open Library en parallèle

### Formulaires

- **React Hook Form** (`useForm`, `register`, `handleSubmit`, `formState`) pour tous les formulaires
- **Validation** : côté frontend (règles RHF) + côté backend (`class-validator` + TypeGraphQL)
- **Champs CVA** : composants `<Input>` et `<Select>` dans `components/UI/form/` avec variantes CVA

### Authentification

- **JWT en cookie HTTP-only** — stocké côté backend, jamais exposé au JS frontend
- **`WHOAMI` query** : appelée au mount de `AuthProvider` pour hydrater le contexte utilisateur
- **`customAuthChecker`** : décoré `@Authorized()` sur les resolvers TypeGraphQL — lit le cookie JWT à chaque requête
- **Google OAuth** : `@react-oauth/google` intégré (nécessite configuration `VITE_GOOGLE_CLIENT_ID` si activé)
- **Logout** : mutation GraphQL `LOGOUT` + `setUser(null)` + `refetch()` du WHOAMI

### Gamification

- **XP par action** (défini dans `actionsXpMap.ts`) :
  - Livre ajouté : 50 XP | Auteur ajouté : 30 XP
  - Livre terminé : 70 XP | Critique rédigée : 100 XP (+50 si détaillée)
  - Livre importé : 30 XP | Complété (livre/auteur) : 50 XP
- **Niveaux** : calculés depuis le total XP via `user-xp-service.ts`
- **Titres/Badges** : seedés en BDD via `seed-titles.ts`, débloqués selon le niveau
- **Traçabilité** : entité `UserActions` — log de chaque action XP avec timestamp

## Gotchas

- **Proxy Vite → Docker** : le frontend appelle `/api` qui est proxifié vers `http://back:3310`. En dehors de Docker, ce proxy ne fonctionne pas — lancer via `docker compose up` obligatoirement.
- **fetchPolicy hybride** : l'Apollo Client utilise par défaut `cache-and-network` (watchQuery) / `cache-first` (query) pour une navigation instantanée. Les vues à fraîcheur critique conservent un `fetchPolicy: "network-only"` **explicite** au niveau du hook (whoami/`AuthContextProvider`, bannières `useSiteBanner`/`useSiteBanners`, favoris `FavoriteBookModal`). La fraîcheur post-mutation reste assurée par les `refetchQueries`.
- **Livres importés** : `isImported: true` signale un livre venant de Google Books / Open Library. `hasIncompleteBookInfo()` détecte les champs manquants (summary par défaut, pageCount = 0, catégorie "Autre", pas de couverture).
- **`slugify()`** est utilisé pour générer les URLs des livres et auteurs depuis leur titre/nom — s'assurer que les slugs sont bien formés avant navigation.
- **Package manager : pnpm uniquement** — workspace pnpm configuré dans `pnpm-workspace.yaml`.
- **Tests** — backend : suite Jest (`*.test.ts` : `auth-service`, `grind/*`, `middlewares/rate-limiter`), via `pnpm --filter backend test`. Frontend : **Vitest** (`pnpm --filter frontend test`), couverture minimale (`lib/utils.test.ts`) — pas de tests de composants. ⚠️ Le script `build` backend (`tsc`) n'a **pas d'`outDir`** et émet les `.js` dans `src/` : pour un simple contrôle de types, utiliser `pnpm --filter backend exec tsc --noEmit` (jamais `pnpm build` sur le backend).
- **Migrations TypeORM** : `datasource.ts` utilise `synchronize: false` + `migrationsRun: true` (hors prod). Les migrations sont dans `src/database/migrations/`. Le schéma initial est rejoué au boot après `docker compose down -v`. `logging: true` est actif en permanence.
- **Identifiants UUID** : toutes les entités utilisent une PK UUID (`@PrimaryGeneratedColumn("uuid")`, `gen_random_uuid()` natif PostgreSQL 15). Le scalaire GraphQL `ID` sérialise en string ; les ids sont des `string` côté back et front. Les URLs sont `/<uuid>-<slug>` et l'id est extrait via `slug.slice(0, 36)` (un UUID contient des tirets).
- **Admin & Profil implémentés et câblés** : `pages/Admin.tsx` (7 onglets — Dashboard, Utilisateurs, Livres, Auteurs, Catégories, Critiques, Bannières — + `AnalyticsBar`) et `pages/UserProfile.tsx` (hero éditable, stats, progression, favoris, activité) sont complets côté front ET backend. Backend : `AdminResolver` (`adminStats`, `recentActivity`, listes, suppressions), mutations de suppression réparties dans les resolvers de domaine (`deleteBook`/`deleteAuthor`/`updateCategory`/`deleteCategory`), `SiteBannersResolver` (CRUD + `activeSiteBanner`). Hooks front dans `hooks/admin/`. Les stats du profil sont calculées côté front via `lib/profileActivity` (`computeStats`) à partir des `UserActions`, pas via un FieldResolver.
- **Icônes** : migration vers `react-icons` terminée — `lucide-react` a été retiré des dépendances. Pour un équivalent lucide, utiliser le set `react-icons/lu` (préfixe `Lu`). Ne pas réintroduire `lucide-react`. Pour les glyphes animés/teintés sur mesure, primitif SVG inline `@/components/UI/Icon/Icon`.
- **Rate limiting** : un middleware (`middlewares/rate-limiter.ts`) existe ; le contexte expose l'IP client (via `x-forwarded-for` derrière le proxy). Couvert par `rate-limiter.test.ts`.
- **Bonus critique détaillée** : `BookReviewsResolver` accorde `DETAILED_REVIEW_BONUS` (+50 XP) si `reviewText.length > 200` (`book-review-resolver.ts:370`).
- **Primitives partagées des pages détail** : après la refacto post-redesign (mergée), les pages livre/auteur s'appuient sur des composants mutualisés — `UI/Diamond`, `sections/shared/{CollectionSeam,SectionHairline,FicheManagementBar,Notice}` et `UI/EmptyStateCard`. Réutiliser ces primitives plutôt que recopier le markup. Les gros fichiers ont été éclatés en sous-composants frères (`profile/editProfile`, `profile/hero`, `library/favoriteBook`, `admin/{banners,categories,reviews,dashboard}`).
- **`reflect-metadata`** doit être importé avant TypeGraphQL/TypeORM dans `server.ts` — déjà en place, ne pas réorganiser les imports.
- **Decorators TypeScript** activés dans le backend (`experimentalDecorators: true`, `emitDecoratorMetadata: true`) — requis pour TypeORM et TypeGraphQL.
- **`schema.gql` auto-généré** : `emitSchemaFile: true` dans `buildSchema()` génère un fichier de schéma en développement — ne pas éditer manuellement.
- **Admin auto-créé** : `createAdmin()` est appelé au démarrage du serveur et crée l'admin si absent — configurer les variables `ADMIN_*` dans `.env`.
- **Cloudinary unsigned** : les uploads d'images frontend utilisent un preset non signé (`VITE_CLOUDINARY_UPLOAD_PRESET`) — le backend utilise les clés API pour les opérations serveur.
- **Contrainte unique** `(user, book)` sur `BookReview` — une seule critique par utilisateur par livre, géré par contrainte BDD.
- **Prettier 4 espaces** : tabWidth: 4 avec `prettier-plugin-tailwindcss` pour le tri automatique des classes Tailwind.

## Environment Variables

### Backend (`app/backend/.env`)

| Variable             | Rôle                                        |
| -------------------- | ------------------------------------------- |
| `APP_PORT`           | Port du serveur Apollo (3310)               |
| `DB_HOST`            | Hôte PostgreSQL (`db` dans Docker)          |
| `DB_PORT`            | Port PostgreSQL (5432)                      |
| `POSTGRES_DB`        | Nom de la base de données                   |
| `POSTGRES_USER`      | Utilisateur PostgreSQL                      |
| `POSTGRES_PASSWORD`  | Mot de passe PostgreSQL                     |
| `JWT_SECRET`         | Clé de signature des tokens JWT             |
| `COOKIE_SECRET`      | Clé de signature des cookies                |
| `ADMIN_EMAIL`        | Email de l'utilisateur admin initial        |
| `ADMIN_PASSWORD`     | Mot de passe de l'admin initial             |
| `ADMIN_NAME`         | Nom d'utilisateur de l'admin                |
| `ADMIN_ROLE`         | Rôle admin (`ADMIN`)                        |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary                  |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary                          |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary                   |
| `GOOGLE_CLIENT_ID` | Client ID OAuth Google (échange + audience)  |
| `GOOGLE_CLIENT_SECRET` | Client secret OAuth Google                   |

### Frontend (`app/frontend/.env`)

| Variable                       | Rôle                                        |
| ------------------------------ | ------------------------------------------- |
| `VITE_CLOUDINARY_CLOUD_NAME`   | Nom du cloud Cloudinary (uploads frontend)  |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Preset d'upload non signé Cloudinary       |
| `VITE_GOOGLE_CLIENT_ID`         | Client ID OAuth Google (public, GoogleOAuthProvider) |

## Deployment

- **Docker Compose** : stack 3 services — `front` (Node 23 Alpine, port 5173), `back` (Node 23 Alpine, port 3310), `db` (PostgreSQL 15, port 5433 exposé)
- **Réseau** : deux réseaux isolés — `frontend_network` (front ↔ back) et `backend_network` (back ↔ db)
- **Volumes** : `db_data` pour la persistance PostgreSQL ; montages de source pour le hot reload en dev
- **Health check** : la BDD doit passer `pg_isready` avant le démarrage du backend (`depends_on: condition: service_healthy`)
- **Hot reload** : frontend via Vite polling (`usePolling: true`) ; backend via `ts-node-dev`
- **Commande de démarrage** : `docker compose up --build` depuis la racine du projet

## Code Style

- **ESLint** : `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`
- **Prettier** : 4 espaces, `prettier-plugin-tailwindcss` pour le tri des classes
- **TypeScript strict** : mode strict activé sur frontend et backend, `noUnusedLocals`, `noUnusedParameters`
- **Alias** : `@/*` → `src/*` (frontend uniquement, configuré dans `vite.config.ts` et `tsconfig.json`)
- **Pas de semicolons** — à vérifier : la config Prettier du projet ne le spécifie pas explicitement, Prettier utilise ses défauts (avec semicolons)
- **Module CommonJS** côté backend, **ESM** côté frontend (`"type": "module"`)
