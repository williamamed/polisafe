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
exports.OpenidController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const identity_service_1 = require("../services/identity.service");
const key_service_1 = require("../services/key.service");
const openid_service_1 = require("../services/openid.service");
const client_service_1 = require("../services/client.service");
const permission_decorator_1 = require("../../polisafe-sdk/decorators/permission.decorator");
const verify_dto_1 = require("../dto/verify.dto");
let OpenidController = class OpenidController {
    async userInfo(userToken) {
        let user = await this.identityService.getModel().getUser(userToken.sub, userToken.tid);
        let client = await this.clientService.getClientById(userToken.client_id);
        return await this.openidService.getOpenIdClaims({
            scope: userToken.scope,
            user: user,
            format: 'JSON',
            tenant: null,
            client: client
        });
    }
    async conf() {
        return {
            "issuer": this.configService.get('PLS_PUBLIC_URL'),
            "authorization_endpoint": `${this.configService.get('PLS_PUBLIC_URL')}${this.configService.get('APP_PREFIX')}/polisafe/oauth/auth`,
            "token_endpoint": `${this.configService.get('PLS_PUBLIC_URL')}${this.configService.get('APP_PREFIX')}/polisafe/oauth/token`,
            "userinfo_endpoint": `${this.configService.get('PLS_PUBLIC_URL')}${this.configService.get('APP_PREFIX')}/polisafe/openid/userinfo`,
            "revocation_endpoint": `${this.configService.get('PLS_PUBLIC_URL')}${this.configService.get('APP_PREFIX')}/polisafe/oauth/revoke`,
            "introspection_endpoint": `${this.configService.get('PLS_PUBLIC_URL')}${this.configService.get('APP_PREFIX')}/polisafe/openid/instrospect`,
            "end_session_endpoint": `${this.configService.get('PLS_PUBLIC_URL')}${this.configService.get('APP_PREFIX')}/polisafe/oauth/logout`,
            "jwks_uri": `${this.configService.get('PLS_PUBLIC_URL')}${this.configService.get('APP_PREFIX')}/polisafe/openid/:tenant/certs`,
            "grant_types_supported": [
                "authorization_code",
                "refresh_token",
                "password",
                "client_credentials"
            ],
            "response_types_supported": [
                "code"
            ],
            "subject_types_supported": [
                "public"
            ],
            "id_token_signing_alg_values_supported": [
                "RS256"
            ],
            "response_modes_supported": [
                "query"
            ]
        };
    }
    async getKeys(tenant) {
        return this.keyService.getJwks(tenant);
    }
    async instrospect() {
        return "";
    }
    async activation(query, req, response) {
        let client = await this.clientService.getClientById(query.client_id);
        if (!client)
            throw new common_1.NotFoundException();
        let settings = await this.identityService.getClientSettings(client.tenant, client.clientId);
        return response.render('activation', {
            config: JSON.stringify(settings),
            appSettings: settings,
            tid: client.tenant,
            client_id: client.clientId
        });
    }
    async invitation(query, req, response) {
        let settings, tid;
        if (query.client_id) {
            let client = await this.clientService.getClientById(query.client_id);
            if (!client)
                throw new common_1.NotFoundException();
            tid = client.tenant;
            settings = await this.identityService.getClientSettings(client.tenant, client.clientId);
        }
        else {
            tid = query.tid;
            settings = await this.identityService.getClientSettings(query.tid, 'polisafe');
        }
        return response.render('invitation', {
            config: JSON.stringify(settings),
            appSettings: settings,
            tid: tid
        });
    }
};
exports.OpenidController = OpenidController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], OpenidController.prototype, "configService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", identity_service_1.IdentityService)
], OpenidController.prototype, "identityService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", key_service_1.KeyService)
], OpenidController.prototype, "keyService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", openid_service_1.OpenidService)
], OpenidController.prototype, "openidService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", client_service_1.ClientService)
], OpenidController.prototype, "clientService", void 0);
__decorate([
    (0, common_1.Get)("openid/userinfo"),
    (0, permission_decorator_1.Scope)("openid"),
    __param(0, (0, permission_decorator_1.TokenInfo)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OpenidController.prototype, "userInfo", null);
__decorate([
    (0, common_1.Get)(".well-known/openid-configuration"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OpenidController.prototype, "conf", null);
__decorate([
    (0, common_1.Get)("openid/:tenant/certs"),
    __param(0, (0, common_1.Param)("tenant")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OpenidController.prototype, "getKeys", null);
__decorate([
    (0, common_1.Post)("instrospect"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OpenidController.prototype, "instrospect", null);
__decorate([
    (0, common_1.Get)("activation"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_dto_1.VerifyDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OpenidController.prototype, "activation", null);
__decorate([
    (0, common_1.Get)("invitation"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OpenidController.prototype, "invitation", null);
exports.OpenidController = OpenidController = __decorate([
    (0, common_1.Controller)('polisafe')
], OpenidController);
//# sourceMappingURL=openid.controller.js.map