# Design : Système de gestion des erreurs GraphQL côté frontend

**Date :** 2026-03-15
**Statut :** En révision

---

## Contexte et problème

Le système actuel affiche les messages d'erreur bruts du backend dans les toasts utilisateur. Par exemple, lors de la création d'un livre, un utilisateur peut voir `"Failed to create book"` ou `"Category not found"` — des messages techniques en anglais, non adaptés à l'expérience utilisateur.

### Fichiers cassés aujourd'hui

- `BookForm.tsx` (L154-166) : `err.message` utilisé directement comme description du toast
- `AuthorForm.tsx` (L119-131) : même pattern

### Fichiers fragiles (fonctionnent mais cassables)

- `BookDetails.tsx` : détecte les erreurs via `error.message.includes("Access denied! You don't have permission for this action!")` — string interne de type-graphql
- `useUserBookMutations.ts` : même pattern fragile

### Fichiers avec cas manquants

- `ReviewForm.tsx` : ne distingue pas un ConflictError (critique déjà existante) d'une erreur générique
- `ReviewVoteButtons.tsx` : ne distingue pas les erreurs métier (vote sur sa propre critique)
- `BookReviews.tsx` : catch générique pour la suppression de critique

---

## Solution retenue

**Approche A — Utilitaire centralisé `parseGraphQLError(error, context)`**

Créer un utilitaire unique qui mappe les erreurs GraphQL connues vers des messages utilisateur en français, contextuels et granulaires. Les composants passent leur contexte métier et reçoivent `{ title, description }` prêt à l'emploi.

---

## Architecture

### Nouveau fichier

**`app/frontend/src/utils/graphql-error.ts`**

Exporte une seule fonction :

```typescript
parseGraphQLError(error: unknown, context: ErrorContext): { title: string; description: string }
```

- Accepte n'importe quel type d'erreur (`ApolloError`, `Error`, `unknown`)
- Pour une `ApolloError`, inspecte `graphQLErrors[].message` (matching par substring, **case-sensitive**)
- Retourne le premier message qui matche dans les règles du contexte
- Fallback générique propre au contexte si aucune règle ne matche
- Si `error` n'est pas une `ApolloError` : titre "Erreur de connexion", description "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez."

### Note sur les deux sources d'erreurs d'autorisation

Deux chaînes distinctes peuvent indiquer un accès refusé :
- Messages AppError lancés par les resolvers lors d'une vérification de propriété (utilisateur connecté mais pas propriétaire) : `"Not authorized to delete this book"`, `"Not authorized to update this review"`, etc.
- `"Access denied! You don't have permission for this action!"` — lancé par le guard type-graphql `@Authorized` lors d'une requête non authentifiée

Ces deux cas sont vérifiés **indépendamment** dans les règles de matching.

### Note sur les messages "Not authorized to delete" pour les opérations de modification

Le backend utilise `"Not authorized to delete this book"` également pour l'opération `updateBook` — c'est une inconsistance de nommage dans le code backend, pas une erreur du mapping. Les substrings du présent document reflètent les messages réels tels que retournés par le backend.

### Contextes couverts (`ErrorContext`)

```typescript
type ErrorContext =
  | "createBook" | "updateBook" | "deleteBook"
  | "createAuthor" | "updateAuthor"
  | "createReview" | "updateReview" | "deleteReview"
  | "voteOnReview"
  | "toggleRecommendation"
  | "createUserBook" | "updateUserBook" | "deleteUserBook"
```

---

## Mapping complet des messages

Les substrings de détection sont **case-sensitive** et correspondent exactement aux messages du backend (vérifiés dans les sources).

### Livre

| Contexte | Substring backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `createBook` | `"Category not found"` | Catégorie introuvable | La catégorie sélectionnée n'existe pas. |
| `createBook` | `"Access denied"` | Connexion requise | Vous devez être connecté pour ajouter un livre. |
| `createBook` | fallback | Échec de la création | Impossible d'enregistrer le livre. Veuillez réessayer. |
| `updateBook` | `"Book not found"` | Livre introuvable | Ce livre n'existe pas ou a été supprimé. |
| `updateBook` | `"Not authorized to delete this book"` | Action non autorisée | Vous ne pouvez pas modifier ce livre. |
| `updateBook` | `"Access denied"` | Connexion requise | Vous devez être connecté pour modifier un livre. |
| `updateBook` | `"Category not found"` | Catégorie introuvable | La catégorie sélectionnée n'existe pas. |
| `updateBook` | fallback | Échec de la modification | Impossible de modifier le livre. Veuillez réessayer. |
| `deleteBook` | `"Book not found"` | Livre introuvable | Ce livre n'existe pas ou a déjà été supprimé. |
| `deleteBook` | `"Not authorized to delete this book"` | Action non autorisée | Vous n'avez pas les droits pour supprimer ce livre. |
| `deleteBook` | `"Access denied"` | Connexion requise | Vous devez être connecté pour supprimer un livre. |
| `deleteBook` | fallback | Échec de la suppression | Impossible de supprimer le livre. Veuillez réessayer. |

### Auteur

| Contexte | Substring backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `createAuthor` | `"Access denied"` | Connexion requise | Vous devez être connecté pour ajouter un auteur. |
| `createAuthor` | fallback | Échec de la création | Impossible d'enregistrer l'auteur. Veuillez réessayer. |
| `updateAuthor` | `"Author not found"` | Auteur introuvable | Cet auteur n'existe pas ou a été supprimé. |
| `updateAuthor` | `"Not authorized to delete this author"` | Action non autorisée | Vous ne pouvez pas modifier cet auteur. |
| `updateAuthor` | `"Access denied"` | Connexion requise | Vous devez être connecté pour modifier un auteur. |
| `updateAuthor` | fallback | Échec de la modification | Impossible de modifier l'auteur. Veuillez réessayer. |

