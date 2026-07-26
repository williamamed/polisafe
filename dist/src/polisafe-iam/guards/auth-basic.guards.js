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
exports.AuthBasicGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let AuthBasicGuard = class AuthBasicGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const client = this.decodeBasicAuth(request);
        if (client) {
            request['clientCredentials'] = client;
            request.body.credentials_basic = client;
        }
        else {
            request['clientCredentials'] = null;
        }
        return true;
    }
    decodeBasicAuth(request) {
        const [type, base64Credentials] = request.headers.authorization?.split(' ') ?? [];
        if (type != 'Basic') {
            return null;
        }
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [client_id, client_secret] = credentials.split(':');
        return { client_id, client_secret };
    }
};
exports.AuthBasicGuard = AuthBasicGuard;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], AuthBasicGuard.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], AuthBasicGuard.prototype, "configService", void 0);
exports.AuthBasicGuard = AuthBasicGuard = __decorate([
    (0, common_1.Injectable)()
], AuthBasicGuard);
//# sourceMappingURL=auth-basic.guards.js.map