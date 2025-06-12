# Etapa 1: Construcción de la aplicación
FROM node:24-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --force

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servir archivos estáticos con Nginx
FROM nginx:stable-alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos generados
COPY --from=builder /app/out/ /usr/share/nginx/html

# Exponer el puerto 81
EXPOSE 81

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
