FROM node:20-bullseye

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/shared-utils/package.json packages/shared-utils/

RUN pnpm install --filter api...

COPY . .

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["pnpm", "dev"]
