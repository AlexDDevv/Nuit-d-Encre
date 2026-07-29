# Review technique & roadmap — Nuit d'Encre

> Revue complète du projet réalisée le 2026-05-31.
> Objectif : faire l'état des lieux (qualité, performance, sécurité, complétude
> fonctionnelle, DevOps) et fixer une direction produit.

## Direction produit décidée

L'ordre de travail validé (2026-05-31) était le suivant :

1. **Terminer les pages `Admin` et `Profil utilisateur`** (design réalisé avec Claude Design).
2. **Traiter les améliorations** identifiées dans cette review (qualité, perf, robustesse, infra).
3. **Focus à fond sur l'aspect social** (follow, fil d'activité, notifications, commentaires…).

> **Re-priorisation 2026-06-26.** Points 1 et 2 faits (Phases 0/1/2). **Contexte cible
> clarifié** : le projet est avant tout une **vitrine d'embauche** qui doit aussi paraître
> **sérieuse** (données sécurisées, vrai aspect social). Décision :
>
> **(1) Sprint Social MVP d'abord** — c'est le différenciateur et ce que le pitch
> (« plateforme sociale ») promet. Constat déclencheur : *les profils publics existent mais
> sont inaccessibles* (uniquement via URL + UUID connus). Périmètre validé :
> - **A — Profils accessibles** : noms d'utilisateurs cliquables partout (auteur de critique
>   en premier). **Pas d'annuaire ni de recherche d'utilisateurs** — la découverte de lecteurs
>   passe par leurs critiques et par le flux global de l'état vide du fil.
> - **B — Follow** : entité `UserFollow`, follow/unfollow, compteurs + listes followers/following.
> - **C — Fil d'activité** : flux des actions des personnes suivies, **par-dessus `UserActions`**
>   (déjà loggé → fort impact, faible coût).
> - **Différé** : commentaires sur critiques, notifications in-app, modération.
>
> **(2) Phase 4 — Production-grade + déploiement** : le vrai gate avant lancement réel.
>
> **(3) Reliquats Phase 2** (remplissage peu coûteux) : leaderboard, logger structuré, retrait `joi`.

