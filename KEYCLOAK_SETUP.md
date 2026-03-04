# 🔐 Guide de Configuration Keycloak pour Cook-Me

Ce guide vous accompagne dans la configuration de Keycloak pour l'authentification SSO de votre application Cook-Me.

---

## 📋 Prérequis

- Docker et Docker Compose installés
- Ports 8080 (Keycloak) et 3001 (API) disponibles

---

## 🚀 Étape 1 : Démarrer Keycloak

```bash
# Depuis la racine du projet
docker-compose up -d keycloak postgres-keycloak
```

Attendez ~30 secondes que Keycloak démarre, puis accédez à :
👉 **http://localhost:8080**

---

## 🔑 Étape 2 : Connexion Admin

1. Cliquez sur **Administration Console**
2. Connectez-vous avec :
   - **Username** : `admin`
   - **Password** : `admin`

---

## 🏰 Étape 3 : Créer le Realm "cook-me"

1. En haut à gauche, cliquez sur le menu déroulant à côté de **"master"**
2. Cliquez sur **"Create Realm"**
3. Remplissez :
   - **Realm name** : `cook-me`
   - **Enabled** : ✅ ON
4. Cliquez sur **"Create"**

---

## 📱 Étape 4 : Créer le Client Mobile

### 4.1 Créer le client

1. Dans le menu de gauche, cliquez sur **"Clients"**
2. Cliquez sur **"Create client"**
3. Remplissez :
   - **Client type** : `OpenID Connect`
   - **Client ID** : `cook-me-mobile`
4. Cliquez sur **"Next"**

### 4.2 Configurer le client mobile

**Capability config :**
- **Client authentication** : ❌ OFF (public client)
- **Authorization** : ❌ OFF
- **Standard flow** : ✅ ON (Authorization Code)
- **Direct access grants** : ❌ OFF (pas de mot de passe en clair)

Cliquez sur **"Next"**

### 4.3 Configurer les redirects

**Login settings :**
- **Valid redirect URIs** :
  ```
  mobile://auth/callback
  exp://localhost:8081
  ```
- **Valid post logout redirect URIs** : `mobile://*`
- **Web origins** : `*`

Cliquez sur **"Save"**

### 4.4 Activer PKCE (important !)

1. Dans l'onglet **"Advanced"** du client `cook-me-mobile`
2. Trouvez **"Proof Key for Code Exchange Code Challenge Method"**
3. Sélectionnez : `S256`
4. Cliquez sur **"Save"**

---

## 🖥️ Étape 5 : Créer le Client API

### 5.1 Créer le client

1. Retournez dans **"Clients"** → **"Create client"**
2. Remplissez :
   - **Client type** : `OpenID Connect`
   - **Client ID** : `cook-me-api`
3. Cliquez sur **"Next"**

### 5.2 Configurer le client API

**Capability config :**
- **Client authentication** : ❌ OFF (bearer-only)
- **Authorization** : ❌ OFF
- **Standard flow** : ❌ OFF
- **Service accounts roles** : ❌ OFF

Cliquez sur **"Save"**

> ℹ️ L'API ne fait que **valider** les tokens, elle ne les génère pas.

---

## 👤 Étape 6 : Créer un utilisateur de test

### 6.1 Créer l'utilisateur

1. Dans le menu de gauche, cliquez sur **"Users"**
2. Cliquez sur **"Add user"**
3. Remplissez :
   - **Username** : `testuser`
   - **Email** : `test@cook-me.com`
   - **First name** : `Test`
   - **Last name** : `User`
   - **Email verified** : ✅ ON
   - **Enabled** : ✅ ON
4. Cliquez sur **"Create"**

### 6.2 Définir un mot de passe

1. Dans l'utilisateur créé, cliquez sur l'onglet **"Credentials"**
2. Cliquez sur **"Set password"**
3. Remplissez :
   - **Password** : `password123`
   - **Password confirmation** : `password123`
   - **Temporary** : ❌ OFF (pour éviter de devoir changer le mot de passe)
4. Cliquez sur **"Save"**

---

## ✅ Étape 7 : Vérification de la configuration

### 7.1 Vérifier les endpoints OIDC

Accédez à :
```
http://localhost:8080/realms/cook-me/.well-known/openid-configuration
```

Vous devriez voir un JSON avec les endpoints suivants :
- `authorization_endpoint`
- `token_endpoint`
- `jwks_uri`

### 7.2 Tester depuis Swagger (API)

1. Démarrez l'API : `docker-compose up api`
2. Accédez à : http://localhost:3001/api
3. Cliquez sur **"Authorize"** (cadenas vert)
4. Pour obtenir un token de test, utilisez un outil comme Postman ou curl :

```bash
curl -X POST http://localhost:8080/realms/cook-me/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=cook-me-mobile" \
  -d "username=testuser" \
  -d "password=password123"
```

5. Copiez le `access_token` retourné
6. Collez-le dans Swagger et testez une route protégée (ex: GET `/recipes`)

### 7.3 Tester depuis le mobile

1. Démarrez l'app mobile : `cd apps/mobile && npx expo start`
2. Vous devriez voir l'écran de login
3. Cliquez sur **"Se connecter avec SSO"**
4. Entrez : `testuser` / `password123`
5. Vous devriez être redirigé vers l'accueil

---

## 🎨 (Optionnel) Personnaliser le thème Keycloak

1. Dans **Realm settings** → **Themes**
2. Changez **Login theme** pour un thème plus joli
3. Ou créez votre propre thème (voir doc Keycloak)

---

## 🔧 Variables d'environnement à vérifier

### `.env` (racine du projet)
```bash
KEYCLOAK_ISSUER=http://localhost:8080/realms/cook-me
KEYCLOAK_CLIENT_ID=cook-me-api
```

### `apps/mobile/.env`
```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_KEYCLOAK_ISSUER=http://localhost:8080/realms/cook-me
EXPO_PUBLIC_KEYCLOAK_CLIENT_ID=cook-me-mobile
```

---

## 🐛 Troubleshooting

### Problème : "Invalid redirect_uri"
➡️ Vérifiez que `mobile://auth/callback` est bien dans les **Valid redirect URIs** du client mobile.

### Problème : "Invalid token" côté API
➡️ Vérifiez que `KEYCLOAK_ISSUER` dans `.env` correspond bien à `http://localhost:8080/realms/cook-me`.

### Problème : Keycloak ne démarre pas
➡️ Vérifiez que Postgres est bien démarré : `docker-compose ps postgres-keycloak`.

### Problème : CORS depuis le mobile
➡️ Vérifiez que `Web origins = *` est configuré dans le client mobile.

---

## 📚 Ressources supplémentaires

- [Documentation Keycloak](https://www.keycloak.org/documentation)
- [OIDC avec PKCE expliqué](https://oauth.net/2/pkce/)
- [Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)

---

## 🎉 Félicitations !

Votre SSO Keycloak est maintenant configuré ! Vous pouvez :
- ✅ Vous connecter depuis le mobile avec SSO
- ✅ Appeler l'API avec un token JWT valide
- ✅ Tester depuis Swagger avec Bearer token
- ✅ Gérer les utilisateurs depuis Keycloak

**Prochaines étapes suggérées :**
- Ajouter des rôles (admin, user) dans Keycloak
- Implémenter le refresh token côté mobile
- Configurer le HTTPS en production
