require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

// Config & Utils
const sequelize = require("./config/database");
const swaggerSpec = require("./config/swagger");
const seeder = require("./utils/seeder"); 
const { noCache } = require("./middleware/authMiddleware");

// Routes Imports
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const eventRoutes = require("./routes/eventRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// --- ROUTES ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "APITubes2 is running",
    data: {
      service: "APITubes2",
      docs: "/docs",
      apispec: "/apispec_1.json"
    }
  });
});

// Swagger
app.get("/apispec_1.json", noCache, (req, res) => res.json(swaggerSpec));
app.use("/docs", noCache, swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "SIMASU API" }));

// --- SERVER START ---
const PORT = process.env.PORT || 5001;

// Init DB & Seeding
sequelize.sync().then(async () => {
  await seeder.runSeed(); // Asumsi Anda memindahkan logika seeding ke utils/seeder.js
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Docs: http://0.0.0.0:${PORT}/docs`);
  });
}).catch((err) => {
  console.error("Gagal init DB:", err);
});