const helmet = require("helmet");
const cors = require("cors");

const securityMiddleware = (app) => {
    app.disable("x-powered-by");

    app.use(helmet());

    app.use(
        cors({
            origin: "*", // permite todos los orígenes
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );
};

module.exports = securityMiddleware;
