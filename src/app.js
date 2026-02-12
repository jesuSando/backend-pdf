const express = require("express");

const securityMiddleware = require("./middlewares/security.middleware");
const loggerMiddleware = require("./middlewares/logger.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

securityMiddleware(app);

app.use(express.json({ limit: "5mb" }));

loggerMiddleware(app);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "pdf-service",
  });
});

app.use(errorMiddleware);

module.exports = app;
