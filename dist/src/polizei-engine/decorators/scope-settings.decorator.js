"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnSettings = void 0;
const common_1 = require("@nestjs/common");
const OnSettings = () => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('settings-save', true));
};
exports.OnSettings = OnSettings;
//# sourceMappingURL=scope-settings.decorator.js.map