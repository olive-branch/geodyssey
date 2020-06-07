# Geodyssey

Basic CRUD-application for measurment instrument management.

Stack:

* vuejs
* golang
* postgresql

## Development

To run API use golang CLI:

```bash
$ go run ./cmd/server/main.go
```

To run UI use npm (or yarn) inside `./web` directory:

```bash
$ npm install
$ npm start
```

To run database install PostgreSQL or use Docker Compose (inside `./deploy`) directory:

```bash
$ docker-compose up -d
```

Create empty database named `geodyssey`. Tables will be created on API startup.
