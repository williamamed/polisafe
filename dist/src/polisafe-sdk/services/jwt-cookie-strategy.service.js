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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtCookieStrategyService = void 0;
const passport_jwt_1 = require("passport-jwt");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const jwksClient = require("jwks-rsa");
const config_1 = require("@nestjs/config");
const config_polizei_1 = require("../config.polizei");
let JwtCookieStrategyService = class JwtCookieStrategyService extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-cookie') {
    constructor(options) {
        super({
            secretOrKeyProvider: async (request, rawJwtToken, done) => {
                try {
                    let jwt = this.jwtService.decode(rawJwtToken, { complete: true });
                    if (!jwt)
                        throw new Error();
                    const decodedToken = jwt.payload;
                    let tenantId = null;
                    if (decodedToken.tid)
                        tenantId = decodedToken.tid;
                    if (decodedToken.tenantId)
                        tenantId = decodedToken.tenantId;
                    if (!tenantId) {
                        return done(new Error('No tenant identifier found in token'), null);
                    }
                    const jwksUri = `${this.options.serviceUrl}/polisafe/openid/${tenantId}/certs`;
                    console.log(`(Cookie) Obteniendo clave JWKS para tenant: ${tenantId}, URI: ${jwksUri}`);
                    const client = jwksClient({
                        jwksUri: jwksUri,
                        cache: true,
                        rateLimit: true,
                        jwksRequestsPerMinute: 5
                    });
                    const decodedHeader = jwt.header;
                    const kid = decodedHeader.kid;
                    if (!kid) {
                        return done(new Error('No kid found in token header'), null);
                    }
                    client.getSigningKey(kid, (err, key) => {
                        if (err) {
                            console.error(`(Cookie) Error obteniendo clave para tenant ${tenantId}:`, err);
                            return done(err, null);
                        }
                        const publicKey = key.getPublicKey();
                        done(null, publicKey);
                    });
                }
                catch (error) {
                    console.error('Error en secretOrKeyProvider:', error);
                    done(error, null);
                }
            },
            jwtFromRequest: (request) => {
                let client_id;
                if (request.query.client_id) {
                    client_id = request.query.client_id;
                }
                if (request.query.clientId) {
                    client_id = request.query.clientId;
                }
                if (request.body.client_id) {
                    client_id = request.body.client_id;
                }
                if (request.body.clientId) {
                    client_id = request.body.clientId;
                }
                return request.cookies['a-' + client_id];
            },
            issuer: `${options.issuer}`
        });
        this.options = options;
    }
    validate(payload, done) {
        if (!payload) {
            done(new common_1.UnauthorizedException(), false);
        }
        return done(null, payload);
    }
};
exports.JwtCookieStrategyService = JwtCookieStrategyService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], JwtCookieStrategyService.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], JwtCookieStrategyService.prototype, "configService", void 0);
exports.JwtCookieStrategyService = JwtCookieStrategyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('POLIZEI_CONFIG_OPTIONS')),
    __metadata("design:paramtypes", [config_polizei_1.ConfigPolizei])
], JwtCookieStrategyService);
//# sourceMappingURL=jwt-cookie-strategy.service.js.map