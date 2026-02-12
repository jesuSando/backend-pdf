require("dotenv").config();

module.exports = {
    port: process.env.PORT,
    dbPath: process.env.DB_PATH,
    adminToken: process.env.ADMIN_TOKEN,
};
