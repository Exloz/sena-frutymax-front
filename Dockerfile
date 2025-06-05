# syntax=docker/dockerfile:1.6

###########################
# 1. Dependencias de producción
###########################
FROM node:24-alpine AS deps
WORKDIR /app

# Copiamos *solo* los manifest; esto hace que la capa de dependencias
# se invalide sólo cuando cambie uno de estos archivos
COPY package.json package-lock.json ./

# Instala MÓDULOS DE PRODUCCIÓN y usa cache persistente fuera
# de la capa para acelerar futuras builds
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps --force --omit=dev --no-audit --no-fund

###########################
# 2. Build de la app Next.js
###########################
FROM node:24-alpine AS builder
WORKDIR /app

# Traemos node_modules de la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
# Copiamos el resto del código fuente
COPY . .

# Produce el bundle *stand-alone* (desde Next 13.2 —si tu versión lo soporta—)
# Tendrás una carpeta .next/standalone con todo lo necesario para correr.
RUN npm run build \
 && npm prune --omit=dev        # quita dev-deps sobrantes dentro del builder

###########################
# 3. Imagen de producción ultra-ligera
###########################
# Si prefieres seguir en Alpine:
FROM node:24-alpine AS runtime

# --- ajustes mínimos ---
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copiamos sólo lo que necesita la app para arrancar
COPY --from=builder /app/.next/standalone ./           # ejecutables + node_modules
COPY --from=builder /app/.next/static ./static         # estáticos
COPY --from=builder /app/public ./public               # assets públicos

# Creamos usuario no-root
RUN addgroup -S nodegrp && adduser -S -G nodegrp nodeusr
USER nodeusr

EXPOSE 3000
CMD ["node", "server.js"]        # Next genera server.js en la salida standalone
