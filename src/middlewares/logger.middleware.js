const morgan = require("morgan");

const loggerMiddleware = (app) => {
    app.use(morgan("combined"));
};

module.exports = loggerMiddleware;
