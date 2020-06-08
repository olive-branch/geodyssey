# Geodyssey

Basic CRUD-application for measurment instrument management.

Stack:

* Frontend: vuejs
* Backend: MarbleJS
* DB: postgresql

## Development

To run API use node:

```bash
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
