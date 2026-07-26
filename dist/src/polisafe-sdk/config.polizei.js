"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigPolizei = exports.ModeType = void 0;
exports.ModeType = {
    PRODUCTION: "production",
    DEVELOPMENT: "development"
};
class ConfigPolizei {
    constructor() {
        this.mode = "development";
        this.logging = false;
        this.permissionCheck = true;
        this.checkProviderPermissions = true;
    }
}
exports.ConfigPolizei = ConfigPolizei;
//# sourceMappingURL=config.polizei.js.map