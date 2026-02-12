require("dotenv").config();
const express = require("express");

const app = express();

// Middlewares básicos
app.use(express.json({ limit: "5mb" }));

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        message: "PDF Service is running 🚀",
    });
});

// Puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
