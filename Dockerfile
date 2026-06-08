FROM node:22-alpine AS build

WORKDIR /app

# Install Bun
RUN apk add --no-cache curl && \
    curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun

# Cache layer : dépendances seules
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-overrides

# Build layer : sources
COPY . .
ENV ASTRO_TELEMETRY_DISABLED=1
RUN bun run build

# ── Production ────────────────────────────────────────────────
FROM nginx:1.30-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
