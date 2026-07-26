"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInfo = exports.UserToken = exports.Scope = exports.Permission = void 0;
const common_1 = require("@nestjs/common");
const tenant_guard_1 = require("../guards/auth-flow/tenant.guard");
const privileges_guard_1 = require("../guards/auth-flow/privileges.guard");
const auth_jwt_guard_1 = require("../guards/auth-jwt.guard");
const scopes_guard_1 = require("../guards/auth-flow/scopes.guard");
const Permission = (...args) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('permission', args), (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthGuard), (0, common_1.UseGuards)(tenant_guard_1.TenantGuard), (0, common_1.UseGuards)(privileges_guard_1.PrivilegesGuard));
};
exports.Permission = Permission;
const Scope = (args) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('permission', args), (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthGuard), (0, common_1.UseGuards)(tenant_guard_1.TenantGuard), (0, common_1.UseGuards)(scopes_guard_1.ScopesGuard));
};
exports.Scope = Scope;
exports.UserToken = (0, common_1.createParamDecorator)((data, context) => {
    const user = context.switchToHttp().getRequest().user;
    if (!user)
        throw new common_1.NotAcceptableException();
    return user;
});
exports.TokenInfo = (0, common_1.createParamDecorator)((data, context) => {
    const user = context.switchToHttp().getRequest().user;
    if (!user)
        throw new common_1.NotAcceptableException("No polisafe access token found");
    return user;
});
//# sourceMappingURL=permission.decorator.js.map