# Nuit d'Encre : contexte du projet

Document de référence sur le « pourquoi » du projet : intentions, décisions, difficultés et limites. Le code et le README décrivent le « quoi ».

## En une phrase

Une bibliothèque en ligne sociale et gamifiée : chaque lecteur y tient sa bibliothèque, écrit des critiques, recommande des livres, suit d'autres lecteurs et gagne de l'XP en enrichissant un catalogue commun.

## Déclencheur

- Goût personnel pour la lecture.
- Envie d'un projet personnel de grande taille, pensé comme un produit viable de bout en bout : infrastructure, sécurité, conformité, rétention des utilisateurs.
- C'est un projet de démonstration, pas un service destiné à un vrai public. Il est pourtant construit avec les exigences d'une mise en production (RGPD, CI, déploiement).

## Décisions produit

### La gamification sert à construire le catalogue

- Décision : l'XP récompense l'enrichissement du catalogue autant que la lecture. Ajouter un livre (50 XP), un auteur (30), importer un livre (30), compléter une fiche incomplète (50).
- Intention : pousser les utilisateurs à saisir leurs lectures en cours et passées, pour que le catalogue grandisse avec l'usage au lieu d'être rempli à la main par l'auteur du projet, ce qui aurait pris un temps considérable.
- Effet : les livres importés depuis une source externe arrivent volontairement incomplets (résumé par défaut, catégorie « Autre », 0 page). Ils sont signalés comme tels, et les compléter rapporte de l'XP.

### Un bonus pour les critiques développées

- Décision : +50 XP de bonus pour une critique de plus de 200 caractères, en plus des 100 XP de la critique (`book-review-resolver.ts`).
- Intention : encourager des critiques réfléchies et argumentées plutôt qu'un simple « bon livre ».

### L'XP ne se perd jamais

- Décision : une action annulée (retirer un livre, une recommandation, un vote) ne retire pas l'XP gagnée.
- Intention : perdre de l'XP, voire un niveau, serait frustrant et difficile à comprendre pour l'utilisateur.
- Alternative écartée : retirer l'XP à l'annulation. Pas retenue pour la raison ci-dessus.
- Coût : il faut alors empêcher de gagner de l'XP en boucle en annulant puis refaisant la même action (voir Décisions techniques).

### Effacement de compte : anonymiser plutôt que supprimer

- Décision : à la suppression d'un compte, les votes et le journal d'activité sont supprimés. Les critiques, recommandations et commentaires sont conservés sous « Lecteur supprimé ». Les livres et auteurs créés restent au catalogue.
- Intention : ne pas faire disparaître un contenu que la communauté a construit et que d'autres lecteurs ont lu, tout en respectant le droit à l'effacement.
- Contexte : chantier RGPD mené en vue de la mise en production, par exigence personnelle de conformité, même pour un projet de démonstration. Il comprend l'export des données en JSON, le consentement explicite à l'inscription et les mentions légales.

### Aucun tiers chargé sans nécessité

- Décision : les polices sont auto-hébergées au lieu d'être chargées depuis Google Fonts (`9f396c3`). Le script Google OAuth n'est chargé que sur les pages de connexion et d'inscription (`a43cf95`).
- Raison (messages de commit) : ces appels transmettaient l'adresse IP du visiteur à Google, ou pouvaient déposer des cookies, sans base légale claire. Cela contredisait la politique de confidentialité d'un site qui n'a aucun traceur par ailleurs.

### Un social volontairement limité

- Décision : suivre d'autres lecteurs, fil d'activité, commentaires sur les critiques. Pas d'annuaire ni de recherche d'utilisateurs : on découvre les autres lecteurs par leurs critiques, et le flux global s'affiche quand le fil est vide. Pas de notifications ni de modération.
- Intention : limiter le projet à un MVP complet plutôt que de pousser chaque domaine au maximum.

## Décisions techniques

### Déduplication de l'XP par cible

- Décision : chaque gain d'XP porte une clé (`xpKey`) construite à partir d'un identifiant stable (livre, ISBN, auteur, couple critique/votant). Un index unique partiel `(userId, type, xpKey)` empêche d'accorder deux fois le même gain.
- Intention : rendre sûre la règle « l'XP ne se perd jamais ».
- Détails : la clé ne dérive jamais d'une entité qu'on peut supprimer puis recréer (entrée de bibliothèque, critique, vote). En cas de requêtes concurrentes, l'index unique départage : la violation `23505` est traitée comme « déjà accordée ». L'attribution d'XP et son journal sont écrits dans la même transaction.
- Coût assumé : les actions antérieures à la migration n'ont pas de clé et peuvent rapporter une dernière fois.
- Référence : `d3aafae`, `services/grind/grant-xp-service.ts`, `utils/xp-keys.ts`, migration `1785000000000`.

### Recherche hybride : base locale d'abord

- Décision : la recherche interroge la base locale. Si elle renvoie moins de 5 résultats, Google Books et Open Library sont interrogés en parallèle (`Promise.allSettled`), puis les résultats sont dédupliqués par ISBN13.
- Intention : favoriser le catalogue interne et éviter les appels externes inutiles. Deux sources parce qu'il manque parfois à l'une des informations que l'autre fournit.
- Autre choix : un livre externe passe par une page de prévisualisation (`/books/preview/:isbn13`) avant d'être enregistré.
- Référence : `graphql/resolvers/book/book-search-resolver.ts`.

### Calculs côté serveur et DataLoaders

