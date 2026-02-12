const express = require("express");
const path = require("path");

const securityMiddleware = require("./middlewares/security.middleware");
const loggerMiddleware = require("./middlewares/logger.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const templateRoutes = require("./routes/template.routes");
const pdfRoutes = require("./routes/pdf.routes");

const app = express();

securityMiddleware(app);

app.use(express.json({ limit: "5mb" }));

loggerMiddleware(app);

app.use("/admin", express.static(path.join(__dirname, "public")));

app.use("/templates", templateRoutes);
app.use("/generate", pdfRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "pdf-service",
  });
});

app.use(errorMiddleware);

module.exports = app;
