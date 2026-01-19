# Base Node
FROM node:20-bullseye

# Installer pnpm globalement
RUN npm install -g pnpm

# Créer le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/shared-utils/package.json packages/shared-utils/

# Installer les dépendances pour l'API uniquement
RUN pnpm install --filter api...

# Copier le reste du projet
COPY . .

# Se placer dans le dossier API
WORKDIR /app/apps/api

# Exposer le port de l'API
EXPOSE 3001

# Commande pour le développement
CMD ["pnpm", "dev"]
