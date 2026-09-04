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
exports.OpenidService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const identity_service_1 = require("./identity.service");
const key_service_1 = require("./key.service");
const dayjs = require("dayjs");
let OpenidService = class OpenidService {
    async getOpenIdClaims(data) {
        const scopesMap = new Map();
        const expiresIn = data.expireIn ? data.expireIn : this.configService.get('PLS_JWT_ACCESS_EXPIRES_IN') || '15m';
        const listScopes = data.scope ? data.scope.split(' ').map((value) => {
            scopesMap.set(value, {});
            return value;
        }) : [];
        let payload = {
            "iss": this.configService.get('PLS_PUBLIC_URL'),
            "sub": data.user.id,
            "aud": data.client.clientId,
        };
        if (data.client.meta && data.client.meta.openid_include_permissions && data.user.roles) {
            payload.permissions = await this.identityService.getModel().getPermissionsByRoles(data.user.roles);
        }
        if (scopesMap.has('openid')) {
            listScopes.map(async (scopeName) => {
                switch (scopeName) {
                    case 'profile': {
                        let claims = [
                            'name',
                            'family_name',
                            'given_name',
                            'middle_name',
                            'nickname',
                            'preferred_username',
                            'profile',
                            'picture',
                            'website',
                            'gender',
                            'birthdate',
                            'zoneinfo',
                            'locale',
                            'phone_number'
                        ];
                        claims.map((name) => {
                            if (data.user[name]) {
                                payload[name] = data.user[name];
                            }
                        });
                        payload = {
                            ...payload,
                            tenants: data.user.tenants
                        };
                        payload = {
                            ...payload,
                            tenants: data.user.tenantsObject,
                            roles: data.user.rolesObject
                        };
                        break;
                    }
                    case 'email':
                        payload = {
                            ...payload,
                            email: data.user.email
                        };
                        break;
                    case 'address':
                        payload = {
                            ...payload,
                            address: ''
                        };
                        break;
                    case 'phone':
                        payload = {
                            ...payload,
                            phone: data.user.phone
                        };
                        break;
                    case 'offline_access':
                        break;
                    case 'dynamic:permission':
                        break;
                    case 'org':
                        break;
                    default:
                        break;
                }
            });
        }
        else {
            return false;
        }
        if (data.format == 'JWT') {
            if (!data.privateKey) {
                const key = await this.keyService.getActiveKey(data.tenant);
                data.privateKey = {
                    id: key.kid,
                    pem: key.privateKeyPem
                };
            }
            return this.jwtService.sign(payload, {
                algorithm: 'RS256',
                expiresIn: expiresIn,
                keyid: data.privateKey.id,
                privateKey: data.privateKey.pem
            });
        }
        else {
            const valor = parseInt(expiresIn);
            const unidad = expiresIn.slice(-1);
            payload = {
                ...payload,
                "exp": dayjs().add(valor, unidad).unix(),
                "iat": dayjs().unix()
            };
            return payload;
        }
    }
    async validateIdToken(idToken) {
        let jwt = this.jwtService.decode(idToken, { complete: true });
        const decodedToken = jwt.payload;
        let tenantId = null;
        const key = await this.keyService.getKey(jwt.header.kid);
        if (!key)
            throw new common_1.ForbiddenException("No key id found");
        try {
            const payload = await this.jwtService.verifyAsync(idToken, {
                publicKey: key.publicKeyPem,
                issuer: this.configService.get('PLS_PUBLIC_URL')
            });
            return payload;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.OpenidService = OpenidService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], OpenidService.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], OpenidService.prototype, "configService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", key_service_1.KeyService)
], OpenidService.prototype, "keyService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", identity_service_1.IdentityService)
], OpenidService.prototype, "identityService", void 0);
exports.OpenidService = OpenidService = __decorate([
    (0, common_1.Injectable)()
], OpenidService);
//# sourceMappingURL=openid.service.js.map