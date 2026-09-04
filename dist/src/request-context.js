"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const async_hooks_1 = require("async_hooks");
class RequestContext {
    static run(data, callback) {
        this.asyncLocalStorage.run(data, callback);
    }
    static get() {
        return this.asyncLocalStorage.getStore();
    }
    static getIp() {
        return this.get()?.ip;
    }
}
exports.RequestContext = RequestContext;
RequestContext.asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
//# sourceMappingURL=request-context.js.map