- Décision : les valeurs dérivées (note moyenne, nombre de critiques, présence en bibliothèque, compteurs d'abonnés, titre) sont des FieldResolvers calculés côté serveur. Chacun est regroupé par un DataLoader créé à chaque requête, pour éviter les requêtes N+1 sur les listes.
- Référence : `graphql/dataloaders/`, `00c2944`, `17f0c18`, `f927404`, `fc8bfce`.

### Effacement RGPD en une seule transaction

- Décision : `eraseUserAccount` supprime, anonymise (clé étrangère mise à NULL) et détache les contributions dans une seule transaction. La suppression d'un compte par l'admin passe par la même fonction.
- Référence : `services/rgpd/erasure-service.ts`, `c7665f0`, `97a9bcd`.

### Le fil d'activité réutilise le journal d'XP

- Décision : le fil est construit sur `UserActions`, la table qui journalise déjà chaque gain d'XP. Aucune nouvelle source d'événements n'a été créée.
- Référence : `9d38881`, `graphql/resolvers/user/feed-resolver.ts`.

### Des tests ciblés sur le risque

- Décision : pas d'objectif de couverture. Les tests portent sur ce qui coûte cher en cas de bug (authentification, autorisations, XP, RGPD, logique d'affichage dérivée). La logique pure du front est isolée dans `lib/` pour être testée sans navigateur simulé. Côté back, les accès TypeORM sont simulés, sans base de données.
- Alternative écartée : tests de composants avec jsdom et Testing Library, jugés peu utiles pour leur coût.
- Complément : CI stricte (un avertissement de lint fait échouer le build), branche `master` protégée, un commit n'y arrive qu'après une CI verte sur `test`.
- Référence : `.github/workflows/ci.yml`, `src/test/factories.ts` (back).

## Difficultés rencontrées

### XP gagnée en boucle

- Problème : retirer puis remettre une recommandation, un livre en bibliothèque ou un vote accordait l'XP à chaque fois.
- Découverte : pendant le chantier d'ajout de tests mené avec Claude.
- Solution : la clé `xpKey` et son index unique (`d3aafae`).
- Règle retenue (CLAUDE.md) : toujours dériver la clé d'un identifiant stable, jamais d'une entité supprimable.

### Recherche externe presque toujours en échec

- Problème : Open Library répond souvent en 4 à 8 s, alors que le timeout était de 3 s. Presque toutes les recherches externes étaient abandonnées, et les échecs n'étaient pas journalisés.
- Solution : timeout passé à 8 s, journalisation des échecs, normalisation des ISBN saisis (`ce9eaa9`).

### Suppression de compte par l'admin qui échouait

- Problème : la suppression par l'admin dupliquait une logique incomplète. Elle oubliait les commentaires et les catégories créées, et échouait sur une contrainte de clé étrangère dès que le compte avait commenté une critique.
- Solution : réutiliser `eraseUserAccount` (`97a9bcd`).

### Rôle admin inopérant sur les fiches des autres

- Problème : `updateBook` et `updateAuthor` ne cherchaient que parmi les fiches de l'utilisateur connecté. Le contrôle `isOwnerOrAdmin` ne pouvait donc jamais autoriser l'admin.
- Solution : filtrer sur le propriétaire uniquement pour les non-admins (`a1cc6bd`).

### Création d'auteur en concurrence

- Problème : deux créations simultanées du même auteur plantaient ou créaient un doublon (pattern check-then-act).
- Solution : contrainte unique `(firstname, lastname)` et `INSERT ... ON CONFLICT DO NOTHING` suivi d'une relecture (`c68f46d`).

### Politique de mot de passe contournable

- Problème : la règle de robustesse ne s'appliquait qu'à l'inscription. Le changement de mot de passe acceptait n'importe quelle valeur.
- Solution : règle définie une seule fois (`utils/password-policy.ts`) et appliquée aux deux parcours, avec son miroir côté front (`70cc4f6`, `9a20508`).

### Ce que j'en retiens

- Mener seul (avec Claude) un projet de bout en bout, de la base de données au déploiement, demande de réfléchir à chaque couche, pas seulement aux fonctionnalités.
- La réflexion côté utilisateur, notamment la gamification, fait partie de la conception au même titre que la technique : ce qu'on récompense oriente ce que les utilisateurs font.

## Liens entre les parties

- Import externe → gamification : les fiches importées sont volontairement incomplètes, et l'XP de complétion pousse les utilisateurs à les enrichir.
- Gamification → catalogue : l'XP remplace la saisie manuelle du catalogue par l'auteur du projet.
- XP jamais retirée → déduplication par `xpKey` : la règle produit n'est tenable que grâce à la contrainte en base.
- Journal `UserActions` → fil d'activité et statistiques du profil : la même table sert à l'XP, au fil social et aux compteurs du profil (`lib/profileActivity.ts`).
- Catalogue construit par la communauté → anonymisation à l'effacement : supprimer les contributions d'un compte appauvrirait le catalogue commun.

## Limites et absences assumées

- Pas de notifications, de modération ni de signalement : périmètre MVP volontaire.
- Pas de classement des lecteurs, de recommandations personnalisées ni de recherche d'utilisateurs.
- Pas de logger structuré.
- Les durées de conservation RGPD sont annoncées dans les mentions légales, mais aucune purge automatique n'est implémentée.
- L'import d'un livre prend la première source qui répond (Open Library, sinon Google Books) sans fusionner les champs. La prévisualisation, elle, fusionne les deux sources (`book-search-resolver.ts`). Un livre importé peut donc avoir moins d'informations que sa prévisualisation.

## État et suite

- Début : 27 mars 2025 (`dc769a4`).
- État : projet considéré comme terminé. Toutes les fonctionnalités décrites sont en place, avec une CI (lint, typecheck, tests) et un déploiement CapRover documenté.
- Développé avec l'assistance de Claude (Claude Code pour le code, Claude Design pour les maquettes).
- Suite prévue : éventuellement la purge automatique des données à la fin des durées de conservation, pour compléter la conformité RGPD. Rien d'autre n'est prévu.
