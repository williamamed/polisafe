"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPermission = exports.RootBusiness = exports.UserToken = exports.Permission = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../guards/auth.guard");
const claims_guard_1 = require("../guards/claims.guard");
const api_guard_1 = require("../guards/api.guard");
const Permission = (...args) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('permission', args), (0, common_1.UseGuards)(auth_guard_1.AuthGuard), (0, common_1.UseGuards)(claims_guard_1.ClaimsGuard));
};
exports.Permission = Permission;
exports.UserToken = (0, common_1.createParamDecorator)((data, context) => {
    const user = context.switchToHttp().getRequest().user;
    if (!user)
        throw new common_1.NotAcceptableException();
    return user;
});
exports.RootBusiness = (0, common_1.createParamDecorator)((data, context) => {
    const user = context.switchToHttp().getRequest().rootBusiness;
    if (!user)
        throw new common_1.NotAcceptableException();
    return user;
});
const ApiPermission = (...args) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('permission', args), (0, common_1.UseGuards)(api_guard_1.ApiGuard));
};
exports.ApiPermission = ApiPermission;
//# sourceMappingURL=permission.decorator.js.map