# Etapa 1: Construcción de la aplicación
FROM node:24-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./


# Instalar dependencias
RUN npm install --force

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación y exportar archivos estáticos
RUN npm run build && \
    npm run build:static

# Etapa 2: Servir archivos estáticos con Nginx
FROM nginx:stable-alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear directorio para archivos estáticos
RUN mkdir -p /usr/share/nginx/html

# Copiar los archivos estáticos generados
COPY --from=builder /app/out/ /usr/share/nginx/html
COPY --from=builder /app/public/ /usr/share/nginx/html/

# Configurar permisos
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod 644 /etc/nginx/conf.d/default.conf

# Exponer el puerto 81
EXPOSE 81

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
