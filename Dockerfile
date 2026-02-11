FROM node:24.11.1-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY . /app

FROM build AS build-prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS dev-api
CMD ["bash", "-c", "pnpm i && pnpm --filter=@cook-me/api dev"]

FROM base AS dev-enricher
CMD ["bash", "-c", "pnpm i && pnpm --filter=@cook-me/enricher dev"]

FROM base AS dev-aiworker
CMD ["bash", "-c", "pnpm i && pnpm --filter=@cook-me/aiworker dev"]
