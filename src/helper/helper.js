const hbs = require("hbs");

hbs.registerHelper('ifEq', function (a, b, opts) {
    if (a === b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

module.exports = hbs;