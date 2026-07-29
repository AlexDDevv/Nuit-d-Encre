# Installation et configuration de CapRover — de zéro

Ce guide part d'un VPS vierge et s'arrête à Nuit d'Encre en ligne en HTTPS.
Il est prévu pour une première installation : chaque étape se termine par une
vérification qui dit si tu peux passer à la suite.

Une fois le serveur en place, le mémo de déploiement au quotidien (matrice des
variables, backups) est dans [`deployment-caprover.md`](./deployment-caprover.md).

---

## 0. Ce que CapRover fait (et ce qu'il remplace)

CapRover est un PaaS auto-hébergé posé sur Docker Swarm. Concrètement :

- **Il est le reverse proxy.** Il embarque nginx + Let's Encrypt : il termine le
  TLS, route chaque domaine vers le bon conteneur et renouvelle les certificats
  seul. Tu n'installes ni nginx ni Certbot sur l'hôte.
- **Il ne lit pas de `compose.yaml`.** Il raisonne app par app : pour chaque app
  tu lui fournis une archive contenant un `captain-definition`, il construit
  l'image et la lance. Le `compose.yaml` du repo reste un outil de dev local.
- **Il fournit un réseau interne.** Chaque app y est joignable sous le nom
  `srv-captain--<nom-app>`, sans jamais être exposée sur Internet.

L'architecture cible :

```
Internet ──HTTPS──> [nginx de CapRover]          ← reverse proxy, fourni
                          │ HTTP interne
                          ▼
                   [app front : nginx]           ← sert le SPA, proxifie /api
                          │ http://srv-captain--nuit-encre-back:3310
                          ▼
                   [app back : Node]
                          │
                   [app db : PostgreSQL]         ← jamais exposée
```

Le nginx de l'app front n'est pas un doublon du reverse proxy : il existe pour
que le navigateur ne voie qu'**une seule origine**. C'est ce qui permet au
cookie de session `SameSite=Strict` de fonctionner et évite toute config CORS.

---

## 1. Prérequis

| | Minimum | Confortable |
|---|---|---|
| RAM | 2 Go | 4 Go |
| Disque | 20 Go | 40 Go |
| OS | Ubuntu 22.04 ou 24.04 | idem |

CapRover annonce tourner sur 1 Go, mais **les builds se font sur le serveur** :
`pnpm install` + build Vite + build TypeScript dans le même conteneur, ça tient
mal en dessous de 2 Go. Si tu prévois prod + staging (6 conteneurs), vise 4 Go.

Il te faut aussi un **nom de domaine** dont tu contrôles les DNS.

> Si ton VPS a peu de RAM, ajoute un fichier d'échange **avant** le premier
> build, sinon il sera tué en silence (`Killed` dans les logs) :
>
>     sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
>     sudo mkswap /swapfile && sudo swapon /swapfile
>     echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

---

## 2. Préparer le serveur

En SSH sur le VPS, en root (ou avec `sudo`).

**Docker** (25.x ou plus) :

```bash
curl -fsSL https://get.docker.com | sh
docker --version
```

**Pare-feu.** CapRover a besoin de ports précis : 80 et 443 pour le trafic web,
3000 pour le dashboard à l'installation, et 996 / 7946 / 4789 / 2377 pour Docker
Swarm.

```bash
ufw allow 22/tcp
ufw allow 80,443,3000,996,7946,2377/tcp
ufw allow 7946,4789,2377/udp
ufw enable
ufw status
```

⚠️ **Autorise le 22 avant d'activer ufw**, sinon tu te coupes ta propre session
SSH et il faut passer par la console de secours de l'hébergeur.

✅ *Vérification* : `docker run --rm hello-world` affiche « Hello from Docker! ».

---

## 3. Le DNS (à faire maintenant, ça met du temps à se propager)

Chez ton registrar, crée un enregistrement **A avec joker** pointant sur l'IP du
VPS :

| Type | Nom | Valeur |
|---|---|---|
| A | `*.captain` | `<IP du VPS>` |

Le joker permet à CapRover de créer `captain.ton-domaine.fr`,
`nuit-encre-front.captain.ton-domaine.fr`, etc. sans y retoucher.

Ajoute aussi l'enregistrement du domaine public du site :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` (ou `www`) | `<IP du VPS>` |

