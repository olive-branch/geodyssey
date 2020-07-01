FROM node:alpine AS install
    WORKDIR /build
    COPY package.json .
    COPY package-lock.json .
    RUN npm ci

FROM node:alpine AS build
    WORKDIR /build
    COPY --from=install /build/ .
    COPY . .
    RUN npm run build:server
    RUN npm run build -- --dest ./dist/static

FROM node:alpine
    EXPOSE 80
    WORKDIR /app

    COPY --from=build /build/sql ./sql
    COPY --from=build /build/dist .
    COPY --from=build /build/node_modules ./node_modules
    ENTRYPOINT ["node", "main", "run", "server", "--port", "80"]