### Critique

| Contexte | Substring backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `createReview` | `"already reviewed this book"` | Critique déjà publiée | Vous avez déjà écrit une critique pour ce livre. Modifiez-la plutôt. |
| `createReview` | `"Access denied"` | Connexion requise | Vous devez être connecté pour publier une critique. |
| `createReview` | fallback | Échec de la publication | Impossible de publier la critique. Veuillez réessayer. |
| `updateReview` | `"Review not found"` | Critique introuvable | Cette critique n'existe pas ou a été supprimée. |
| `updateReview` | `"Not authorized to update this review"` | Action non autorisée | Vous ne pouvez pas modifier cette critique. |
| `updateReview` | `"Access denied"` | Connexion requise | Vous devez être connecté pour modifier une critique. |
| `updateReview` | fallback | Échec de la modification | Impossible de modifier la critique. Veuillez réessayer. |
| `deleteReview` | `"Review not found"` | Critique introuvable | Cette critique n'existe pas ou a déjà été supprimée. |
| `deleteReview` | `"Not authorized to delete this review"` | Action non autorisée | Vous ne pouvez pas supprimer cette critique. |
| `deleteReview` | `"Access denied"` | Connexion requise | Vous devez être connecté pour supprimer une critique. |
| `deleteReview` | fallback | Échec de la suppression | Impossible de supprimer la critique. Veuillez réessayer. |

### Vote et recommandation

| Contexte | Substring backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `voteOnReview` | `"You cannot vote on your own review"` | Vote non autorisé | Vous ne pouvez pas voter pour votre propre critique. |
| `voteOnReview` | `"Access denied"` | Connexion requise | Vous devez être connecté pour voter. |
| `voteOnReview` | fallback | Échec du vote | Impossible d'enregistrer votre vote. Veuillez réessayer. |
| `toggleRecommendation` | `"Book not found"` | Livre introuvable | Ce livre n'existe pas ou a été supprimé. |
| `toggleRecommendation` | `"Access denied"` | Connexion requise | Vous devez être connecté pour recommander un livre. |
| `toggleRecommendation` | fallback | Échec de la recommandation | Impossible d'enregistrer votre recommandation. Veuillez réessayer. |

### Bibliothèque utilisateur

| Contexte | Substring backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `createUserBook` | `"already"` | Livre déjà ajouté | Ce livre est déjà dans votre bibliothèque. |
| `createUserBook` | `"Access denied"` | Connexion requise | Vous devez être connecté pour ajouter un livre à votre bibliothèque. |
| `createUserBook` | fallback | Échec de l'ajout | Impossible d'ajouter ce livre à votre bibliothèque. Veuillez réessayer. |
| `updateUserBook` | `"Access denied"` | Action non autorisée | Vous ne pouvez pas modifier cette entrée. |
| `updateUserBook` | fallback | Échec de la mise à jour | Impossible de mettre à jour le statut. Veuillez réessayer. |
| `deleteUserBook` | `"Access denied"` | Action non autorisée | Vous n'avez pas les droits pour supprimer ce livre. |
| `deleteUserBook` | fallback | Échec de la suppression | Impossible de supprimer ce livre de votre bibliothèque. Veuillez réessayer. |

---

## Fichiers à modifier

### 1 nouveau fichier

- `app/frontend/src/utils/graphql-error.ts` — utilitaire central

### 8 fichiers refactorisés

| Fichier | Changement |
|---|---|
| `app/frontend/src/components/sections/book/BookForm.tsx` | Remplace `err.message` par `parseGraphQLError(err, "createBook" \| "updateBook")` |
| `app/frontend/src/components/sections/author/AuthorForm.tsx` | Remplace `err.message` par `parseGraphQLError(err, "createAuthor" \| "updateAuthor")` |
| `app/frontend/src/pages/books/BookDetails.tsx` | **Deux catch à remplacer :** (1) `handleDeleteBook` — remplace l'intégralité du catch body (structure `instanceof Error` + branches `includes()`) par `parseGraphQLError(err, "deleteBook")` ; (2) `handleStatusChange` — remplace le catch body (y compris le guard `!user`) par `parseGraphQLError(err, "createUserBook")` |
| `app/frontend/src/hooks/userBook/useUserBookMutations.ts` | Remplace l'intégralité du catch body (structure `instanceof Error` + branches `includes()`) de `deleteUserBook` par `parseGraphQLError(err, "deleteUserBook")` |
| `app/frontend/src/components/sections/form/ReviewForm.tsx` | Remplace le catch générique par `parseGraphQLError(err, "createReview" \| "updateReview")` |
| `app/frontend/src/components/sections/book/ReviewVoteButtons.tsx` | Remplace le catch générique par `parseGraphQLError(err, "voteOnReview")` |
| `app/frontend/src/components/sections/book/BookReviews.tsx` | Remplace le catch générique par `parseGraphQLError(err, "deleteReview")` |

### Fichiers non touchés

- `Signin.tsx`, `Signup.tsx` — logique custom suffisante, fonctionnent correctement
- Pas de contexte `deleteAuthor` : `AuthorForm.tsx` n'expose pas de suppression d'auteur

---

## Flux de données

```
Composant appelle mutation
  → Apollo lance la requête GraphQL
  → Backend retourne une erreur (AppError avec message structuré)
  → Apollo crée une ApolloError avec graphQLErrors[].message
  → catch(error) dans le composant/hook
  → parseGraphQLError(error, "contexte")
      → vérifie si ApolloError
        → si oui : inspecte graphQLErrors[].message (case-sensitive substring)
        → si non : retourne erreur de connexion générique
      → retourne { title, description }
  → showToast({ type: "error", ...résultat })
```
