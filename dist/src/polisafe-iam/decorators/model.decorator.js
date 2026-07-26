"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamModel = void 0;
const common_1 = require("@nestjs/common");
const IamModel = (...args) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('model-iam', true));
};
exports.IamModel = IamModel;
//# sourceMappingURL=model.decorator.js.map