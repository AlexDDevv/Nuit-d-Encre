# Déploiement — CapRover

Trois apps CapRover : **db** (Postgres one-click), **back** (Node), **front**
(nginx). Le repo ne contient aucun secret : toutes les valeurs sensibles sont
saisies dans le dashboard CapRover (App Configs → Environmental Variables).

## Vue d'ensemble

- Le **front** (nginx) sert le SPA et proxifie `/api` → **back** en interne
  (même-origine, cookie `SameSite=Strict` préservé).
- Le **back** applique les migrations au démarrage (`DB_MIGRATIONS_RUN`, défaut
  actif) et crée l'admin + seed des titres à chaque boot (idempotent).
- **db** n'est joignable que sur le réseau interne CapRover (jamais exposé).

## Ordre de déploiement

1. **Postgres** : One-Click Apps → PostgreSQL. Noter le nom d'app (ex.
   `nuit-encre-db`), l'utilisateur, le mot de passe et la base choisis.
2. **Back** : créer l'app `nuit-encre-back`, renseigner les variables (ci-dessous),
   puis déployer depuis `app/backend` (`captain-definition` présent). Le backend
   n'expose aucun port HTTP public : il n'est joignable que par le front sur le
   réseau interne CapRover (port 3310).
3. **Front** : créer l'app `nuit-encre-front`, renseigner `BACKEND_URL`, déployer
   depuis `app/frontend`. Activer HTTPS + le domaine. Régler le **Container HTTP
   Port** sur `8080` (App Configs).

Déploiement d'une app depuis le monorepo (CLI CapRover) :

    caprover deploy --appName nuit-encre-back  # exécuté depuis app/backend
    caprover deploy --appName nuit-encre-front # exécuté depuis app/frontend

## Matrice des variables d'environnement

| Variable | Dev (`app/backend/.env`) | Prod (CapRover, app `back`) |
|---|---|---|
| `NODE_ENV` | `development` | `production` |
| `APP_PORT` | `3310` | `3310` |
| `DB_HOST` | `db` | `srv-captain--nuit-encre-db` |
| `DB_PORT` | `5432` | `5432` |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | valeurs locales | valeurs de l'app Postgres CapRover |
| `DB_MIGRATIONS_RUN` | `true` (ou absent) | `true` (ou absent) |
| `JWT_SECRET` | valeur locale | **secret neuf** généré pour la prod |
| `COOKIE_SECRET` | valeur locale | **secret neuf** généré pour la prod |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_USERNAME` / `ADMIN_ROLE` | valeurs locales | valeurs de prod (mot de passe fort) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | valeurs locales | valeurs Cloudinary |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | valeurs du client OAuth de dev | valeurs du client OAuth de prod |

App `front` (CapRover) — deux natures de variables, à ne pas confondre :

**Environmental Variables** (lues au démarrage du conteneur nginx) :

| Variable | Valeur |
|---|---|
| `BACKEND_URL` | `http://srv-captain--nuit-encre-back:3310` (**sans** slash final) |

**Build Args** (App Configs → *Build Args*) : les variables `VITE_*` sont inlinées
dans le bundle JS **au moment du build**. Les poser en Environmental Variables ne
sert à rien — le bundle est déjà figé.

| Build Arg | Valeur |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Client ID OAuth Google de prod (identifiant public) |

> Oublier ce build arg ne casse pas le déploiement : le front se construit et se
> sert normalement, mais le bouton « Continuer avec Google » reçoit un
> `clientId` vide et la connexion Google échoue silencieusement.

> Le Client ID OAuth de prod doit avoir l'URL publique du front déclarée dans
> ses *Origines JavaScript autorisées* (console Google Cloud), sinon Google
> refuse la requête.

> Générer les secrets : `openssl rand -hex 32` pour `JWT_SECRET` et `COOKIE_SECRET`.

## Backups Postgres

Postgres one-click stocke ses données dans un volume CapRover sur le VPS. Backups
à ta charge : dump régulier via cron sur l'hôte, par exemple

    docker exec $(docker ps -qf name=srv-captain--nuit-encre-db) \
      pg_dump -U <user> <db> | gzip > /backups/nuit-encre-$(date +\%F).sql.gz

Planifier ce dump dans le crontab de l'hôte et externaliser les archives.
