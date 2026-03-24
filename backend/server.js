// Load environment variables if dotenv is available (optional on hosted platforms)
try {
  // eslint-disable-next-line global-require
  require("dotenv").config();
} catch (err) {
  // dotenv may not be installed in some deployment environments where env vars
  // are provided by the platform (e.g., Render). Fail silently.
}

// Global error handlers - must be set up early
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const apiRoutes = require("./src/routes/api");
const errorHandler = require("./src/middleware/errorHandler");
const { sequelize } = require("./src/models");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Code Copilot API Docs",
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection and server start with retry logic
const startServer = async () => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 2000; // 2 seconds
  let retryCount = 0;

  const connectDatabase = async () => {
    try {
      console.log(`🔄 Database connection attempt ${retryCount + 1}/${MAX_RETRIES}...`);
      
      // Test database connection
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully");

      // Sync models (in development only)
      if (process.env.NODE_ENV === "development") {
        await sequelize.sync({ alter: false });
        console.log("✅ Database models synchronized");
      }

      return true;
    } catch (error) {
      retryCount++;
      console.error(`❌ Database connection failed (attempt ${retryCount}/${MAX_RETRIES}):`, error.message);
      
      if (retryCount >= MAX_RETRIES) {
        console.error("❌ Max retries reached. Unable to connect to database.");
        return false;
      }

      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDatabase();
    }
  };

  try {
    const dbConnected = await connectDatabase();
    
    if (!dbConnected) {
      console.error("❌ Failed to establish database connection after retries. Exiting...");
      process.exit(1);
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown handlers
    process.on("SIGTERM", () => {
      console.log("📛 SIGTERM received - closing server gracefully...");
      server.close(() => {
        console.log("✅ Server closed");
        sequelize.close();
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("📛 SIGINT received - closing server gracefully...");
      server.close(() => {
        console.log("✅ Server closed");
        sequelize.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Unexpected error during server startup:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
