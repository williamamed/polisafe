"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeOfUser = exports.GetScopeOfUser = void 0;
const common_1 = require("@nestjs/common");
const scope_guard_1 = require("./scope.guard");
exports.GetScopeOfUser = (0, common_1.createParamDecorator)((id, context) => {
    const listBusiness = context.switchToHttp().getRequest().user.scopes;
    if (!listBusiness || listBusiness.length == 0)
        throw new common_1.NotAcceptableException("No existen negocios en el token del usuario");
    let request = context.switchToHttp().getRequest();
    let value = '';
    let key = '';
    if (typeof id == 'string') {
        key = id;
        value = request.query[id];
    }
    else {
        key = id.id;
        value = request[id.type][id.id];
    }
    if (value) {
        let index = listBusiness.indexOf(parseInt(value));
        if (index >= 0)
            return listBusiness.at(index);
    }
    throw new common_1.NotAcceptableException("No se encontro el atributo `" + key + "` en la query de esta peticion");
});
const ScopeOfUser = (attr) => {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)('datascope', attr), (0, common_1.UseGuards)(scope_guard_1.ScopeGuard));
};
exports.ScopeOfUser = ScopeOfUser;
//# sourceMappingURL=scope.decorator.js.map