"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapTenant = exports.TokenInfo = exports.UserToken = exports.Scope = exports.Permission = void 0;
const common_1 = require("@nestjs/common");
const tenant_guard_1 = require("../auth-flow/tenant.guard");
const privileges_guard_1 = require("../auth-flow/privileges.guard");
const auth_jwt_guard_1 = require("../guards/auth-jwt.guard");
const scopes_guard_1 = require("../auth-flow/scopes.guard");
const Permission = (name, config) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('permission', name), (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthGuard), (0, common_1.UseGuards)(tenant_guard_1.TenantGuard), (0, common_1.UseGuards)(privileges_guard_1.PrivilegesGuard));
};
exports.Permission = Permission;
const Scope = (args, token_type) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('permission', args), (0, common_1.SetMetadata)('grant_user', token_type), (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthGuard), (0, common_1.UseGuards)(tenant_guard_1.TenantGuard), (0, common_1.UseGuards)(scopes_guard_1.ScopesGuard));
};
exports.Scope = Scope;
exports.UserToken = (0, common_1.createParamDecorator)((data, context) => {
    const user = context.switchToHttp().getRequest().user;
    if (!user)
        throw new common_1.NotAcceptableException();
    user.id = Number(user.sub);
    user.username = user.preferred_username;
    user.is_client = user.sub == user.client_id;
    return user;
});
exports.TokenInfo = (0, common_1.createParamDecorator)((data, context) => {
    const user = context.switchToHttp().getRequest().user;
    if (!user)
        throw new common_1.NotAcceptableException("No polisafe access token found");
    user.id = Number(user.sub);
    user.username = user.preferred_username;
    user.is_client = user.sub == user.client_id;
    return user;
});
exports.MapTenant = (0, common_1.createParamDecorator)((id, context) => {
    const listBusiness = context.switchToHttp().getRequest().user.tenants;
    if (!listBusiness || listBusiness.length == 0)
        throw new common_1.NotAcceptableException("No existen negocios en el token del usuario");
    let request = context.switchToHttp().getRequest();
    let value = null;
    let key = typeof id == 'string' ? id : id.type;
    if (typeof id == 'string') {
        switch (request.method) {
            case 'POST': {
                value = request.body[key];
                break;
            }
            case 'PUT': {
                value = request.body[key];
                break;
            }
            case 'PATCH': {
                value = request.body[key];
                break;
            }
            case 'DELETE': {
                value = request.body[key];
                break;
            }
            case 'GET': {
                value = request.query[key];
                break;
            }
            default: {
            }
        }
    }
    else {
        value = request[id.type][key];
    }
    if (value) {
        let index = listBusiness.indexOf(String(value));
        if (index >= 0)
            return listBusiness.at(index);
    }
    throw new common_1.NotAcceptableException("No se encontro el atributo `" + key + "` en esta peticion");
});
//# sourceMappingURL=permission.decorator.js.map