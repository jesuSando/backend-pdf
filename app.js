const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.disable("x-powered-by");
app.use(helmet());

app.use(express.json({ limit: "5mb" }));


app.use(morgan("combined"));


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "pdf-service",
  });
});


app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
