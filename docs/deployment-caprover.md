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

Déploiement d'une app depuis le monorepo (CLI CapRover), **depuis la racine du
repo** :

    git archive --format tar -o /tmp/back.tar develop:app/backend
    caprover deploy -a nuit-encre-back -t /tmp/back.tar

    git archive --format tar -o /tmp/front.tar develop:app/frontend
    caprover deploy -a nuit-encre-front -t /tmp/front.tar

> **Pourquoi un tar et pas `caprover deploy -b develop` ?** Le déploiement par
> branche fait un `git archive <branche>` qui archive **toute la racine du
> repo** : CapRover n'y trouve pas de `captain-definition` à la racine, et le
> contexte de build ne serait pas le dossier de l'app (nos `Dockerfile.prod`
> font `COPY package.json ./`, relatif au dossier de l'app). La syntaxe
> `develop:app/backend` extrait le sous-dossier **à la racine de l'archive** —
> `captain-definition` et le contexte de build retombent au bon endroit.
> Bonus : seuls les fichiers commités sont envoyés (pas de `.env` local, pas de
> `node_modules`).

Procédure détaillée d'installation du serveur : voir
[`caprover-setup.md`](./caprover-setup.md).

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

App `front` (CapRover) — les deux se saisissent au même endroit (App Configs →
*Environmental Variables*), mais sont consommées à des moments différents :

| Variable | Valeur | Consommée |
|---|---|---|
| `BACKEND_URL` | `http://srv-captain--nuit-encre-back:3310` (**sans** slash final) | au démarrage du conteneur nginx |
| `VITE_GOOGLE_CLIENT_ID` | Client ID OAuth Google de prod (identifiant public) | **au build** (inlinée dans le bundle) |

CapRover passe les variables d'environnement de l'app en `--build-arg` au
`docker build` ; le `Dockerfile.prod` du front les récupère via `ARG`/`ENV`
avant `pnpm build`. Conséquence pratique : **changer `VITE_GOOGLE_CLIENT_ID`
n'a d'effet qu'après un redéploiement**, pas après un simple restart de l'app —
le bundle JS est figé à l'image.

> Oublier cette variable ne casse pas le déploiement : le front se construit et
> se sert normalement, mais le bouton « Continuer avec Google » reçoit un
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
