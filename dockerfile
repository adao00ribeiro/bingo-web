# Etapa 1: Build do web
FROM node:20-alpine AS build-bingo-web
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
    && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Etapa de produção com Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
