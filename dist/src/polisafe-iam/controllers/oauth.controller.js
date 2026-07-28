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
exports.idToken = exports.OauthController = void 0;
const common_1 = require("@nestjs/common");
const auth_request_dto_1 = require("../dto/auth-request.dto");
const error_service_1 = require("../services/error.service");
const error_auth_type_1 = require("../error/error-auth.type");
const token_request_dto_1 = require("../dto/token-request.dto");
const auth_service_1 = require("../services/auth.service");
const error_token_type_1 = require("../error/error-token.type");
const token_pipe_1 = require("../pipes/token.pipe");
const identity_service_1 = require("../services/identity.service");
const openid_service_1 = require("../services/openid.service");
const key_service_1 = require("../services/key.service");
const client_service_1 = require("../services/client.service");
const auth_code_service_1 = require("../services/auth-code.service");
const revoke_dto_1 = require("../dto/revoke.dto");
const logout_dto_1 = require("../dto/logout.dto");
const logout_pipe_1 = require("../pipes/logout.pipe");
const auth_jwt_guard_1 = require("../../polisafe-sdk/guards/auth-jwt.guard");
const auth_basic_guards_1 = require("../guards/auth-basic.guards");
const same_origin_cookie_guard_1 = require("../guards/same-origin-cookie.guard");
const config_1 = require("@nestjs/config");
const providers_service_1 = require("../services/providers.service");
const url_1 = require("url");
const register_page_dto_1 = require("../dto/register-page.dto");
const notification_oauth_service_1 = require("../services/notification-oauth.service");
let OauthController = class OauthController {
    async authorize() { }
    async authorizeGet(req, authRequest, response) {
        if (authRequest.response_type != 'code' && authRequest.response_type != 'token') {
            response.redirect(authRequest.redirect_uri + `?${this.errorService.createResponse({
                error: error_auth_type_1.ErrorAuthType.unsupported_response_type,
                error_description: "The response type is invalid or missing",
                state: authRequest.state ?? ''
            })}`);
            return;
        }
        if (!authRequest.code_challenge || !authRequest.code_challenge_method) {
            response.redirect(authRequest.redirect_uri + `?${this.errorService.createResponse({
                error: error_auth_type_1.ErrorAuthType.invalid_request,
                error_description: "Missing code Challenge and Method",
                state: authRequest.state ?? ''
            })}`);
            return;
        }
        let client = await this.clientService.getClientByIdAndUri(authRequest.client_id, authRequest.redirect_uri);
        if (!client) {
            response.redirect(authRequest.redirect_uri + `?${this.errorService.createResponse({
                error: error_auth_type_1.ErrorAuthType.unauthorized_client,
                error_description: "The client specify is missing or uri incorrect",
                state: authRequest.state ?? ''
            })}`);
            return;
        }
        if (authRequest.response_type == 'code' && !client.grants?.includes('authorization_code')) {
            response.redirect(authRequest.redirect_uri + `?${this.errorService.createResponse({
                error: error_auth_type_1.ErrorAuthType.unauthorized_client,
                error_description: "The authorization_code grant is unauthorized",
                state: authRequest.state ?? ''
            })}`);
            return;
        }
        if (authRequest.response_type == 'token' && !client.grants?.includes('implicit')) {
            response.redirect(authRequest.redirect_uri + `?${this.errorService.createResponse({
                error: error_auth_type_1.ErrorAuthType.unauthorized_client,
                error_description: "The implicit grant is unauthorized",
                state: authRequest.state ?? ''
            })}`);
            return;
        }
        let denied = await this.clientService.getDeniedScopes(client.clientId, authRequest.scope);
        if (denied.length > 0) {
            response.redirect(authRequest.redirect_uri + `?${this.errorService.createResponse({
                error: error_auth_type_1.ErrorAuthType.invalid_scope,
                error_description: "The scope " + denied[0] + " is not permited for this client",
                state: authRequest.state ?? ''
            })}`);
            return;
        }
        let userLogin = (req.user);
        let settings = await this.identityService.getClientSettings(client.tenant, client.clientId);
        if (!userLogin) {
            (new same_origin_cookie_guard_1.SameOriginCookieGuard())
                .setOriginCookie(response);
            return response.render('login-identity', {
                ...authRequest,
                config: JSON.stringify(settings),
                appSettings: settings,
                tid: client.tenant,
                signIn: encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
            });
        }
        else {
            let authCodeResponse = await this.authCodeService.getConsentAuthCode(authRequest, userLogin.sub, client.id);
            if (!authCodeResponse) {
                return response.render('consent', {
                    ...authRequest,
                    config: JSON.stringify(settings),
                    appSettings: settings,
                    tid: client.tenant,
                    permissions: JSON.stringify(await this.identityService.getPermissionsMapClient(authRequest.scope, client.clientId))
                });
            }
            if (authRequest.response_type == 'code') {
                response.redirect(authRequest.redirect_uri + `?code=${authCodeResponse.code}&state=${authRequest.state ?? ''}`);
                return;
            }
            if (authRequest.response_type == 'token') {
                let implicitReponse = await this.authService.exchangeAuthorizationCode(authCodeResponse, '', false, client);
                response.redirect(authRequest.redirect_uri + `#${new url_1.URLSearchParams(implicitReponse).toString()}&state=${authRequest.state ?? ''}`);
                return;
            }
            response.redirect(authRequest.redirect_uri + `?${this.errorService.createResponse({
                error: error_auth_type_1.ErrorAuthType.unsupported_response_type,
                error_description: "The response type is invalid or missing",
                state: authRequest.state ?? ''
            })}`);
        }
    }
    async getToken(req, token, response) {
        switch (token.grant_type) {
            case 'password': {
                let client = await this.clientService.verifyClient(token.credentials_basic.client_id, token.credentials_basic.client_secret);
                if (!client.grants?.includes(token.grant_type))
                    throw new common_1.UnauthorizedException(`The ${token.grant_type} grant is unauthorized`);
                let user = await this.identityService.getModel().validateUser(token.username, token.password, client.tenant);
                if (!user)
                    throw new common_1.UnauthorizedException();
                user = await this.identityService.getModel().getUser(`${user.id}`, client.tenant);
                return await this.authService.login({
                    ...await this.identityService.getAccessTokenClaims({
                        scope: token.scope,
                        user: user,
                        tid: client.tenant
                    }),
                    client_id: token.credentials_basic.client_id
                }, {
                    refreshToken: true,
                    idToken: await this.openidService.getOpenIdClaims({
                        scope: token.scope,
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
            case 'client_credentials': {
                let client = await this.clientService.verifyClient(token.credentials_basic.client_id, token.credentials_basic.client_secret);
                if (!client.grants?.includes(token.grant_type))
                    throw new common_1.UnauthorizedException(`The ${token.grant_type} grant is unauthorized`);
                let denied = await this.clientService.getDeniedScopes(client.clientId, token.scope);
                if (denied.length > 0) {
                    throw new common_1.BadRequestException({
                        error: error_token_type_1.ErrorTokenType.invalid_scope,
                        error_description: "The scope " + denied[0] + " is not permited for this client"
                    });
                }
                let tokenResponse = await this.authService.login({
                    client_id: client.clientId,
                    sub: client.clientId,
                    scope: token.scope,
                    tid: client.tenant
                }, {
                    refreshToken: false,
                    idToken: false,
                    tenant: client.tenant,
                    client: client
                });
                return tokenResponse;
            }
            case 'refresh_token': {
                let client = null;
                if (token.credentials_basic) {
                    client = await this.clientService.verifyClient(token.credentials_basic.client_id, token.credentials_basic.client_secret);
                }
                else {
                    client = await this.clientService.getClientById(token.client_id);
                    if (client.type == 'confidential') {
                        client = await this.clientService.verifyClient(token.credentials_basic.client_id, token.credentials_basic.client_secret);
                    }
                }
                if (!client.grants?.includes(token.grant_type))
                    throw new common_1.UnauthorizedException(`The ${token.grant_type} grant is unauthorized`);
                let tokenResponse = await this.authService.refreshTokens(token.refresh_token, client.id);
                return tokenResponse;
            }
            case 'authorization_code': {
                let client = await this.clientService.getClientByIdAndUri(token.client_id, token.redirect_uri);
                if (!client.grants?.includes(token.grant_type))
                    throw new common_1.UnauthorizedException(`The ${token.grant_type} grant is unauthorized`);
                if (!client)
                    throw new common_1.BadRequestException({
                        error: error_token_type_1.ErrorTokenType.unauthorized_client,
                        error_description: "Client unauthorized"
                    });
                let authCode = await this.authCodeService.getActiveCodeByCodeClient(token.code, client.id, token.redirect_uri);
                if (!authCode)
                    throw new common_1.BadRequestException({
                        error: error_token_type_1.ErrorTokenType.invalid_request,
                        error_description: "Invalid code"
                    });
                try {
                    return await this.authService.exchangeAuthorizationCode(authCode, token.code_verifier, true, client);
                }
                catch (error) {
                    throw new common_1.BadRequestException({
                        error: error_token_type_1.ErrorTokenType.invalid_request,
                        error_description: "Code expire or PKCE verification fail"
                    });
                }
            }
            default:
                break;
        }
    }
    async revoke(revokeDto) {
        let client;
        if (revokeDto.credentials_basic) {
            client = await this.clientService.verifyClient(revokeDto.credentials_basic.client_id, revokeDto.credentials_basic.client_secret);
        }
        else {
            client = await this.clientService.getClientById(revokeDto.client_id);
            if (client.type == 'confidential') {
                client = await this.clientService.verifyClient(revokeDto.credentials_basic.client_id, revokeDto.credentials_basic.client_secret);
            }
        }
        await this.authService.revoke(revokeDto.token, revokeDto.token_type_hint, client.id);
        return {
            ok: true
        };
    }
    async submitConsent(req, body) {
        let userLogin = (req.user);
        let client = await this.clientService.getClientByIdAndUri(body.clientId, body.redirectUri);
        if (userLogin) {
            await this.authCodeService.create({
                userId: userLogin.sub,
                clientId: client.id,
                redirectUri: body.redirectUri,
                scopes: body.scope,
                expiresAt: null,
                codeChallenge: body.codeChallenge,
                codeChallengeMethod: body.codeChallengeMethod
            });
        }
        else {
            throw new common_1.UnauthorizedException();
        }
        return {
            ok: true
        };
    }
    async login(body, req, response) {
        let client = await this.clientService.getClientById(body.client_id);
        let appConfig = await this.identityService.getClientSettings(client.tenant, client.clientId);
        let user = null;
        if (appConfig.login_magic_link) {
            user = await this.identityService.getModel().findByEmail(body.username, client.tenant);
            if (!user)
                throw new common_1.UnauthorizedException();
            user = await this.identityService.getModel().getUser(`${user.id}`, client.tenant);
            let code = await this.authService.createMagicCode({
                userId: user.id,
                clientId: client.id
            });
            if (!appConfig.external_webhook_url)
                throw new common_1.ServiceUnavailableException("Comunication not enabled");
            let webhookHeaders = {};
            if (appConfig.external_webhook_headers) {
                webhookHeaders = appConfig.external_webhook_headers.value.split(',').map((rowHeader) => {
                    let row = rowHeader.split(':');
                    return { [row[0]]: row[1] };
                });
            }
            await this.notificationService.webhook(appConfig.external_webhook_url, {
                type: 'user:magiclink',
                payload: {
                    url: `${req.protocol}://${req.get('host')}${this.configService.get('APP_PREFIX')}/polisafe/oauth/callback-magic?code=${code.code}&redirect=${body.signIn}`,
                    email: user.email
                }
            }, {
                ...webhookHeaders
            });
            return {
                ok: true,
                type: 'magic'
            };
        }
        user = await this.identityService.getModel().validateUser(body.username, body.password, client.tenant);
        if (!user)
            throw new common_1.UnauthorizedException();
        user = await this.identityService.getModel().getUser(`${user.id}`, client.tenant);
        let tokenResponse = await this.authService.login({
            ...await this.identityService.getAccessTokenClaims({
                scope: '',
                tid: client.tenant,
                user: user
            }),
            client_id: client.clientId
        }, {
            refreshToken: false,
            tenant: client.tenant,
            client: client
        });
        response.cookie('a-' + client.clientId, tokenResponse.access_token, { httpOnly: true, secure: this.configService.get('NODE_ENV') === 'production', sameSite: 'lax' });
        return {
            ok: true,
            type: 'password'
        };
    }
    async logout(logoutDto, req, response) {
        let userLogin = (req.user);
        await this.authService.logout(logoutDto);
        if (userLogin) {
            response.clearCookie('a-' + logoutDto.client_id);
        }
        response.redirect(`${logoutDto.post_logout_redirect_uri}?state=${logoutDto.state ?? ''}`);
    }
    async callback(query, req, response) {
        const state = req.cookies['oauth_state'];
        const provider = req.cookies['curr_provider'];
        const codeVerifier = req.cookies['code_verifier'];
        const stateLogin = this.providersService.decode(query.state);
        let url = new url_1.URL(stateLogin.url);
        let client = await this.clientService.getClientById(url.searchParams.get('client_id'));
        let appConfig = await this.identityService.getClientSettings(client.tenant, client.clientId);
        let externalLogin = await this.providersService.handleCallback(query, provider, state, codeVerifier, appConfig);
        response.clearCookie('oauth_state');
        response.clearCookie('curr_provider');
        response.clearCookie('code_verifier');
        let user = await this.identityService.getModel().getUserOrRegister({
            email: externalLogin.userProfile.email,
            username: externalLogin.userProfile.email,
            fullname: externalLogin.userProfile.name,
            picture: externalLogin.userProfile.picture,
            address: externalLogin.userProfile.raw.address,
            extraSettings: `polisafe-${client.clientId}`,
            clientId: client.clientId
        }, client.tenant);
        if (!user)
            throw new common_1.UnauthorizedException();
        user = await this.identityService.getModel().getUser(`${user.id}`, client.tenant);
        let tokenResponse = await this.authService.login({
            ...await this.identityService.getAccessTokenClaims({
                scope: '',
                tid: client.tenant,
                user: user
            }),
            client_id: client.clientId
        }, {
            refreshToken: false,
            tenant: client.tenant,
            client: client
        });
        response.cookie('a-' + client.clientId, tokenResponse.access_token, { httpOnly: true, secure: this.configService.get('NODE_ENV') === 'production', sameSite: 'lax' });
        return response.redirect(externalLogin.url);
    }
    async provider(query, req, response) {
        let urlReferer = new url_1.URL(req.headers.referer);
        let client = await this.clientService.getClientById(urlReferer.searchParams.get('client_id'));
        let appConfig = await this.identityService.getClientSettings(client.tenant, client.clientId);
        const provider = query.provider;
        const { codeVerifier, state, url } = await this.providersService.startAuth(provider, req.headers.referer, appConfig);
        response.cookie('oauth_state', state, { httpOnly: true, secure: this.configService.get('NODE_ENV') === 'production', sameSite: 'lax' });
        response.cookie('code_verifier', codeVerifier, { httpOnly: true, secure: this.configService.get('NODE_ENV') === 'production', sameSite: 'lax' });
        response.cookie('curr_provider', provider, { httpOnly: true, secure: this.configService.get('NODE_ENV') === 'production', sameSite: 'lax' });
        return response.redirect(url);
    }
    async register(query, req, response) {
        let client = await this.clientService.getClientById(query.client_id);
        if (!client)
            throw new common_1.NotFoundException();
        let settings = await this.identityService.getClientSettings(client.tenant, client.clientId);
        if (!settings.login_button_register_name)
            throw new common_1.ForbiddenException("Not active");
        return response.render('register', {
            config: JSON.stringify(settings),
            appSettings: settings,
            tid: client.tenant,
            client_id: client.clientId
        });
    }
    async callbackMagic(query, req, response) {
        const redirectOauth = query.redirect;
        const codeUrl = query.code;
        const code = await this.authCodeService.findByValidCode(codeUrl);
        if (!code)
            throw new common_1.ForbiddenException("code not valid");
        let client = await this.clientService.getClientByInternalId(code.clientId);
        let user = await this.identityService.getModel().getUser(`${code.userId}`, client.tenant);
        let tokenResponse = await this.authService.login({
            ...await this.identityService.getAccessTokenClaims({
                scope: '',
                tid: client.tenant,
                user: user
            }),
            client_id: client.clientId
        }, {
            refreshToken: false,
            tenant: client.tenant,
            client: client
        });
        await this.authCodeService.invalidateCode(codeUrl);
        response.cookie('a-' + client.clientId, tokenResponse.access_token, { httpOnly: true, secure: this.configService.get('NODE_ENV') === 'production', sameSite: 'lax' });
        return response.redirect(decodeURIComponent(redirectOauth));
    }
    async recover(query, req, response) {
        let client = await this.clientService.getClientById(query.client_id);
        if (!client)
            throw new common_1.NotFoundException();
        let settings = await this.identityService.getClientSettings(client.tenant, client.clientId);
        if (!settings.login_button_register_name)
            throw new common_1.ForbiddenException("Not active");
        return response.render('recover', {
            config: JSON.stringify(settings),
            appSettings: settings,
            tid: client.tenant,
            client_id: client.clientId
        });
    }
};
exports.OauthController = OauthController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", identity_service_1.IdentityService)
], OauthController.prototype, "identityService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", key_service_1.KeyService)
], OauthController.prototype, "keyService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", client_service_1.ClientService)
], OauthController.prototype, "clientService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", auth_code_service_1.AuthCodeService)
], OauthController.prototype, "authCodeService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", openid_service_1.OpenidService)
], OauthController.prototype, "openidService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", auth_service_1.AuthService)
], OauthController.prototype, "authService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", error_service_1.ErrorService)
], OauthController.prototype, "errorService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], OauthController.prototype, "configService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", providers_service_1.ProvidersService)
], OauthController.prototype, "providersService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", notification_oauth_service_1.NotificationOauthService)
], OauthController.prototype, "notificationService", void 0);
__decorate([
    (0, common_1.Post)("auth"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "authorize", null);
__decorate([
    (0, common_1.Get)("auth"),
    (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthCookieGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_request_dto_1.AuthRequestDto, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "authorizeGet", null);
__decorate([
    (0, common_1.Post)("token"),
    (0, common_1.UseGuards)(auth_basic_guards_1.AuthBasicGuard),
    (0, common_1.UsePipes)(token_pipe_1.ValidationTokenPipe),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, token_request_dto_1.TokenDto, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "getToken", null);
__decorate([
    (0, common_1.Post)("revoke"),
    (0, common_1.UseGuards)(auth_basic_guards_1.AuthBasicGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [revoke_dto_1.RevokeDto]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "revoke", null);
__decorate([
    (0, common_1.Post)('auth/consent'),
    (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthCookieGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "submitConsent", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    (0, common_1.UseGuards)(same_origin_cookie_guard_1.SameOriginCookieGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.UsePipes)(logout_pipe_1.LogoutPipe),
    (0, common_1.UseGuards)(auth_jwt_guard_1.JwtAuthCookieGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logout_dto_1.LogoutDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("callback"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "callback", null);
__decorate([
    (0, common_1.Get)("provider"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "provider", null);
__decorate([
    (0, common_1.Get)("register"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_page_dto_1.RegisterPageDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)("callback-magic"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "callbackMagic", null);
__decorate([
    (0, common_1.Get)("recover"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_page_dto_1.RegisterPageDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OauthController.prototype, "recover", null);
exports.OauthController = OauthController = __decorate([
    (0, common_1.Controller)('polisafe/oauth')
], OauthController);
exports.idToken = {
    "iss": "https://your-domain.auth0.com/",
    "sub": "auth0|1234567890",
    "aud": "my-client-id-abc123",
    "exp": 1719321000,
    "iat": 1719317400,
    "auth_time": 1719317400,
    "nonce": "a1b2c3d4e5",
    "email": "user@example.com",
    "email_verified": true,
    "name": "Juan Pérez",
    "given_name": "Juan",
    "family_name": "Perez",
    "picture": "https://.....",
    "locale": "es-ES"
};
//# sourceMappingURL=oauth.controller.js.map