Le détail et le séquencement précis sont en fin de document ([Roadmap](#roadmap)).

---

## Verdict global

Le projet est un **MVP techniquement solide mais incomplet**. L'architecture est
propre, cohérente et bien documentée (le `CLAUDE.md` est excellent). Le cœur métier
— gestion de livres/auteurs, bibliothèque perso, critiques, votes, recherche
hybride, gamification — est de qualité quasi-production.

**Mais** : zéro test, des trous fonctionnels béants (pages Admin et Profil vides),
un aspect « social » quasi inexistant, et plusieurs problèmes de
performance/robustesse qui bloqueraient une mise en production sérieuse.

**Note de maturité : ~5,5/10.** Le squelette est sain ; il manque la chair
(social/admin) et le filet de sécurité (tests/CI/migrations).

> **Actualisation 2026-06-19** : ce verdict date du 2026-05-31. Depuis, le **filet de
> sécurité** (Phase 0 : migrations, tests, CI, rate limiting) et les **pages Admin +
> Profil** (Phase 1) sont **faits**. Restent surtout l'**aspect social** (~2/10),
> les **améliorations perf** (Phase 2) et le **production-grade** (Phase 4).
> Maturité réévaluée : **~7/10**.

> **Actualisation 2026-06-26** : la **Phase 2 (améliorations qualité/perf) est quasi
> terminée** — DataLoader (3 lots), fetchPolicy Apollo hybride, `author.books` borné,
> memoization `React.memo`, retours de mutations typés, **Error Boundary global**,
> **barre de progression XP animée** (`ProfileProgression`), catch login corrigé,
> dégradation gracieuse des loaders. Le **reliquat Phase 0** (codes d'erreur GraphQL via
> `formatError`/`AppError`) est aussi **fait**. En parallèle, une **vague de redesign**
> (21→24 juin) a refondu les fiches livre/auteur (« atelier du scribe »), les pages auth,
> les pages d'erreur, les mentions légales, le système de boutons, les loaders, ajouté la
> page Contact et l'endpoint public `siteStats`, et nettoyé la typo Tailwind. **Restent
> intouchés** : le **leaderboard** et le **logger structuré** (fin de Phase 2), **tout
> l'aspect social** (Phase 3, toujours ~2/10) et **tout le production-grade** (Phase 4).
> Maturité réévaluée : **~7,5/10** — l'appli est saine et soignée, mais **pas
> déployable en prod** (Phase 4 = 0) et toujours pas « sociale ».

> Note méthodo : certaines affirmations ont été vérifiées dans le code. Deux
> findings initiaux étaient **faux** et ont été écartés :
> - `.env` n'est **pas** commité (seul `.env.sample` est tracké, `.gitignore` correct).
> - Le bonus « critique détaillée » **existe bien** (`book-review-resolver.ts:370`,
>   `reviewText.length > 200` → +50 XP).

---

## 1. Ce qui est très bien (à garder)

- **Architecture par domaine** cohérente, front et back. Séparation
  resolvers/services/entities propre.
- **Sécurité auth de base solide** : Argon2, JWT en cookie HttpOnly + Secure +
  SameSite Strict, requêtes paramétrées (pas d'injection SQL),
  `credentials: include`, pas de `dangerouslySetInnerHTML`. `.env` correctement
  ignoré par git.
- **Recherche hybride** (DB + Google Books + Open Library) bien pensée :
  `Promise.allSettled`, timeout 3s, dédup ISBN13, fallback gracieux. C'est la plus
  belle pièce du projet.
- **Gamification fonctionnelle** : XP par action, niveaux, 10 titres, traçabilité
  `UserActions`, bonus critique détaillée.
- **UX de chargement** : skeletons dédiés par page, toasts, accessibilité (aria)
  correcte dans l'ensemble.

---

## 2. Problèmes critiques (à traiter en priorité)

### Qualité / robustesse

> Les 5 problèmes 🔴 ci-dessous ont été **résolus en Phase 0** (2026-06-10). Conservés
> ici pour traçabilité — voir le détail dans la [Phase 0](#phase-0--filet-de-sécurité-préalable).

| Sév. | Problème | Localisation | Impact |
|------|----------|--------------|--------|
| ✅ | ~~**`synchronize: true` + aucune migration**~~ — migrations TypeORM en place | `datasource.ts` | — |
| ✅ | ~~**Zéro test**~~ — Jest (back, 18 tests) + Vitest (front, 6 tests) | back + front | — |
| ✅ | ~~**Race condition** check-then-act~~ — contrainte unique + `ON CONFLICT` | `author-factory.ts` | — |
| ✅ | ~~**Pas de transaction** dans l'attribution XP~~ — transaction atomique | `grant-xp-service.ts` | — |
| ✅ | ~~**Pas de rate limiting**~~ — limiteur mémoire sur login/register/importBook | `rate-limiter.ts` | — |

### Performance

> Les 4 problèmes ci-dessous ont été **résolus en Phase 2** (2026-06-19). Conservés pour
> traçabilité — détail dans la [Phase 2](#phase-2--améliorations-qualité--perf--engagement).

| Sév. | Problème | Localisation | Impact |
|------|----------|--------------|--------|
| ✅ | ~~**N+1 sur FieldResolvers**~~ — **DataLoader** par requête (`averageRating`, `reviewCount`, `recommendationCount`, `title`, flags user) | `dataloaders/` | — |
| ✅ | ~~**Eager loading excessif** `author.books`~~ — FieldResolver borné | `book-resolver.ts` | — |
| ✅ | ~~**`fetchPolicy: network-only` partout**~~ — cache hybride `cache-and-network`/`cache-first`, `network-only` ciblé | `config/client.tsx` | — |
| ✅ | ~~**Memoization quasi absente**~~ — `React.memo` ciblé sur les cartes de liste | front | — |

### Petites dettes immédiates

> La plupart **résolues en Phase 2** (2026-06-19), conservées pour traçabilité.

- ✅ ~~`console.log` à retirer~~ — nettoyés (Phase 0/2).
- ✅ ~~`catch` qui masque l'erreur réelle (`auth-resolver.ts`)~~ — la cause réelle de
  l'échec de login est désormais loguée.
- ✅ ~~Types `Promise<any>` dans les hooks de mutation~~ — retours typés
  (`useBookMutations`, `useAuthorMutations`, `useBookRecommendationMutations`…).
- ✅ ~~Pas d'**Error Boundary React global**~~ — `ErrorBoundary` global
  (`UI/error/ErrorBoundary.tsx`) + `ErrorScreen` partagé câblés dans `main.tsx`.
- 🟡 **`joi` est une dépendance morte** (aucun import dans `app/backend/src`) — à retirer
  (rattaché au nettoyage de dépendances en Phase 4).
- ~~**Badge « incomplet » erroné sur la page Auteurs**~~ — **corrigé le
  2026-06-04** : FieldResolver `isIncomplete: Boolean` ajouté sur `Author`
  (calculé côté serveur via `isAuthorIncomplete()`), `GET_AUTHORS` ne fetch que
  ce booléen, `Authors.tsx` l'utilise directement. L'erreur TS associée
  (`AuthorCardProps is not assignable to Author`) est résolue.
- ~~**Erreur TS préexistante** dans `ShinyButton.tsx:3`~~ — **corrigé le
  2026-06-04** : composant mort (aucun import), supprimé. `tsc -b` frontend
  passe désormais sans erreur.

---

## 3. Complétude fonctionnelle & direction produit

### Le constat clé

Le projet se présente comme une **« plateforme sociale »**, mais c'est aujourd'hui
un **gestionnaire de lecture personnel**. L'aspect social est à ~2/10 : pas de
follow, pas de fil d'activité, pas de notifications, pas de commentaires.

> **Mise à jour 2026-06-19** : ✅ **Phase 1 terminée.** Les pages Profil et Admin sont
> **implémentées ET câblées au backend** (front + back + bout en bout). Admin :
> `AdminResolver` (`adminStats`, `recentActivity`, listes, suppressions) + mutations de
> suppression dans les resolvers de domaine + `SiteBannersResolver`. Profil : stats
> calculées côté front (`lib/profileActivity`) à partir des `UserActions`. Deux chantiers
> de **refacto frontend** ont suivi (voir [Travaux post-Phase 1](#travaux-post-phase-1)).

### État des fonctionnalités

| Domaine | Score | Notes |
|---------|-------|-------|
| Core (gestion livres/auteurs) | 9/10 | Solide, prêt prod |
| Recherche & import hybride | 9/10 | Multi-source, bien conçue |
| Critiques & votes | 9/10 | Complet, contrainte unique `(user, book)` |
| Gamification | 7/10 | XP/niveaux/titres OK + **barre XP animée** + frise des titres ; manque leaderboard / défis |
| Social | 2/10 | Profil lecteur seul, zéro interaction |
| Admin | 8/10 | ✅ Front + back câblés : analytics, 7 onglets, listes paginées, suppressions, bannières |
| Notifications | 0/10 | Absent |
| Complétude UX | 9/10 | ✅ Profil & Admin complets ; vague de redesign 06/2026 (fiches, auth, erreurs, légal, boutons, loaders, Contact) ; reste surtout le social |

### Trous fonctionnels classés

- ✅ **Admin** : **terminé** (front + back). Barre analytics, 7 onglets (Dashboard,
  Utilisateurs, Livres, Auteurs, Catégories, Critiques, Bannières), tableaux paginés,
  dialogs de confirmation. Backend : `AdminResolver` (`adminStats`, `recentActivity`,
  listes, suppression de critiques), mutations `deleteBook`/`deleteAuthor`/
  `updateCategory`/`deleteCategory` dans les resolvers de domaine, `SiteBannersResolver`
  (CRUD + `activeSiteBanner`). Hooks `hooks/admin/`.
- ✅ **Profil utilisateur public** : **terminé** (front + back). `getUserProfile`,
  `getUserFavoriteBooks` (favoris ranks 1-3), `title`. Les **compteurs de stats** sont
  calculés côté front (`lib/profileActivity`, `computeStats`) à partir des `UserActions`
  — choix d'implémentation retenu plutôt qu'un FieldResolver serveur.
- 🟠 **Gamification incomplète** : ✅ la barre de progression XP animée est faite
  (`ProfileProgression` : médaillon de niveau + arc de progression + frise des titres).
  Restent le **leaderboard** et les **défis/succès**. Le leaderboard est peu coûteux et
  très engageant.
- 🟠 **Recommandation personnalisée absente** : juste un toggle « je recommande ».
  Aucun moteur « pour toi » basé sur catégories/auteurs lus.
- 🟠 **Social** : follow, fil d'activité, notifications, commentaires sur critiques,
  modération/signalement — tout est à faire.
- 🟡 **Divers** : onboarding, paramètres utilisateur (gestion avatar/bannière côté
  front alors que le backend existe), export/partage de collections.

---

## 4. DevOps & déploiement

**Non déployable en production en l'état.**

- 🔴 **Pas de CI/CD** (aucun `.github/workflows`).
- 🔴 **Dockerfiles dev-only, non multi-stage** : image lourde, code source en prod,
  commande `pnpm dev`. Pas de `compose.prod.yaml`, pas de user non-root.
- 🟠 **Aucune observabilité** : `console.log` épars, pas de logger structuré
  (Winston/Pino), pas de Sentry, `logging: true` (SQL) actif en permanence.
- 🟠 **Pas de pre-commit hooks** (Husky/lint-staged), pas de convention de commit,
  ESLint en mode « loose » (`no-unused-vars: warn`, `any` autorisé).
- 🟡 **Dépendances** : `type-graphql` en `2.0.0-rc` (release candidate), migration
  `lucide-react`→`react-icons` à terminer (état hybride), `joi` possiblement
  inutilisé.

---

## Roadmap

Ordre validé : **(1) finir Admin + Profil → (2) améliorations → (3) social**.
Le filet de sécurité minimal est intercalé en amont car il conditionne tout le reste.

### Phase 0 — Filet de sécurité (préalable)

> À faire avant ou en parallèle des pages, pour ne pas construire sur du sable.

- [x] Désactiver `synchronize`, mettre en place les **migrations TypeORM**.
- [x] **Transactions** dans `grantXpService` + corriger la race condition
      `getOrCreateAuthorByFullName`.
- [x] Setup test minimal : Vitest (front) + Jest configuré (back), 5-10 tests sur
      les services critiques (auth, XP).
- [x] **CI GitHub Actions** : lint + typecheck + tests.
- [x] Nettoyer les `console.log`, ajouter un **rate limiting** sur `login`
      (étendu à `register` et `importBook`).

> **✅ Phase 0 terminée le 2026-06-10** (branche `phase-0-safety-net`, 12 commits,
> mergée dans `develop`). Détail livré :
> - **Migrations TypeORM** : `synchronize` supprimé, migration initiale (10 entités
>   + `CREATE EXTENSION unaccent`), contrainte unique auteur via migration dédiée,
>   `migrationsRun` conditionné au non-prod (en prod : `pnpm migration:run` en étape
>   de déploiement explicite), scripts `migration:generate/run/revert`. Le
>   `CREATE EXTENSION unaccent` reste aussi au démarrage de `server.ts` en filet.
> - **Robustesse** : attribution XP enveloppée dans une transaction atomique
>   (`User` + `UserActions`) ; race condition `getOrCreateAuthorByFullName` corrigée
>   (contrainte unique `(firstname, lastname)` + insertion `ON CONFLICT DO NOTHING`
>   puis re-lecture, compatible transaction englobante).
> - **Tests** : Jest backend (18 tests : XP/niveau, transaction XP, register/login,
>   rate limiter) + Vitest frontend (6 tests : `slugify`, complétude livre). Bug de
>   `slugify` (tiret final) découvert et corrigé via les tests.
> - **CI** : GitHub Actions (`.github/workflows/ci.yml`) — lint + typecheck + tests
>   sur les deux workspaces pnpm.
> - **Sécurité** : rate limiting en mémoire (fenêtre fixe par IP) sur `login`
>   (10/5 min), `register` (5/15 min) et `importBook` (20/5 min) ; IP exposée dans le
>   contexte Apollo. Vérifié en conditions réelles (429 déclenché via curl).
> - **Nettoyage** : `console.log` résiduels retirés + 3 erreurs ESLint préexistantes
>   corrigées (bloquaient la CI).
>
> **Reste de Phase 0** : ✅ **résolu** (2026-06-19). Le `formatError` de `server.ts`
> détecte désormais `instanceof AppError` et propage `extensions.code = errorType` —
> les erreurs métier ne remontent plus systématiquement en `INTERNAL_SERVER_ERROR`.

### Phase 1 — Terminer les pages manquantes (PRIORITÉ produit) ✅ TERMINÉE (2026-06-19)

> Design réalisé avec **Claude Design** (artifacts navigateur). Les deux pages sont
> désormais **implémentées et câblées de bout en bout** (front + back + vérification).

**Profil utilisateur** (`/profil` privé, `/profil/:id` public)
- [x] Implémentation **frontend** (maquette → composants).
- [x] Stats du profil (livres ajoutés, terminés, critiques, auteurs, recommandations) —
      calculées **côté front** via `lib/profileActivity` (`computeStats`) à partir des
      `UserActions`, plutôt qu'en `FieldResolver` serveur. Backend : `getUserProfile`,
      `getUserFavoriteBooks`, `title`, favoris ranks 1-3.
- [x] Front câblé et vérifié (profil propre éditable vs public lecture seule, états
      vides, historique XP, édition profil + avatar/bannière).

**Panel Admin** (`/admin`, `AdminRoute`)
- [x] Implémentation **frontend** (barre analytics, 7 onglets, tableaux, dialogs).
- [x] Backend : `AdminResolver` (`adminStats`, `recentActivity` = recentUsers/Books/
      Reviews/Actions, query critiques), listes paginées côté front via `usePagination`,
      mutations `deleteBook`/`deleteAuthor`/`updateCategory`/`deleteCategory` (resolvers
      de domaine) + suppression de critiques, `SiteBannersResolver` (CRUD + bannière active).
- [x] Création/suppression de catégories restreintes aux admins.
- [x] Front câblé (`hooks/admin/`) et vérifié de bout en bout.

### Travaux post-Phase 1

Chantiers menés après la complétion des pages, hors séquencement initial de la roadmap.

**Bannières de site (feature ajoutée)** — entité `SiteBanner` + migration `CreateSiteBanner`,
`SiteBannersResolver` (CRUD admin + `activeSiteBanner` public avec résolution d'audience
ALL/AUTHENTICATED), onglet admin « Bannières » (éditeur + aperçu live + historique) et
affichage public. Non prévu dans la review initiale.

**Refacto frontend post-redesign** ✅ (2026-06-19, branche `refacto`, mergée) — le redesign
par maquettes avait généré beaucoup de duplication, de code mort et de très gros fichiers.
Refacto **pure** (zéro changement visible) : suppression de 12 fichiers morts, primitives
partagées entre pages détail (`UI/Diamond`, `sections/shared/{CollectionSeam,SectionHairline,
FicheManagementBar,Notice}`, `UI/EmptyStateCard`), éclatement des gros fichiers
(EditProfileModal, FavoriteBookModal, ProfileHero, BannersTab, CategoriesTab, ReviewsTab,
AdminDashboard) en sous-composants frères. Spec/plan : `docs/superpowers/{specs,plans}/
2026-06-19-refactorisation-post-redesign*`.

**Nettoyage style/typographie Tailwind** ✅ (2026-06-19) — tokens `text-xxxs`/`text-xxs`
ajoutés, toutes les tailles arbitraires (`text-[12px]`, `text-[13px]`…) ramenées sur
l'échelle standard, `leading-*` et styles inline superflus retirés (7 commits).

**Vague de redesign « atelier du scribe »** ✅ (2026-06-21 → 06-24, ~50 commits sur master)
— hors séquencement initial, refonte visuelle large et quelques features/fixes :
- **Refontes UI** : fiches livre/auteur (« atelier du scribe » + primitives partagées),
  pages auth (login/register + indicateur de robustesse + confirmation, `AuthShell`),
  pages d'erreur (`ErrorScreen`/`ErrorBoundary`, vignette/chiffre embossé/sceau),
  mentions légales (Claude Design), système de boutons (« cartouche des sceaux »,
  variants `google`/`destructiveGhost`), 4 loaders « Le battement nocturne » câblés par
  domaine, harmonisation champs/selects (`h-10`, style atelier, `SearchField` mutualisé),
  Accordion shadcn thématisé.
- **Features** : page **Contact** (`/about`), endpoint public **`siteStats`**.
- **Refactos** : `types.ts` éclaté par domaine (front **et** back), réseaux sociaux
  centralisés (`data/socials`), primitives partagées des pages document.
- **Fixes back** : ISBN-10 vide normalisé en `NULL`, id de bannière restauré après
  `remove()`, paliers de titres reliés dans l'échelle.

### Phase 2 — Améliorations (qualité / perf / engagement) ✅ QUASI TERMINÉE (2026-06-19)

- [x] **DataLoader** pour les FieldResolvers N+1 (`averageRating`, `reviewCount`,
      `recommendationCount`, `title`, + flags user `hasUserReviewed`/`hasUserRecommended`/
      `isInLibrary`) — infrastructure factory + context par requête (`dataloaders/`).
- [x] Revoir le **`fetchPolicy` Apollo** — cache hybride `cache-and-network`/`cache-first`,
      `network-only` ciblé sur les vues critiques.
- [x] Limiter l'eager loading `author.books` (FieldResolver borné).
- [x] **Memoization** ciblée côté front (`React.memo` sur les cartes de liste).
- [x] Typer les retours de mutations (suppression des `Promise<any>`).
- [x] **Error Boundary** React global.
- [x] Gamification : **barre de progression XP** animée (`ProfileProgression`).
- [x] Codes d'erreur GraphQL (reliquat Phase 0) : `formatError` propage `AppError`.
- [ ] Gamification : **leaderboard** (peu coûteux, fort engagement) — **reste à faire**.
- [ ] **Logger structuré** (Winston/Pino) + `logging` SQL conditionné à l'env — **reste à faire**.
- [ ] (Optionnel) Extraire la logique métier des forms (`ReviewForm`, `BookForm`,
      `AuthorForm`) vers des hooks — partiellement couvert par les hooks existants.

### Phase 3 — Aspect social (focus principal) ✅ SPRINT MVP LIVRÉ (2026-06-26)

> C'est ce qui transforme le « gestionnaire de lecture » en vraie plateforme sociale.
> **Périmètre MVP validé le 2026-06-26 = A + B + C** ; le reste est différé.

**Sprint Social MVP (A + B + C)** — ✅ **implémenté sur la branche `social`** (11 commits,
revue globale finale « Ready to merge: Yes »). Spec : `docs/superpowers/specs/2026-06-26-social-mvp-design.md` ;
plan : `docs/superpowers/plans/2026-06-26-social-mvp.md`.
- [x] **A — Profils accessibles** : composant `<UserLink>` (monogramme/avatar + nom →
      `/profil/:id`), câblé sur le nom du critiqueur dans `ReviewCard` et dans le fil. Pas
      d'annuaire ni de recherche d'utilisateurs — découverte via les critiques + le flux global
      de l'état vide du fil.
- [x] **B — Follow** : entité `UserFollow` + migration, `FollowResolver` (follow/unfollow
      idempotents + anti-self-follow), FieldResolvers `followerCount`/`followingCount`/
      `isFollowedByMe` batchés DataLoader, queries `followers`/`following`. UI : `FollowButton`
      + compteurs + modale de listes sur le profil.
- [x] **C — Fil d'activité** : `FeedEntry`/`FeedActor` + queries `activityFeed`
      (abonnements) et `globalActivityFeed` (repli/découverte) par-dessus `UserActions` ; page
      `/fil` (lazy, protégée) + entrée sidebar + état vide → flux global. Pagination single-page
      (fetchMore différé).
- [x] **Bonus privacy** : email passé en FieldResolver gardé (propriétaire/admin uniquement) —
      ferme la fuite via `getUserProfile`.

> **Reste avant merge** : passe de vérification manuelle Docker (boot + migration + smoke-test)
> et **refonte UI/UX des composants sociaux** (en cours côté utilisateur via Claude Design — le
> code livré est fonctionnel mais le visuel sera retravaillé). 6 findings Minor différés (voir
> `.superpowers/sdd/progress.md`).

**Différé (sprints d'engagement ultérieurs)**
- [ ] **Commentaires** sur critiques (entité `ReviewComment`) + leurs notifications.
- [ ] **Notifications** in-app (polling d'abord, WebSocket plus tard).
- [ ] **Modération / signalement** : entité `Report` + outils admin.
- [ ] Recommandations personnalisées (catégories/auteurs lus).

### Phase 4 — Production-grade (avant lancement réel) ⬅️ CHEMIN CRITIQUE VERS LA PROD

> **Rien d'entamé.** C'est désormais le **seul vrai bloqueur** d'une mise en production :
> Phases 0/1/2 faites, la Phase 3 (social) est de l'enrichissement produit, pas un
> prérequis pour déployer.

- [ ] Dockerfiles **multi-stage** + `compose.prod.yaml` + user non-root.
- [ ] **Sentry** (error tracking) + health checks propres.
- [ ] Husky + lint-staged + Commitlint (Conventional Commits).
- [ ] Renforcer ESLint (`no-console`, `no-explicit-any`, `no-floating-promises`).
- [x] ~~Terminer la migration `lucide-react` → `react-icons`~~ — **faite** (`lucide-react`
      retiré des dépendances, `react-icons` uniquement).
- [ ] Retirer la dépendance morte **`joi`** ; passer **`type-graphql`** en stable
      (toujours `2.0.0-rc.3`).
- [ ] README racine + docs d'onboarding développeur.

---

## Annexe — Fichiers clés

**Phase 1 — ✅ terminée**
- `app/frontend/src/pages/UserProfile.tsx` — implémenté + câblé
- `app/frontend/src/pages/Admin.tsx` — implémenté + câblé (7 onglets)
- `app/backend/src/graphql/resolvers/admin/admin-resolver.ts` — stats, activité, suppressions
- `app/backend/src/graphql/resolvers/banner/site-banner-resolver.ts` — bannières de site

**Points chauds (Phase 0 / 2)**
- `app/backend/src/database/config/datasource.ts` — `synchronize: true`, `logging: true`
- `app/backend/src/utils/author-factory.ts` — race condition
- `app/backend/src/services/grind/grant-xp-service.ts` — pas de transaction
- `app/backend/src/graphql/resolvers/book/book-resolver.ts` — N+1 + eager loading
- `app/frontend/src/config/client.tsx` — `fetchPolicy: network-only`

**Références produit**
- `docs/superpowers/specs/2026-04-05-admin-panel-design.md` — spec admin (non implémentée)
- `docs/superpowers/specs/` — autres specs UI/UX
