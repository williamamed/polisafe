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
exports.PrivilegesGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const config_polizei_1 = require("../config.polizei");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let PrivilegesGuard = class PrivilegesGuard {
    async canActivate(context) {
        const permissionMethod = this.reflector.get('permission', context.getHandler());
        const permissionClass = this.reflector.get('permission', context.getClass());
        const request = context.switchToHttp().getRequest();
        const user = request['user'];
        let effectivePerm = permissionMethod ? permissionMethod : permissionClass;
        if (!this.options.permissionCheck) {
            return true;
        }
        if (user.permissions && !this.options.checkProviderPermissions) {
            let perm = user.permissions.find((route) => {
                if (effectivePerm) {
                    return effectivePerm == route.name && (route.type == null || request.method == route.type);
                }
                else {
                    return request.route.path == route.name && (route.type == null || request.method == route.type);
                }
            });
            if (perm)
                return perm;
        }
        if (this.options.checkProviderPermissions) {
            try {
                await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.options.serviceUrl}/polizei/io/authorization`, {
                    url: effectivePerm ? effectivePerm : request.route.path,
                    method: request.method,
                    sub: user.sub
                }, {
                    headers: {
                        'Authorization': `Bearer ${this.options._token}`
                    }
                }));
                return true;
            }
            catch (error) {
                if (this.configService.get('NODE_ENV') == 'development')
                    common_1.Logger.error(`Remote Permission Check: ${effectivePerm ? effectivePerm : request.route.path} permission denied, ${error.message}`, 'Polizei-SDK');
            }
        }
        throw new common_1.ForbiddenException("Denied");
    }
};
exports.PrivilegesGuard = PrivilegesGuard;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], PrivilegesGuard.prototype, "configService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", axios_1.HttpService)
], PrivilegesGuard.prototype, "httpService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", core_1.Reflector)
], PrivilegesGuard.prototype, "reflector", void 0);
__decorate([
    (0, common_1.Inject)('POLIZEI_CONFIG_OPTIONS'),
    __metadata("design:type", config_polizei_1.ConfigPolizei)
], PrivilegesGuard.prototype, "options", void 0);
exports.PrivilegesGuard = PrivilegesGuard = __decorate([
    (0, common_1.Injectable)()
], PrivilegesGuard);
//# sourceMappingURL=privileges.guard.js.map