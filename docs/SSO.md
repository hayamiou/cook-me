# Authentification SSO dans Cook-Me

Ce document explique ce qu'est le SSO, comment il est implémenté dans Cook-Me, et ce que tu dois faire pour que tout fonctionne en local.

---

## C'est quoi le SSO ?

**SSO** = _Single Sign-On_ (authentification unique).

L'idée : au lieu que chaque application gère elle-même ses mots de passe, tout le monde délègue l'authentification à un **serveur d'identité central** (ici : **Keycloak**).

Concrètement pour Cook-Me :
- L'utilisateur clique sur "Se connecter" dans l'app mobile
- Il est redirigé vers une page de login **Keycloak** (pas une page Cook-Me)
- Keycloak vérifie ses identifiants et émet un **token JWT**
- L'app mobile récupère ce token et l'envoie à chaque requête vers l'API
- L'API vérifie que le token est valide (signé par Keycloak) et autorise ou refuse

> Keycloak est le "videur" : l'app mobile lui montre la carte d'identité de l'utilisateur, Keycloak délivre un bracelet (le JWT), et l'API vérifie juste que le bracelet est authentique — sans jamais toucher au mot de passe.

---

## Comment ça fonctionne dans notre projet

### Le flow complet (Authorization Code + PKCE)

```
Mobile                        Keycloak                      API NestJS
  |                               |                              |
  |-- (1) ouverture navigateur -->|                              |
  |       avec code_challenge     |                              |
  |                               |                              |
  |<-- (2) page login Keycloak ---|                              |
  |    (l'utilisateur saisit      |                              |
  |     ses identifiants)         |                              |
  |                               |                              |
  |<-- (3) redirection avec ------| (code à usage unique)        |
  |        ?code=XXXX             |                              |
  |                               |                              |
  |-- (4) échange code + -------->|                              |
  |        code_verifier          |                              |
  |                               |                              |
  |<-- (5) access_token (JWT) ----|                              |
  |        stocké dans SecureStore|                              |
  |                               |                              |
  |-- (6) GET /recipes -----------+----------------------------->|
  |        Authorization: Bearer <token>                         |
  |                               |<-- (7) vérifie signature ----|
  |                               |        via JWKS              |
  |<-----------------------------------------------200 OK -------|
```

**Pourquoi PKCE ?** C'est la méthode recommandée pour les apps mobiles : elle n'utilise pas de secret client (impossible à cacher dans une app mobile), et protège contre l'interception du code d'autorisation.

### Côté mobile (`apps/mobile/contexts/AuthContext.tsx`)

- Gère l'état d'authentification global (token, user, isLoading)
- Au démarrage : relit le token depuis le stockage chiffré de l'appareil (`expo-secure-store`)
- `signIn()` : lance le flow PKCE via `expo-auth-session`, récupère le token
- `signOut()` : supprime le token du stockage
- Les URLs Keycloak sont lues depuis les **variables d'environnement** (`apps/mobile/.env`)

### Côté API (`apps/api/src/auth/`)

- `JwtAuthGuard` est un **guard global** : toutes les routes sont protégées par défaut
- La validation du token se fait via **JWKS** : l'API récupère la clé publique de Keycloak et vérifie la signature RS256 du JWT — sans stocker de secret
- Deux décorateurs disponibles dans les controllers :
  - `@Public()` — pour rendre une route accessible sans token
  - `@CurrentUser()` — pour injecter les infos de l'utilisateur connecté (`userId`, `email`, `username`, `roles`)

---

## Setup local — ce que tu dois faire

### Prérequis

