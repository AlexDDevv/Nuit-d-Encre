<h1 align="center">Nuit d'Encre</h1>

<p align="center">
  <em>La bibliothèque sociale des lecteurs nocturnes.</em><br>
  Gérez vos lectures, découvrez des livres, écrivez des critiques et progressez.
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white">
  <img alt="GraphQL" src="https://img.shields.io/badge/GraphQL-Apollo%204-E10098?logo=graphql&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white">
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white">
</p>

---

## Sommaire

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Démarrage rapide](#démarrage-rapide)
- [Variables d'environnement](#variables-denvironnement)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Modèle de données](#modèle-de-données)
- [API GraphQL](#api-graphql)
- [Gamification](#gamification)
- [Tests & CI](#tests--ci)
- [Déploiement](#déploiement)
- [Conventions de code](#conventions-de-code)
- [Licence](#licence)

---

## À propos

**Nuit d'Encre** est une plateforme sociale de bibliothèque en ligne : une SPA React
adossée à une API GraphQL. Chaque lecteur y tient sa bibliothèque, suit sa
progression de lecture, publie des critiques, recommande des ouvrages et gagne de
l'expérience — le tout dans une direction artistique nocturne assumée.

Le projet est un **monorepo pnpm** en deux workspaces (`app/frontend`,
`app/backend`), orchestré en développement par Docker Compose.

## Fonctionnalités

**Catalogue & découverte**

- Catalogue de livres et d'auteurs avec filtres (catégorie, format, langue, statut)
- **Recherche hybride** : la base locale, l'API Google Books et Open Library
  interrogées en parallèle, résultats fusionnés
- Import d'un livre depuis une source externe, avec page de prévisualisation
  (`/books/preview/:isbn13`) avant enregistrement
- Signalement des fiches incomplètes (résumé par défaut, pagination manquante,
  catégorie « Autre », couverture absente) pour inciter à les compléter

**Bibliothèque personnelle**

- Statuts de lecture, progression, notes et favoris
- Fiche livre enrichie côté serveur : note moyenne, nombre de critiques,
  présence en bibliothèque, critique déjà rédigée

**Social**

- Critiques de livres, commentaires et votes « utile »
- Recommandations d'ouvrages entre lecteurs
- Abonnements entre utilisateurs et **fil d'activité** (`/fil`)
- Profils publics (`/profil/:id`) et profil éditable (`/profil`) : hero, stats,
  progression, favoris, activité

**Gamification**

- XP attribuée à chaque action, calcul de niveau, titres/badges débloqués
- Traçabilité complète : chaque gain est journalisé en base (`UserActions`)

**Administration**

- Panel admin (`/admin`) : dashboard analytique, utilisateurs, livres, auteurs,
  catégories, critiques, bannières de site
- Bannières contextuelles publiées côté public

**Compte & confidentialité**

- Authentification par e-mail/mot de passe (Argon2) ou **Google OAuth**
- JWT en cookie HTTP-only, jamais exposé au JavaScript
- Réglages de confidentialité, **export RGPD** des données et effacement du compte
- Rate limiting sur les opérations sensibles

## Stack technique

|              | Technologies                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------- |
| **Frontend** | React 19, Vite 5, TypeScript, React Router 7, Apollo Client, Tailwind CSS 4, CVA, Radix UI, React Hook Form, Motion, react-icons, Sonner |
| **Backend**  | Apollo Server 4, TypeGraphQL, TypeORM, PostgreSQL 15, Argon2, JWT, class-validator, Cloudinary, DataLoader |
| **Outils**   | pnpm workspace, Docker Compose, ESLint, Prettier, Vitest (front), Jest (back), GitHub Actions |

## Démarrage rapide

### Prérequis

- **Docker** et **Docker Compose**
- **pnpm** 10.33 (via `corepack enable pnpm`) et **Node 24** si vous travaillez hors conteneur (version des images Docker et de la CI)
- Un compte **Cloudinary** (upload d'images) et, en option, des identifiants **Google OAuth**

### Installation

```bash
git clone git@github.com:AlexDDevv/Nuit-d-Encre.git
cd Nuit-d-Encre

# Fichiers d'environnement
cp app/backend/.env.sample app/backend/.env
cp app/frontend/.env.sample app/frontend/.env
# → renseigner les valeurs `change_me`

# Démarrage de la stack complète
docker compose up --build
```

| Service     | URL                                              |
| ----------- | ------------------------------------------------ |
| Frontend    | http://localhost:5173                            |
| API GraphQL | http://localhost:3310 (proxifiée sur `/api`)     |
| PostgreSQL  | `localhost:5433`                                 |

Au premier démarrage, le backend applique les migrations TypeORM, crée
l'utilisateur admin (variables `ADMIN_*`) et seed les titres de gamification.
Ces trois étapes sont idempotentes.

> [!IMPORTANT]
> Le frontend appelle `/api`, proxifié vers `http://back:3310` par Vite. **Ce
> proxy n'existe que dans le réseau Docker** : lancer `pnpm dev` seul, hors
> Compose, ne permet pas de joindre l'API. Passez toujours par
> `docker compose up`.

### Données de démonstration

```bash
pnpm --filter backend seed:books   # jeu de livres
pnpm --filter backend seed:db      # jeu de données complet
```

## Variables d'environnement

### Backend — `app/backend/.env`

| Variable                                              | Rôle                                                     |
| ----------------------------------------------------- | -------------------------------------------------------- |
| `NODE_ENV`                                            | `development` ou `production`                            |
| `APP_PORT`                                            | Port du serveur Apollo (3310)                            |
| `DB_HOST` / `DB_PORT`                                 | Hôte et port PostgreSQL (`db` / `5432` dans Docker)      |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | Connexion PostgreSQL                                     |
| `DB_MIGRATIONS_RUN`                                   | Auto-run des migrations au démarrage (défaut : `true`)   |
| `JWT_SECRET`                                          | Clé de signature des tokens JWT                          |
| `COOKIE_SECRET`                                       | Clé de signature des cookies                             |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_USERNAME` / `ADMIN_ROLE` | Admin créé au premier boot               |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Uploads d'images (signés côté serveur) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`           | OAuth Google (échange de code + audience)                |

### Frontend — `app/frontend/.env`

| Variable                | Rôle                                                        |
| ----------------------- | ----------------------------------------------------------- |
| `VITE_GOOGLE_CLIENT_ID` | Identifiant public du client OAuth Google (`GoogleOAuthProvider`) |

L'endpoint GraphQL est relatif (`/api`) : résolu par le proxy Vite en
développement, par nginx en production. Aucune clé Cloudinary n'est exposée au
navigateur — les uploads sont signés côté serveur.

## Scripts

### Racine

```bash
pnpm start          # docker compose up --build
pnpm deploy:back    # déploie le backend sur CapRover
pnpm deploy:front   # déploie le frontend sur CapRover
pnpm deploy         # les deux, dans l'ordre
```

### Frontend (`app/frontend/`)

```bash
pnpm dev            # serveur de dev Vite (port 5173)
pnpm build          # tsc -b && vite build
pnpm preview        # prévisualisation du build
pnpm lint           # ESLint (--max-warnings 0)
pnpm test           # Vitest
```

### Backend (`app/backend/`)

```bash
pnpm start                # ts-node-dev avec hot reload
pnpm start:prod           # exécute le serveur compilé
pnpm build                # tsc → dist/
pnpm lint                 # ESLint (--max-warnings 0)
pnpm test                 # Jest
pnpm migration:generate   # génère une migration TypeORM
pnpm migration:run        # applique les migrations
pnpm migration:revert     # annule la dernière migration
```

> [!TIP]
> Pour un simple contrôle de types côté backend, `pnpm --filter backend exec
> tsc --noEmit` suffit et prend ~4 s, là où `pnpm build` compile l'ensemble
> vers `dist/`.

## Architecture

```
Nuit-d-Encre/
├── app/
│   ├── frontend/                 # SPA React 19 + Vite
│   │   └── src/
│   │       ├── pages/            # Composants de page liés aux routes
│   │       ├── components/
│   │       │   ├── sections/     # Composants fonctionnels par domaine
│   │       │   │                 #   book, author, library, profile, admin,
│   │       │   │                 #   sidebar, auth, form, shared
│   │       │   ├── UI/           # Primitives réutilisables (Button, form,
│   │       │   │                 #   skeleton, loader, Banner, Diamond…)
│   │       │   └── hoc/          # Guards de route (Protected/Public/Admin)
│   │       ├── hooks/            # Custom hooks par domaine
│   │       ├── graphql/          # Queries & mutations Apollo
│   │       ├── contexts/         # AuthContext + provider
│   │       ├── config/           # Apollo Client, router, endpoint
│   │       ├── lib/              # cn(), slugify(), filterMaps, helpers
│   │       ├── types/            # Types partagés, par domaine
│   │       └── styles/           # Tailwind + design tokens CSS
│   │
│   └── backend/                  # Apollo Server 4 + TypeGraphQL + TypeORM
│       └── src/
│           ├── server.ts         # BDD → admin → titres → schéma → serveur
│           ├── database/
│           │   ├── config/       # DataSource TypeORM
│           │   ├── entities/     # 13 entités TypeORM + TypeGraphQL
│           │   └── migrations/   # Migrations versionnées
│           ├── graphql/
│           │   ├── resolvers/    # 18 resolvers, par domaine
│           │   ├── inputs/       # Input types (create/update)
│           │   └── queries/      # Types d'entrée de recherche
│           ├── services/         # auth, gamification (grind), RGPD,
│           │                     #   Cloudinary, Google Books, Open Library
│           ├── middlewares/      # authChecker, rate limiter, error handler
│           ├── utils/            # factories, autorisations, table XP
│           └── scripts/          # seeds (admin, titres, livres, base)
│
├── docs/                         # Review technique, roadmap, déploiement
├── compose.yaml                  # front + back + PostgreSQL 15
└── pnpm-workspace.yaml
```

### Choix structurants

**Une seule API, un seul endpoint.** Tout passe par GraphQL sur `/api` — pas de
REST, pas d'Axios. Le frontend n'a qu'un client Apollo, configuré avec
`credentials: "include"` pour les cookies HTTP-only.

**Cache Apollo hybride.** Par défaut `cache-and-network` (watchQuery) /
`cache-first` (query), pour une navigation instantanée. Les vues à fraîcheur
critique — `whoami`, bannières, favoris — déclarent explicitement
`fetchPolicy: "network-only"` dans leur hook. La fraîcheur post-mutation est
assurée par les `refetchQueries`.

**La logique de fetch vit dans les hooks.** Un hook par domaine
(`useBookData`, `useUserBooksData`, `useAuthorMutations`…) : les composants ne
manipulent jamais directement une query Apollo.

**Un seul état global : l'authentification.** `AuthContext` hydraté au montage
par la query `WHOAMI`. Tout le reste est de l'état local (`useState`,
`useReducer`) ou du cache serveur.

**Champs calculés côté serveur.** `averageRating`, `reviewCount`,
`hasUserReviewed`, `isInLibrary` sont des FieldResolvers — le frontend ne
recalcule rien.

**Lazy loading systématique.** Toutes les pages sauf l'accueil sont chargées à
la demande, avec un skeleton dédié par page ou un loader thématique.

**Identifiants UUID.** Toutes les entités ont une PK UUID
(`gen_random_uuid()`). Les URLs sont de la forme `/<uuid>-<slug>` et l'id est
extrait par `slug.slice(0, 36)`.

## Modèle de données

13 entités TypeORM, exposées telles quelles au schéma GraphQL via TypeGraphQL :

| Domaine          | Entités                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| **Utilisateur**  | `User`, `UserBook` (bibliothèque), `UserActions` (journal XP), `UserFollow`     |
| **Livre**        | `Book`, `BookReview`, `BookReviewComment`, `BookReviewVote`, `BookRecommendation` |
| **Référentiel**  | `Author`, `Category`                                                           |
| **Site**         | `SiteBanner`                                                                   |
| **Gamification** | `Title`                                                                        |

Contraintes notables : unicité `(user, book)` sur `BookReview` — une seule
critique par utilisateur et par livre, garantie en base ; unicité du nom complet
sur `Author`.

Le schéma est géré par **migrations** (`synchronize: false`,
`migrationsRun: true` hors production) — le schéma initial est rejoué au boot
après un `docker compose down -v`.

## API GraphQL

18 resolvers TypeGraphQL, organisés par domaine :

| Domaine          | Resolvers                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| **Utilisateur**  | `Auth`, `UserBooks`, `Profile`, `UserActions`, `Feed`, `Follow`, `Privacy`                       |
| **Livre**        | `Books`, `BookReviews`, `BookReviewComments`, `BookReviewVotes`, `BookRecommendations`, `BookSearch` |
| **Référentiel**  | `Authors`, `Category`                                                                            |
| **Transverse**   | `Admin`, `Stats`, `SiteBanners`, `Title`                                                          |

L'autorisation passe par le décorateur `@Authorized()` et le
`customAuthChecker`, qui lit le cookie JWT à chaque requête. Le fichier
`schema.gql` est **auto-généré** (`emitSchemaFile: true`) en développement — ne
pas l'éditer à la main.

## Gamification

Chaque action gratifiante crédite de l'XP (table `utils/actionsXpMap.ts`), le
niveau est dérivé du total, et les titres se débloquent par palier.

| Action                        | XP  |
| ----------------------------- | --- |
| Critique rédigée              | 100 |
| Livre terminé                 | 70  |
| Livre ajouté au catalogue      | 50  |
| Livre recommandé              | 50  |
| Fiche livre/auteur complétée  | 50  |
| Bonus critique détaillée      | +50 |
| Auteur ajouté                 | 30  |
| Livre ajouté à la bibliothèque | 30  |
| Livre importé                 | 30  |
| Vote « critique utile »       | 20  |

Le bonus de critique détaillée s'applique au-delà de 200 caractères de texte.
Chaque gain est tracé dans `UserActions` avec son horodatage.

Une action ne rapporte qu'**une seule fois par cible** : chaque gain porte une
clé stable (le livre, l'ISBN, l'auteur, ou le couple critique/votant) et une
contrainte d'unicité en base l'empêche d'être crédité deux fois. Retirer puis
remettre une recommandation ne rapporte donc rien de plus, alors que
recommander un autre livre crédite normalement.

## Tests & CI

```bash
pnpm --filter frontend test    # Vitest
pnpm --filter backend test     # Jest
```

La CI GitHub Actions (`.github/workflows/ci.yml`) s'exécute sur les pushs vers
`test` et `master`, ainsi que sur les pull requests visant ces branches, en deux
jobs parallèles sous Node 24 (même version que les images Docker) :

- **Frontend** — lint (ESLint), tests (Vitest), build (`tsc -b` + Vite)
- **Backend** — lint (ESLint), typecheck (`tsc --noEmit`), tests (Jest)

Les étapes sont ordonnées de la moins coûteuse à la plus coûteuse pour échouer
au plus tôt, le lint est strict (`--max-warnings 0` : un avertissement fait
échouer la CI) et chaque job a un `timeout-minutes`. Pas de hooks git locaux
(husky) : la CI fait foi. La branche `master` est protégée par un ruleset —
force push et suppression interdits, les deux checks doivent être verts. Comme
un check est attaché à un commit, le flux est : pousser sur `test`, attendre la
CI verte, puis pousser le **même** commit sur `master`.

Les tests visent le sensible plutôt que la couverture exhaustive.

**Backend (Jest)** — authentification (connexion, session JWT, changement de mot
de passe, OAuth Google), contrôle d'accès (`auth-checker`, propriétaire/admin),
gamification (attribution d'XP et déduplication par cible), RGPD (export et
effacement de compte), rate limiter, et les mutations sensibles des resolvers
(bibliothèque, critiques, votes, recommandations, commentaires, favoris,
abonnements). Les accès TypeORM sont simulés : pas de base de données requise.

**Frontend (Vitest)** — logique pure uniquement : agrégation et libellés du
journal d'activité, liens du fil, mappings de filtres envoyés à l'API, règles de
robustesse des mots de passe (miroir du backend) et helpers `lib/`. Pas de tests
de composants : il faudrait jsdom et Testing Library pour peu de valeur.

## Déploiement

Trois apps **CapRover** : `db` (PostgreSQL one-click), `back` (Node),
`front` (nginx servant le SPA et proxifiant `/api` vers le backend sur le réseau
interne — même origine, cookie `SameSite=Strict` préservé). Aucun secret dans le
repo : les valeurs sensibles sont saisies dans le dashboard CapRover.

```bash
pnpm deploy          # back puis front, depuis la branche test
```

Procédure complète, matrice des variables dev/prod et installation du serveur :
[`docs/deployment-caprover.md`](docs/deployment-caprover.md) et
[`docs/caprover-setup.md`](docs/caprover-setup.md).

## Conventions de code

- **Indentation 4 espaces**, Prettier avec `prettier-plugin-tailwindcss` (tri
  automatique des classes)
- **TypeScript strict** sur les deux workspaces, `noUnusedLocals` et
  `noUnusedParameters` actifs
- **Alias `@/*` → `src/*`** côté frontend
- **Pas de types inline** — les types, props incluses, vivent dans
  `src/types/<domaine>.ts`
- **Composants** : organisation par domaine dans `components/sections/`, UI
  générique dans `components/UI/` ; réutiliser les primitives partagées plutôt
  que recopier le markup
- **Icônes** : `react-icons` exclusivement (set `react-icons/lu` pour les
  équivalents Lucide) ; primitif SVG inline `UI/Icon` pour les glyphes sur mesure
- **Formulaires** : React Hook Form, validés côté client (règles RHF) et côté
  serveur (`class-validator`)
- **pnpm uniquement** — le workspace est déclaré dans `pnpm-workspace.yaml`

Le fichier [`CLAUDE.md`](CLAUDE.md) détaille l'architecture, les patterns et les
pièges du projet.

## Licence

Aucune licence open source. Le code est publié à titre de démonstration :
tous droits réservés, la réutilisation, la modification et la redistribution ne
sont pas autorisées sans accord préalable.