✅ *Vérification*, depuis ta machine — attends que ça réponde l'IP du VPS avant
de continuer (de quelques minutes à quelques heures) :

```bash
dig +short n-importe-quoi.captain.ton-domaine.fr
```

Lancer l'étape 5 avant que le DNS soit propagé fait échouer l'émission du
certificat Let's Encrypt : c'est la cause n° 1 des installations ratées.

---

## 4. Installer CapRover

Sur le VPS :

```bash
docker run -p 80:80 -p 443:443 -p 3000:3000 \
  -e ACCEPTED_TERMS=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /captain:/captain \
  caprover/caprover
```

**Ne change aucun mapping de port** : CapRover ne fonctionne que sur ceux-là.

Le démarrage prend une minute ou deux. Les données vivent dans `/captain` sur
l'hôte.

✅ *Vérification* : `http://<IP du VPS>:3000` affiche l'écran de connexion.
Mot de passe par défaut : `captain42`.

---

## 5. Configurer le serveur

Depuis **ta machine** (pas le VPS) :

```bash
npm install -g caprover
caprover serversetup
```

L'assistant demande, dans l'ordre :

1. **l'IP du VPS** ;
2. **le domaine racine** : saisis `captain.ton-domaine.fr` — celui du joker DNS ;
3. **un email** pour Let's Encrypt (renouvellement des certificats) ;
4. **un nouveau mot de passe** — change-le, `captain42` est public ;
5. **activer HTTPS** : oui.

À la fin, le dashboard bascule sur `https://captain.ton-domaine.fr` et le port
3000 n'est plus nécessaire :

```bash
ufw delete allow 3000/tcp
```

✅ *Vérification* : `https://captain.ton-domaine.fr` s'ouvre avec un cadenas
valide, et tu t'y connectes avec le nouveau mot de passe.

Enfin, authentifie la CLI pour les déploiements :

```bash
caprover login
caprover list
```

---

## 6. Créer la base de données

Dashboard → **Apps** → **One-Click Apps/Databases** → *PostgreSQL*.

| Champ | Valeur |
|---|---|
| App Name | `nuit-encre-db` |
| Version | `15` (aligné sur le dev) |
| Username / Password / DB name | à choisir — **note-les**, ils vont dans la config du back |

Le mot de passe se génère avec `openssl rand -hex 24`.

Ne coche **jamais** « Enable HTTPS » ni de domaine pour cette app : la base ne
doit être joignable que sur le réseau interne.

✅ *Vérification* : l'app apparaît en vert dans la liste, et son nom interne est
`srv-captain--nuit-encre-db`.

> Le backend exécute `CREATE EXTENSION` pour `pgcrypto` et `unaccent` au
> démarrage. L'utilisateur créé par l'app one-click est superuser, donc ça
> passe. Si tu migres un jour vers une base managée avec un utilisateur bridé,
> il faudra créer ces extensions à la main.

---

## 7. Créer et configurer l'app backend

Dashboard → **Apps** → **Create A New App** → nom : `nuit-encre-back`.
Ne coche pas « Has Persistent Data ».

Ouvre l'app, onglet **App Configs**, et renseigne les variables
d'environnement :

