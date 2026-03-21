const swaggerJSDoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SIMASU API Documentation",
      description: "API untuk Aplikasi Mobile (User) dan Web Dashboard (Admin)",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        Bearer: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ Bearer: [] }],
  },
  // Arahkan ke file routes untuk membaca dokumentasi
  apis: ["./routes/*.js"], 
});

module.exports = swaggerSpec;