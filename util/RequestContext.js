// request-context.js
const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

const RequestContext = {
    run: (req, fn) => {
        asyncLocalStorage.run({ req }, fn);
    },
    get: () => asyncLocalStorage.getStore(),
};

module.exports = RequestContext;