| Variable | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `APP_PORT` | `3310` |
| `DB_HOST` | `srv-captain--nuit-encre-db` |
| `DB_PORT` | `5432` |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | les valeurs de l'étape 6 |
| `DB_MIGRATIONS_RUN` | `true` |
| `JWT_SECRET` | `openssl rand -hex 32` — **valeur neuve, jamais celle du dev** |
| `COOKIE_SECRET` | `openssl rand -hex 32` — idem |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_USERNAME` / `ADMIN_ROLE` | compte admin de prod, mot de passe fort |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | ton compte Cloudinary |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | client OAuth Google de prod |

Puis **Save & Update**.

Trois pièges de configuration :

- **`NODE_ENV=production` n'est pas décoratif.** Il conditionne le flag `secure`
  du cookie de session et réduit les logs SQL pour éviter d'écrire des données
  personnelles en clair.
- **`COOKIE_SECRET` et `APP_PORT` manquants font crasher le boot** volontairement
  (`throw` au démarrage). Un conteneur qui redémarre en boucle vient souvent de
  là.
- **Ne mets ni domaine ni HTTPS sur le back.** Il n'a pas à être joignable
  depuis Internet : seul le front l'appelle, en interne. Laisse le Container
  HTTP Port par défaut.

---

## 8. Déployer le backend

Depuis la **racine du repo**, sur ta machine :

```bash
git archive --format tar -o /tmp/back.tar develop:app/backend
caprover deploy -a nuit-encre-back -t /tmp/back.tar
```

> **Pourquoi cette gymnastique plutôt que `caprover deploy -b develop` ?**
> Le déploiement par branche lance `git archive <branche>`, qui archive **toute
> la racine du repo** quel que soit le dossier depuis lequel tu la lances.
> CapRover chercherait alors `captain-definition` à la racine du monorepo (il
> n'y est pas), et le contexte de build serait la racine — alors que nos
> `Dockerfile.prod` font `COPY package.json ./`, relatif au dossier de l'app.
> La syntaxe `develop:app/backend` extrait le sous-dossier **à la racine de
> l'archive** : `captain-definition` et le contexte retombent au bon endroit.
> Effet de bord utile : seuls les fichiers commités partent — ton `.env` local
> et `node_modules` restent chez toi.

Le build prend plusieurs minutes la première fois (installation des dépendances
+ compilation TypeScript). La CLI affiche les logs et te signale l'échec, c'est
pour ça qu'on la préfère à l'upload par le dashboard.

Au premier démarrage, le backend applique les migrations, crée le compte admin
et seed les titres de gamification. Tout est idempotent : les redéploiements ne
recréent rien.

✅ *Vérification* : dashboard → app → onglet **Deployment** → *View Logs*. Tu
dois lire `🚀 Server ready at:` sans trace d'erreur au-dessus, et l'app doit
rester verte (pas de redémarrage en boucle).

---

## 9. Créer, configurer et déployer le frontend

**Create A New App** → nom : `nuit-encre-front`.

Onglet **App Configs**, variables d'environnement :

| Variable | Valeur |
|---|---|
| `BACKEND_URL` | `http://srv-captain--nuit-encre-back:3310` — **sans slash final** |
| `VITE_GOOGLE_CLIENT_ID` | Client ID OAuth Google de prod |

