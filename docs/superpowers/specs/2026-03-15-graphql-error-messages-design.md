# Design : Système de gestion des erreurs GraphQL côté frontend

**Date :** 2026-03-15
**Statut :** Approuvé
**Périmètre :** Frontend uniquement — aucune modification backend requise

---

## Contexte et problème

Le système actuel affiche les messages d'erreur bruts du backend dans les toasts utilisateur. Par exemple, lors de la création d'un livre, un utilisateur peut voir `"Failed to create book"` ou `"Category not found"` — des messages techniques en anglais, non adaptés à l'expérience utilisateur.

### Fichiers cassés aujourd'hui

- `BookForm.tsx` (L154-166) : `err.message` utilisé directement comme description du toast
- `AuthorForm.tsx` (L119-131) : même pattern

### Fichiers fragiles (fonctionnent mais cassables)

- `BookDetails.tsx` : détecte les erreurs via `error.message.includes("Access denied! You don't have permission for this action!")` — string anglais interne de type-graphql
- `useUserBookMutations.ts` : même pattern fragile

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
- Pour une `ApolloError`, inspecte `graphQLErrors[].message` (matching par substring)
- Retourne le premier message qui matche dans les règles du contexte
- Fallback générique propre au contexte si aucune règle ne matche
- Fallback global si le contexte est inconnu

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

### Livre

| Contexte | Message backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `createBook` | `"Category not found"` | Catégorie introuvable | La catégorie sélectionnée n'existe pas. |
| `createBook` | `"Access denied"` | Connexion requise | Vous devez être connecté pour ajouter un livre. |
| `createBook` | fallback | Échec de la création | Impossible d'enregistrer le livre. Veuillez réessayer. |
| `updateBook` | `"Book not found"` | Livre introuvable | Ce livre n'existe pas ou a été supprimé. |
| `updateBook` | `"Not authorized"` / `"Access denied"` | Action non autorisée | Vous ne pouvez pas modifier ce livre. |
| `updateBook` | `"Category not found"` | Catégorie introuvable | La catégorie sélectionnée n'existe pas. |
| `updateBook` | fallback | Échec de la modification | Impossible de modifier le livre. Veuillez réessayer. |
| `deleteBook` | `"Book not found"` | Livre introuvable | Ce livre n'existe pas ou a déjà été supprimé. |
| `deleteBook` | `"Not authorized"` / `"Access denied"` | Action non autorisée | Vous n'avez pas les droits pour supprimer ce livre. |
| `deleteBook` | fallback | Échec de la suppression | Impossible de supprimer le livre. Veuillez réessayer. |

### Auteur

| Contexte | Message backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `createAuthor` | `"Access denied"` | Connexion requise | Vous devez être connecté pour ajouter un auteur. |
| `createAuthor` | fallback | Échec de la création | Impossible d'enregistrer l'auteur. Veuillez réessayer. |
| `updateAuthor` | `"Author not found"` | Auteur introuvable | Cet auteur n'existe pas ou a été supprimé. |
| `updateAuthor` | `"Not authorized"` / `"Access denied"` | Action non autorisée | Vous ne pouvez pas modifier cet auteur. |
| `updateAuthor` | fallback | Échec de la modification | Impossible de modifier l'auteur. Veuillez réessayer. |

### Critique

| Contexte | Message backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `createReview` | `"already reviewed"` | Critique déjà publiée | Vous avez déjà écrit une critique pour ce livre. Modifiez-la plutôt. |
| `createReview` | `"Access denied"` | Connexion requise | Vous devez être connecté pour publier une critique. |
| `createReview` | fallback | Échec de la publication | Impossible de publier la critique. Veuillez réessayer. |
| `updateReview` | `"Review not found"` | Critique introuvable | Cette critique n'existe pas ou a été supprimée. |
| `updateReview` | `"Not authorized"` / `"Access denied"` | Action non autorisée | Vous ne pouvez pas modifier cette critique. |
| `updateReview` | fallback | Échec de la modification | Impossible de modifier la critique. Veuillez réessayer. |
| `deleteReview` | `"Review not found"` | Critique introuvable | Cette critique n'existe pas ou a déjà été supprimée. |
| `deleteReview` | `"Not authorized"` / `"Access denied"` | Action non autorisée | Vous ne pouvez pas supprimer cette critique. |
| `deleteReview` | fallback | Échec de la suppression | Impossible de supprimer la critique. Veuillez réessayer. |

### Vote et recommandation

| Contexte | Message backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `voteOnReview` | `"cannot vote on your own"` | Vote non autorisé | Vous ne pouvez pas voter pour votre propre critique. |
| `voteOnReview` | `"Access denied"` | Connexion requise | Vous devez être connecté pour voter. |
| `voteOnReview` | fallback | Échec du vote | Impossible d'enregistrer votre vote. Veuillez réessayer. |
| `toggleRecommendation` | `"Access denied"` | Connexion requise | Vous devez être connecté pour recommander un livre. |
| `toggleRecommendation` | fallback | Échec de la recommandation | Impossible d'enregistrer votre recommandation. Veuillez réessayer. |

### Bibliothèque utilisateur

| Contexte | Message backend détecté | Titre toast | Description toast |
|---|---|---|---|
| `createUserBook` | `"already"` / `"conflict"` | Livre déjà ajouté | Ce livre est déjà dans votre bibliothèque. |
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

### 4 fichiers refactorisés

| Fichier | Changement |
|---|---|
| `app/frontend/src/components/sections/book/BookForm.tsx` | Remplace `err.message` par `parseGraphQLError(err, "createBook" \| "updateBook")` |
| `app/frontend/src/components/sections/author/AuthorForm.tsx` | Remplace `err.message` par `parseGraphQLError(err, "createAuthor" \| "updateAuthor")` |
| `app/frontend/src/pages/books/BookDetails.tsx` | Remplace le `includes("Access denied")` par `parseGraphQLError(err, "deleteBook")` |
| `app/frontend/src/hooks/userBook/useUserBookMutations.ts` | Remplace le `includes("Access denied")` par `parseGraphQLError(err, "deleteUserBook")` |

### Fichiers non touchés

- `Signin.tsx`, `Signup.tsx` — logique custom suffisante, fonctionnent correctement
- `ReviewForm.tsx`, `ReviewVoteButtons.tsx`, `BookReviews.tsx` — messages génériques appropriés

---

## Flux de données

```
Composant appelle mutation
  → Apollo lance la requête GraphQL
  → Backend retourne une erreur (AppError avec message structuré)
  → Apollo crée une ApolloError avec graphQLErrors[].message
  → catch(error) dans le composant/hook
  → parseGraphQLError(error, "contexte")
      → inspecte graphQLErrors[].message
      → retourne { title, description }
  → showToast({ type: "error", ...résultat })
```

---

## Gestion des erreurs non GraphQL

Si `error` n'est pas une `ApolloError` (ex: erreur réseau, timeout) :
- Titre : "Erreur de connexion"
- Description : "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez."
