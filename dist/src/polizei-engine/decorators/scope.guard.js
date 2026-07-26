"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let ScopeGuard = class ScopeGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        const data = this.reflector.get('datascope', context.getHandler());
        const request = context.switchToHttp().getRequest();
        try {
            let value = '';
            switch (request.method) {
                case 'POST': {
                    value = request.body[data];
                    break;
                }
                case 'GET': {
                    value = request.query[data];
                    break;
                }
                default: {
                }
            }
            const listBusiness = context.switchToHttp().getRequest().user.scopes;
            if (!listBusiness || listBusiness.length == 0)
                throw new common_1.NotAcceptableException("No existen negocios en el token del usuario");
            if (value) {
                let index = listBusiness.indexOf(parseInt(value));
                if (index >= 0)
                    return true;
            }
            throw new common_1.NotAcceptableException("No se encontro el atributo `" + data + "` en la query de esta peticion");
        }
        catch (error) {
            throw error;
        }
    }
};
exports.ScopeGuard = ScopeGuard;
exports.ScopeGuard = ScopeGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ScopeGuard);
//# sourceMappingURL=scope.guard.js.map