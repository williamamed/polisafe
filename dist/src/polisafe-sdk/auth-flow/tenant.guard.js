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
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TenantGuard = class TenantGuard {
    async canActivate(context) {
        const user = context.switchToHttp().getRequest().user;
        try {
            user.tenant = this.getActiveTenant(context.switchToHttp().getRequest());
            return true;
        }
        catch (err) {
            throw new common_1.UnauthorizedException(this.configService.get('NODE_ENV') == 'development' ? err.message : '');
        }
    }
    getActiveTenant(request) {
        let tenants = request.user.tenants;
        if (tenants && tenants.length > 0) {
            let tenantId = request.header('X-Tenant') ? request.header('X-Tenant') : tenants[0];
            let found = tenants.filter((tnt) => {
                return tnt == tenantId;
            });
            if (found.length == 0)
                throw new common_1.UnauthorizedException("Tenant boundaries out of scope");
            return tenantId;
        }
        return null;
    }
};
exports.TenantGuard = TenantGuard;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], TenantGuard.prototype, "configService", void 0);
exports.TenantGuard = TenantGuard = __decorate([
    (0, common_1.Injectable)()
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map