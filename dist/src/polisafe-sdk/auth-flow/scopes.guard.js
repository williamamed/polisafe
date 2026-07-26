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
exports.ScopesGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
let ScopesGuard = class ScopesGuard {
    constructor(reflector, configService) {
        this.reflector = reflector;
        this.configService = configService;
    }
    async canActivate(context) {
        const permissionMethod = this.reflector.get('permission', context.getHandler());
        const permissionClass = this.reflector.get('permission', context.getClass());
        const tokenTypeMethod = this.reflector.get('grant_user', context.getHandler());
        const tokenTypeClass = this.reflector.get('grant_user', context.getClass());
        const tokenType = tokenTypeMethod ? tokenTypeMethod : tokenTypeClass;
        const request = context.switchToHttp().getRequest();
        const user = request['user'];
        let effectivePerm = permissionMethod ? permissionMethod : permissionClass;
        if (tokenType == 'client' && user.sub != user.client_id) {
            throw new common_1.ForbiddenException(this.configService.get('NODE_ENV') == 'development' ? `Permission denied: only clients tokens allowed` : null);
        }
        if (tokenType == 'user' && user.sub == user.client_id) {
            throw new common_1.ForbiddenException(this.configService.get('NODE_ENV') == 'development' ? `Permission denied: only user tokens allowed` : null);
        }
        let scopesToVerify = effectivePerm.split(' ');
        let scopes = user.scope.split(' ');
        for (const scope of scopesToVerify) {
            if (scopes.indexOf(scope) < 0) {
                if (this.configService.get('NODE_ENV') == 'development')
                    common_1.Logger.error(`Scope: ${scope} permission denied`);
                throw new common_1.ForbiddenException(this.configService.get('NODE_ENV') == 'development' ? `Scope: ${scope} permission denied` : null);
            }
        }
        return true;
    }
};
exports.ScopesGuard = ScopesGuard;
exports.ScopesGuard = ScopesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        config_1.ConfigService])
], ScopesGuard);
//# sourceMappingURL=scopes.guard.js.map