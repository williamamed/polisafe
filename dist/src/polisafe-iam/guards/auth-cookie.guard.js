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
exports.AuthCookieGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const key_service_1 = require("../services/key.service");
let AuthCookieGuard = class AuthCookieGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        request['sso'] = {
            auth: false,
            payload: null
        };
        try {
            let jwt = this.jwtService.decode(token, { complete: true });
            const key = await this.keyService.getKey(jwt.header.kid);
            const payload = await this.jwtService.verifyAsync(token, {
                publicKey: key.publicKeyPem
            });
            request['sso'] = {
                auth: true,
                payload: payload
            };
        }
        catch (error) {
            console.log(error);
        }
        return true;
    }
    extractTokenFromHeader(request) {
        if (request.cookies && request.cookies['AuthToken']) {
            return request.cookies['AuthToken'];
        }
        return undefined;
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthCookieGuard = AuthCookieGuard;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], AuthCookieGuard.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", key_service_1.KeyService)
], AuthCookieGuard.prototype, "keyService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], AuthCookieGuard.prototype, "configService", void 0);
exports.AuthCookieGuard = AuthCookieGuard = __decorate([
    (0, common_1.Injectable)()
], AuthCookieGuard);
//# sourceMappingURL=auth-cookie.guard.js.map