Les deux se saisissent au même endroit mais n'agissent pas au même moment :
`BACKEND_URL` est lue au démarrage de nginx, tandis que `VITE_GOOGLE_CLIENT_ID`
est **inlinée dans le bundle JS au build** (CapRover passe les variables de
l'app en `--build-arg`, et le `Dockerfile.prod` les capte via `ARG`). Conséquence :
la modifier n'a d'effet **qu'après un redéploiement**, pas après un restart.

Toujours dans **App Configs** :

- **Container HTTP Port** → `8080`. L'image tourne sur nginx-unprivileged, qui
  ne peut pas ouvrir le port 80 (il n'est pas root). Sans ce réglage, CapRover
  tape sur le 80 et tu obtiens une 502.

Onglet **HTTP Settings** :

- ajoute ton domaine public (`nuitdencre.fr`) → **Enable HTTPS** ;
- active **Force HTTPS**.

⚠️ **HTTPS est obligatoire, pas un confort.** En production le cookie de session
est posé avec `secure: true` : sur une connexion HTTP simple, le navigateur le
jette et **personne ne peut se connecter**, sans le moindre message d'erreur
clair. Si le login échoue silencieusement, vérifie HTTPS en premier.

Déploie, depuis la racine du repo :

```bash
git archive --format tar -o /tmp/front.tar develop:app/frontend
caprover deploy -a nuit-encre-front -t /tmp/front.tar
```

✅ *Vérification* : `https://nuitdencre.fr` affiche le site avec un cadenas
valide.

---

## 10. Vérifier le déploiement

Dans l'ordre, du plus bas niveau au plus visible :

1. **Le front sert le SPA** : la page d'accueil s'affiche.
2. **Le proxy `/api` fonctionne** : les livres apparaissent. S'ils manquent,
   ouvre la console réseau du navigateur — une 502 sur `/api` pointe vers
   `BACKEND_URL` ou vers un back qui ne tourne pas.
3. **Le routage SPA tient** : recharge (F5) une URL profonde comme
   `https://nuitdencre.fr/authors`. Une 404 ici signifie que le fallback
   `try_files` n'a pas pris.
4. **La session fonctionne** : connecte-toi avec le compte admin. Si le login
   « réussit » mais que tu es déconnecté au rechargement, c'est le cookie —
   donc HTTPS (voir étape 9).
5. **Google OAuth** : teste « Continuer avec Google ». En cas d'échec, vérifie
   dans la console Google Cloud que l'URL publique est bien déclarée dans les
   *Origines JavaScript autorisées* du client OAuth de prod.

---

## 11. Redéployer plus tard

C'est la même paire de commandes, à relancer après chaque merge :

```bash
git archive --format tar -o /tmp/back.tar develop:app/backend
caprover deploy -a nuit-encre-back -t /tmp/back.tar
```

Quelques réflexes :

- **Une seule app à redéployer** la plupart du temps : inutile de reconstruire
  le front pour un changement de resolver.
- **Migrations** : elles s'appliquent au boot du back. Si l'une échoue, le boot
  s'arrête (`exit 1`) plutôt que de démarrer sur un schéma incohérent — l'app
  redémarre en boucle et les logs portent l'erreur SQL.
- **Rollback** : onglet *Deployment* → section des versions précédentes →
  *Rollback*. Attention, ça ne défait pas une migration de base.
- **Sauvegarde la base avant une migration lourde** (voir la section backups de
  [`deployment-caprover.md`](./deployment-caprover.md)).

---

## 12. Ajouter un environnement de staging

Rien à dupliquer dans le repo : tu crées un second jeu d'apps, alimenté par une
autre branche.

| | Prod | Staging |
|---|---|---|
| Apps | `nuit-encre-{front,back,db}` | `staging-nuit-encre-{front,back,db}` |
| Branche | `master` | `develop` |
| Domaine | `nuitdencre.fr` | `staging.nuitdencre.fr` |
| `BACKEND_URL` | `http://srv-captain--nuit-encre-back:3310` | `http://srv-captain--staging-nuit-encre-back:3310` |
| `DB_HOST` | `srv-captain--nuit-encre-db` | `srv-captain--staging-nuit-encre-db` |
| Secrets, `ADMIN_*` | valeurs de prod | valeurs distinctes |

Trois points de vigilance :

1. **Deux bases séparées, jamais partagées.** C'est l'erreur classique : un test
   sur le staging écrase les données de prod.
2. **Origines OAuth Google** : ajoute `https://staging.nuitdencre.fr` aux
   origines autorisées (ou crée un client OAuth dédié), sinon la connexion
   Google y sera cassée.
3. **RAM** : 6 conteneurs plus les builds. En dessous de 4 Go ça devient
   inconfortable.

---

## Dépannage

| Symptôme | Cause la plus probable |
|---|---|
| Le certificat HTTPS ne s'émet pas | DNS pas encore propagé, ou joker `*.captain` absent |
| 502 sur tout le site | Container HTTP Port du front ≠ `8080` |
| Le site s'affiche, `/api` en 502 | `BACKEND_URL` erronée (slash final, faute de frappe) ou back arrêté |
| 404 en rechargeant une URL profonde | Le fallback SPA ne s'applique pas — l'image front n'est pas à jour |
| Login sans effet, déconnecté au rechargement | HTTPS non activé : le cookie `secure` est rejeté |
| Le back redémarre en boucle | Variable manquante (`COOKIE_SECRET`, `APP_PORT`), identifiants base faux, ou migration en échec — regarde les logs |
| `captain-definition` introuvable au déploiement | Déploiement par branche au lieu de l'archive `develop:app/<app>` (étape 8) |
| Bouton Google sans effet | `VITE_GOOGLE_CLIENT_ID` absente au build, ou origine non déclarée côté Google Cloud |
| Build tué sans message (`Killed`) | Mémoire insuffisante — ajoute un swap (étape 1) |

Les logs sont dans le dashboard : app → **Deployment** → *View Logs* (runtime) et
la sortie de la CLI pour le build.

---

## Sources

- [CapRover — Getting Started](https://caprover.com/docs/get-started.html)
- [CapRover — Captain Definition File](https://caprover.com/docs/captain-definition-file.html)
- [CapRover — App Configuration](https://caprover.com/docs/app-configuration.html)
- [CapRover — Deployment Methods](https://caprover.com/docs/deployment-methods.html)
- [CapRover — CLI Commands](https://caprover.com/docs/cli-commands.html)