- `make up` qui fonctionne (Docker en cours d'exécution)
- Les fichiers `.env` configurés (voir ci-dessous)

---

### Étape 1 — Configurer les `.env`

#### `.env` (racine du projet)

```bash
cp .env.example .env
```

Le fichier est déjà correct pour un usage local, rien à modifier.

#### `apps/mobile/.env`

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Là aussi, les valeurs par défaut fonctionnent en local.

---

### Étape 2 — Démarrer Keycloak

```bash
make up
```

Attends ~30 secondes, puis vérifie que Keycloak est accessible :
👉 http://localhost:8080

---

### Étape 3 — Configurer le realm Keycloak

C'est l'étape manuelle, à faire **une seule fois**.

Connecte-toi à la console d'administration :
👉 http://localhost:8080
- Login : `admin`
- Password : `admin`

#### 3.1 Créer le realm

1. Menu déroulant en haut à gauche (à côté de "master") → **Create Realm**
2. **Realm name** : `cook-me` → **Create**

#### 3.2 Créer le client mobile

1. Menu gauche → **Clients** → **Create client**
2. **Client ID** : `cook-me-mobile` → **Next**
3. Configuration :
   - Client authentication : ❌ OFF
   - Standard flow : ✅ ON
   - Direct access grants : ❌ OFF
4. **Next** → Login settings :
   - Valid redirect URIs : `mobile://auth/callback` et `exp://localhost:8081`
   - Valid post logout redirect URIs : `mobile://*`
   - Web origins : `*`
5. **Save**
6. Onglet **Advanced** → **Proof Key for Code Exchange** → `S256` → **Save**

#### 3.3 Créer le client API

1. **Clients** → **Create client**
2. **Client ID** : `cook-me-api` → **Next**
3. Tout désactiver (bearer-only, il ne fait que valider les tokens) → **Save**

#### 3.4 Créer un utilisateur de test

1. Menu gauche → **Users** → **Add user**
2. Remplir :
   - Username : `testuser`
   - Email : `test@cook-me.com`
   - Email verified : ✅ ON
3. **Create**
4. Onglet **Credentials** → **Set password**
   - Password : `password123`
   - Temporary : ❌ OFF
5. **Save**

---

### Étape 4 — Vérifier que ça fonctionne

#### Tester l'API avec un token

```bash
# Obtenir un token (via le grant password pour les tests rapides)
curl -s -X POST http://localhost:8080/realms/cook-me/protocol/openid-connect/token \
  -d "grant_type=password" \
  -d "client_id=cook-me-mobile" \
  -d "username=testuser" \
  -d "password=password123" | jq '.access_token'
```

Copie le token retourné, puis :

```bash
curl http://localhost:3001/recipes \
  -H "Authorization: Bearer <token>"
# → doit retourner 200

curl http://localhost:3001/recipes
# → doit retourner 401
```

#### Tester depuis le mobile

```bash
make mobile   # ou make tunnel sur réseau restreint
```

1. L'écran de login s'affiche
2. Clique sur **Se connecter avec SSO**
3. Le navigateur s'ouvre sur Keycloak → connecte-toi avec `testuser` / `password123`
4. Tu es redirigé vers l'accueil de l'app

---

## Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `Invalid redirect_uri` | URI de redirection manquante dans Keycloak | Vérifier `mobile://auth/callback` et `exp://localhost:8081` dans les Valid Redirect URIs du client `cook-me-mobile` |
| `401` sur toutes les routes | Token invalide ou expiré | Vérifier que `KEYCLOAK_ISSUER` dans `.env` correspond à l'issuer du token |
| `Connection refused` sur 8080 | Keycloak pas encore démarré | Attendre ~30s après `make up`, vérifier `make ps` |
| `Invalid token` côté API | Issuer du token ≠ `KEYCLOAK_ISSUER` | Vérifier que `.env` et Keycloak utilisent la même URL |
| L'app mobile ne redirige pas | Problème de scheme | Vérifier que `mobile` est bien dans `scheme` dans `app.json` |

---

## Sur mobile physique (réseau restreint)

Si tu testes sur un **téléphone physique** ou que tu es sur un réseau d'école/entreprise :

1. Utilise `make tunnel` pour lancer Expo
2. Remplace les URLs `localhost` dans `apps/mobile/.env` par tes URLs Cloudflare (ou l'IP locale de ta machine)
3. Dans la console Keycloak : **Realm Settings** → **General** → **Frontend URL** → renseigne ton URL Cloudflare Keycloak
4. Redémarre l'API (`make down && make up`) pour qu'elle recharge le `.env`
