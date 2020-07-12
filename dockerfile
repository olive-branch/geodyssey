FROM node:alpine AS install
    WORKDIR /build
    COPY package.json package-lock.json ./
    COPY ./src/api/package.json ./src/api/package-lock.json ./src/api/
    RUN npm ci

FROM node:alpine AS build
    WORKDIR /build
    COPY --from=install /build/ .
    COPY . .
    RUN npm run build:server
    RUN npm run build -- --dest ./dist/static
    RUN cp -r ./src/api/dist/* ./dist && \
        cp -r ./src/api/node_modules ./dist && \
        cp -r ./sql ./dist

FROM node:alpine
    EXPOSE 80
    WORKDIR /app
    COPY --from=build /build/dist .
    ENTRYPOINT ["node", "main", "run", "server", "--port", "80"]
