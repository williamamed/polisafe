"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto = __importStar(require("crypto"));
const config_1 = require("@nestjs/config");
const auth_code_service_1 = require("./auth-code.service");
const refresh_token_service_1 = require("./refresh-token.service");
const identity_service_1 = require("./identity.service");
const openid_service_1 = require("./openid.service");
const key_service_1 = require("./key.service");
const access_token_service_1 = require("./access-token.service");
const dayjs = require("dayjs");
const client_service_1 = require("./client.service");
const error_auth_type_1 = require("../error/error-auth.type");
let AuthService = class AuthService {
    async login(data, options) {
        const payload = {
            iss: this.configService.get('PLS_PUBLIC_URL'),
            aud: options.client.meta && options.client.meta.audiences ? options.client.meta.audiences : '*',
            ...data
        };
        if (options.client.meta && options.client.meta.access_token_include_permissions && payload.roles) {
            payload.permissions = await this.indentityService.getModel().getPermissionsByRoles(payload.roles);
        }
        const duration = options.client.meta?.access_token_expire || this.configService.get('PLS_JWT_ACCESS_EXPIRES_IN') || '15m';
        const accessToken = await this.generateAccessToken(payload, options.tenant, options.client.id, duration);
        const refreshToken = options.refreshToken ? (await this.generateRefreshToken(parseInt(data.sub), options.tenant, options.client.id, data.scope, accessToken.id, duration)).token : null;
        payload.jti = accessToken.id;
        const valor = parseInt(duration);
        const unidad = duration.slice(-1);
        let expires_in = dayjs().add(valor, unidad).diff(dayjs(), 'seconds');
        return {
            access_token: accessToken.token,
            expires_in: expires_in,
            token_type: 'Bearer',
            scope: data.scope,
            ...options.idToken ? {
                id_token: options.idToken
            } : {},
            ...options.refreshToken ? {
                refresh_token: refreshToken
            } : {}
        };
    }
    async loginClient(client, scope) {
        const payload = {
            sub: client.id,
            client_id: client.clientId,
            grant_type: client.grants.join(' '),
            scope: scope,
            aud: '*'
        };
    }
    async createMagicCode({ clientId, userId }) {
        let code = await this.authCodeService.create({
            clientId,
            userId,
            redirectUri: '',
            expiresAt: null
        });
        return code;
    }
    async createAuthorizationCode({ clientId, redirectUri, codeChallenge, method, userId }) {
        const code = crypto.randomBytes(32).toString('hex');
        return { code };
    }
    async refreshTokens(refreshToken, clientId) {
        try {
            const jwt = this.jwtService.decode(refreshToken, { complete: true });
            const key = await this.keyService.getKey(jwt.header.kid);
            const keyActive = await this.keyService.getActiveKey(key.tenant);
            await this.jwtService.verifyAsync(refreshToken, {
                publicKey: key.publicKeyPem
            });
            const storedToken = await this.refreshTokenService.getRefreshByClient(refreshToken, clientId);
            if (!storedToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            storedToken.isRevoked = true;
            await storedToken.save();
            let user = await this.indentityService.getModel().getUser(String(storedToken.userId), key.tenant);
            return await this.login({
                ...await this.indentityService.getAccessTokenClaims({
                    user: user,
                    scope: storedToken.scope,
                    tid: key.tenant
                }),
                client_id: storedToken.client.clientId
            }, {
                refreshToken: true,
                idToken: await this.openidService.getOpenIdClaims({
                    user: user,
                    scope: storedToken.scope,
                    format: 'JWT',
                    client: storedToken.client,
                    privateKey: {
                        id: keyActive.kid,
                        pem: keyActive.privateKeyPem
                    },
                    expireIn: storedToken.client.meta && storedToken.client.meta.access_token_expire ? storedToken.client.meta.access_token_expire : null
                }),
                tenant: key.tenant,
                client: storedToken.client
            });
        }
        catch (error) {
            console.log(error);
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async revoke(token, type, clientId) {
        if (type == 'refresh_token') {
            const refresh = await this.refreshTokenService.getRefresh(token);
            if (refresh) {
                await this.refreshTokenService.revoke(token, clientId);
                await this.accessTokenService.revokeAllUser(refresh.userId, clientId);
            }
        }
        else {
            await this.accessTokenService.revoke(token, clientId);
        }
    }
    async logout(logoutDto) {
        let client = await this.clientService.getClientById(logoutDto.client_id);
        let idToken = await this.openidService.validateIdToken(logoutDto.id_token_hint);
        if (!client.postLogoutRedirectUris)
            throw new common_1.ForbiddenException({
                error: error_auth_type_1.ErrorAuthType.access_denied,
                error_description: "Invalid client post_logout_redirect_uri"
            });
        if (!client.postLogoutRedirectUris.includes(logoutDto.post_logout_redirect_uri))
            throw new common_1.ForbiddenException({
                error: error_auth_type_1.ErrorAuthType.access_denied,
                error_description: "Invalid client post_logout_redirect_uri"
            });
        let accessToken = await this.accessTokenService.geAccessTokenByUserAndClient(idToken.sub, client.id);
        if (accessToken) {
            await this.revoke(accessToken.token, "access_token", client.id);
        }
    }
    async generateAccessToken(payload, tenant, clientId, expires) {
        const key = await this.keyService.getActiveKey(tenant);
        const expiresIn = expires ? expires : this.configService.get('PLS_JWT_ACCESS_EXPIRES_IN') || '15m';
        const token = this.jwtService.sign(payload, {
            algorithm: 'RS256',
            expiresIn: expiresIn,
            keyid: key.kid,
            privateKey: key.privateKeyPem
        });
        const valor = parseInt(expiresIn);
        const unidad = expiresIn.slice(-1);
        const expiresAt = dayjs().add(valor, unidad).toDate();
        return await this.accessTokenService.create({
            token,
            expiresAt,
            userId: payload.sub == payload.client_id ? null : payload.sub,
            isRevoked: false,
            scope: payload.scope,
            clientId: clientId
        });
    }
    async generateRefreshToken(userId, tenant, clientId, scope, accessTokenId, expires) {
        const expiresIn = expires ? expires : this.configService.get('PSL_JWT_REFRESH_EXPIRES_IN');
        const valor = parseInt(expiresIn);
        const unidad = expiresIn.slice(-1);
        const expiresAt = dayjs().add(valor, unidad).toDate();
        const key = await this.keyService.getActiveKey(tenant);
        const token = this.jwtService.sign({ sub: userId }, {
            expiresIn,
            algorithm: 'RS256',
            keyid: key.kid,
            privateKey: key.privateKeyPem
        });
        await this.refreshTokenService.create({
            token,
            expiresAt,
            userId,
            isRevoked: false,
            scope: scope,
            clientId: clientId,
            accessTokenId: accessTokenId
        });
        return {
            token: token
        };
    }
    async exchangeAuthorizationCode(authCode, codeVerifier, issueRefreshToken, client) {
        if (!this.verifyPkce(codeVerifier, authCode.codeChallenge, authCode.codeChallengeMethod))
            throw new common_1.UnauthorizedException('invalid code_verifier');
        let user = await this.indentityService.getModel().getUser(`${authCode.userId}`, client.tenant);
        if (!user) {
            throw new common_1.UnauthorizedException('No user found');
        }
        await this.authCodeService.invalidateCode(authCode.code);
        return await this.login({
            ...await this.indentityService.getAccessTokenClaims({
                user: user,
                scope: authCode.scopes,
                tid: client.tenant
            }),
            client_id: client.clientId
        }, {
            refreshToken: true,
            idToken: await this.openidService.getOpenIdClaims({
                scope: authCode.scopes,
                user: user,
                format: 'JWT',
                tenant: client.tenant,
                client: client,
                expireIn: client.meta && client.meta.access_token_expire ? client.meta.access_token_expire : null
            }),
            tenant: client.tenant,
            client: client
        });
    }
    verifyPkce(codeVerifier, codeChallenge, method) {
        if (!method || method.toUpperCase() === 'PLAIN')
            return codeVerifier === codeChallenge;
        if (method.toUpperCase() === 'S256') {
            const hash = crypto.createHash('sha256').update(codeVerifier).digest();
            const base64url = hash.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
            return base64url === codeChallenge;
        }
        return false;
    }
};
exports.AuthService = AuthService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], AuthService.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", key_service_1.KeyService)
], AuthService.prototype, "keyService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", identity_service_1.IdentityService)
], AuthService.prototype, "indentityService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", openid_service_1.OpenidService)
], AuthService.prototype, "openidService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", refresh_token_service_1.RefreshTokenService)
], AuthService.prototype, "refreshTokenService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", access_token_service_1.AccessTokenService)
], AuthService.prototype, "accessTokenService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", auth_code_service_1.AuthCodeService)
], AuthService.prototype, "authCodeService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", client_service_1.ClientService)
], AuthService.prototype, "clientService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], AuthService.prototype, "configService", void 0);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map