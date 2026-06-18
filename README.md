# APITubes2

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)
![Docs](https://img.shields.io/badge/API-Swagger-85EA2D?logo=swagger&logoColor=222)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

Backend API project built with Node.js and Express for application workflows such as authentication, rooms, bookings, inventory, events, announcements, and file uploads.

This repository is a cleaned public showcase extracted from a private deployment-oriented project. The goal is to present the actual source structure and API flow without exposing local runtime state such as private `.env` values, local SQLite artifacts, or upload contents.

## Highlights

- Express-based REST API backend
- modular route/controller/model structure
- JWT-oriented authentication flow
- Sequelize + SQLite local persistence path
- Swagger UI documentation in-source
- safe public packaging with `.env.example` and runtime exclusions

## Route groups

Current route mounts in `server.js`:

- `/api` - authentication and user-related routes
- `/api/inventory` - inventory routes
- `/api/bookings` - booking routes
- `/api/rooms` - room routes
- `/api/events` - event routes
- `/api/announcements` - announcement routes
- `/uploads` - static upload serving
- `/docs` - Swagger UI

## Tech stack

- Node.js
- Express
- Sequelize
- SQLite
- JWT
- Multer
- Swagger UI / swagger-jsdoc

## Repository contents

Key folders and files:

- `server.js`
- `config/`
- `controllers/`
- `middleware/`
- `models/`
- `routes/`
- `utils/`
- `docs/`
- `.env.example`

## Quick start

### 1. Install dependencies
```bash
npm install
```

### 2. Prepare environment
```bash
cp .env.example .env
```

Current public example variables:
- `JWT_SECRET_KEY`
- `PORT`

### 3. Run the server
```bash
npm start
```

### 4. Run tests
```bash
npm test
```

### 5. Open the docs
Typical local URLs:

```text
http://localhost:5000/docs
http://localhost:5000/apispec_1.json
```

## Documentation

- `docs/QUICKSTART.md`
- `docs/API_OVERVIEW.md`
- `docs/PROJECT_STRUCTURE.md`

## Public packaging notes

This public version intentionally excludes:

- private `.env` values
- local database files
- upload contents
- logs and deployment-only artifacts

## Status

Current state: **public showcase candidate**.

That means the repo is already presentable as a backend/API portfolio item, while still open to future cleanup, tests, and documentation expansion.
