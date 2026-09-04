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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategyService = void 0;
const passport_jwt_1 = require("passport-jwt");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const key_service_1 = require("./key.service");
const jwt_1 = require("@nestjs/jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const config_1 = require("@nestjs/config");
let JwtStrategyService = class JwtStrategyService extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-header') {
    constructor() {
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
                    const jwksUri = `${this.configService.get('PLS_PUBLIC_URL')}${this.configService.get('APP_PREFIX')}/polisafe/openid/${tenantId}/certs`;
                    console.log(`Obteniendo clave JWKS para tenant: ${tenantId}, URI: ${jwksUri}`);
                    const client = (0, jwks_rsa_1.default)({
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
                            console.error(`Error obteniendo clave para tenant ${tenantId}:`, err);
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
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            issuer: `${process.env.PLS_PUBLIC_URL}`
        });
    }
    validate(payload, done) {
        if (!payload) {
            done(new common_1.UnauthorizedException(), false);
        }
        return done(null, payload);
    }
};
exports.JwtStrategyService = JwtStrategyService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], JwtStrategyService.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", key_service_1.KeyService)
], JwtStrategyService.prototype, "keyService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], JwtStrategyService.prototype, "configService", void 0);
exports.JwtStrategyService = JwtStrategyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtStrategyService);
//# sourceMappingURL=jwt-strategy.service.js.map