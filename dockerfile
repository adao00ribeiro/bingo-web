# Etapa 1: Build do web
FROM node:24-alpine AS build-bingo-web
ARG api=${api}
ENV api=${api}
ARG API_WS=${API_WS}
ENV API_WS=${API_WS}
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
    && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run prebuild
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
