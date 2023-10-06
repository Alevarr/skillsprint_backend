const compression = require("compression");
const { default: helmet } = require("helmet")


module.exports = function(app) {
    app.use(helmet());
    app.use(compression);
}