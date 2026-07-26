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
exports.JwtAuthCookieGuard = exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt-header') {
    handleRequest(err, user, info, context, status) {
        if (this.configService.get('NODE_ENV') == 'development' && (err || info))
            console.log('Error en Passport:', { err, user, info, status });
        if (!user || err || info) {
            throw err || new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], JwtAuthGuard.prototype, "configService", void 0);
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
let JwtAuthCookieGuard = class JwtAuthCookieGuard extends (0, passport_1.AuthGuard)('jwt-cookie') {
    handleRequest(err, user, info, context, status) {
        return user;
    }
};
exports.JwtAuthCookieGuard = JwtAuthCookieGuard;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], JwtAuthCookieGuard.prototype, "configService", void 0);
exports.JwtAuthCookieGuard = JwtAuthCookieGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthCookieGuard);
//# sourceMappingURL=auth-jwt.guard.js.map