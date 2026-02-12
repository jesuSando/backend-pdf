require("dotenv").config();
const app = require("./src/app");
const { initializeDatabase } = require("./src/db/database");

const PORT = process.env.PORT || 4000;

// Inicializar BD
initializeDatabase();

app.listen(PORT, () => {
  console.log(`🚀 PDF Service running on http://localhost:${PORT}`);
});
