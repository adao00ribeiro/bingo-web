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
RUN rm -rf /etc/nginx/conf.d
RUN mkdir -p /etc/nginx/conf.d
COPY --from=build-bingo-web /app/dist/bingo-web/browser /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf
COPY mime.types /etc/nginx/mime.types
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
