# Etapa 1: build
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Etapa 2: producción
FROM node:24-alpine

WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
RUN npm install --omit=dev --force && \
    npm cache clean --force

ENV PORT=3000
EXPOSE 3000

# Crear usuario no root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

USER nextjs

CMD ["npm", "start"]
