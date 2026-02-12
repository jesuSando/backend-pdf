const helmet = require("helmet");

const securityMiddleware = (app) => {
    app.disable("x-powered-by");
    app.use(helmet());
};

module.exports = securityMiddleware;
