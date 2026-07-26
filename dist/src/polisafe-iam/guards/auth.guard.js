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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const key_service_1 = require("../services/key.service");
const config_1 = require("@nestjs/config");
let AuthGuard = class AuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException();
        }
        try {
            let jwt = this.jwtService.decode(token, { complete: true });
            const keys = await this.keyService.getLastActiveKeys(jwt.payload.tid);
            let key;
            while (key = keys.pop()) {
                if (key.kid == jwt.header.kid) {
                    try {
                        const payload = await this.jwtService.verifyAsync(token, {
                            publicKey: key.publicKeyPem,
                            issuer: this.configService.get('PLS_PUBLIC_URL')
                        });
                        this.validatePayload(payload);
                        request['user'] = payload;
                        request['token'] = payload;
                        payload.tenant = this.getActiveTenant(request);
                        return true;
                    }
                    catch (error) {
                        throw error;
                    }
                }
            }
            throw new common_1.UnauthorizedException("No active key found");
        }
        catch (err) {
            throw new common_1.UnauthorizedException(this.configService.get('NODE_ENV') == 'development' ? err.message : '');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    getActiveTenant(request) {
        let tenants = request.user.tenantsId;
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
    validatePayload(payload) {
    }
};
exports.AuthGuard = AuthGuard;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], AuthGuard.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", key_service_1.KeyService)
], AuthGuard.prototype, "keyService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], AuthGuard.prototype, "configService", void 0);
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)()
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map