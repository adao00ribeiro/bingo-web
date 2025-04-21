# Etapa 1: Build do web
FROM node:23-alpine AS build-bingo-web
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
    && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Etapa de produção com Nginx
FROM nginx:alpine

COPY --from=build-bingo-web /app/dist/bingo-web/browser /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
