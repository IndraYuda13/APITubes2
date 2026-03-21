# Project Structure

## Entry point

- `server.js`
  - loads environment variables
  - initializes Express middleware
  - mounts API routes
  - exposes Swagger docs
  - syncs Sequelize models and runs seeding before listening

## Config

- `config/database.js`
  - Sequelize database configuration
- `config/swagger.js`
  - swagger-jsdoc / Swagger UI document builder

## Middleware

- `middleware/authMiddleware.js`
  - auth-related helpers including token verification and cache-control helper usage seen in `server.js`

## Controllers

Business logic is organized by domain:

- `controllers/authController.js`
- `controllers/inventoryController.js`
- `controllers/bookingController.js`
- `controllers/roomController.js`
- `controllers/eventController.js`
- `controllers/announcementController.js`

## Models

The current source tree includes Sequelize models for:

- `User`
- `Inventory`
- `Booking`
- `Room`
- `Event`
- `Announcement`

## Routes

Route definitions are split per domain:

- `routes/authRoutes.js`
- `routes/inventoryRoutes.js`
- `routes/bookingRoutes.js`
- `routes/roomRoutes.js`
- `routes/eventRoutes.js`
- `routes/announcementRoutes.js`

## Utilities

- `utils/seeder.js`
  - seed/init helper executed during startup

## Public showcase scope

This repository is intentionally documented as a source showcase first. Runtime-only items such as uploads, local DB files, and private env values are excluded from the public copy.
