# API Overview

This document summarizes the main route mounts and runtime expectations discovered from the current source tree.

## Route Mounts

- `/uploads` -> `express`
- `/api` -> `authRoutes`
- `/api/inventory` -> `inventoryRoutes`
- `/api/bookings` -> `bookingRoutes`
- `/api/rooms` -> `roomRoutes`
- `/api/events` -> `eventRoutes`
- `/api/announcements` -> `announcementRoutes`
- `/docs` -> `noCache`

## Environment Variables

The following variables are referenced by the current source code and included in `.env.example`:

- `JWT_SECRET_KEY`
- `PORT`

## Run Commands

- `npm run test` -> `echo "Error: no test specified" && exit 1`
- `npm run start` -> `node server.js`

## Publication Note

This project is being prepared from a private deployment-oriented source tree into a safer public-candidate repository. Runtime-only artifacts are intentionally excluded.
