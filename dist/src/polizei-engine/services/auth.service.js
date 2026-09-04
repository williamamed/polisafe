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
const user_service_1 = require("./user.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const dayjs = require("dayjs");
const scope_service_1 = require("./scope.service");
const role_service_1 = require("./role.service");
const security_session_1 = require("../models/security.session");
const sequelize_1 = require("@nestjs/sequelize");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
const notification_service_1 = require("./notification.service");
const url_service_1 = require("./url.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor() {
        this.saltOrRounds = 10;
    }
    async signIn(username, pass, workspaceScope = "default", meta = {}) {
        if (!username)
            throw new common_1.UnauthorizedException();
        const user = await this.userService.findOne(username);
        let isMatch = false;
        if (user && user?.password !== pass) {
            isMatch = await bcrypt.compare(pass, user?.password);
        }
        if (!isMatch) {
            throw new common_1.UnauthorizedException();
        }
        if (user.state != 1) {
            throw new common_1.UnauthorizedException();
        }
        const payload = {
            id: user.id,
            username: user.username,
            roles: user.roles.map((item) => {
                return item.id;
            }),
            scopes: user.scopes.filter((item) => {
                if (item.settings && item.settings.users == process.env.BASE_ROL_KEY)
                    return false;
                return true;
            }).map((item) => {
                return item.id;
            })
        };
        let token = await this.jwtService.signAsync(payload, {
            secret: await this.getSecretByWorkSpace(workspaceScope)
        });
        await this.sessionModel.create({
            username: payload.username,
            agent: meta.agent,
            active: true,
            meta: {
                ip: meta.ip
            },
            key: workspaceScope,
            token: token
        });
        return {
            token: token
        };
    }
    async getSecretByWorkSpace(workspaceScope = 'default') {
        let secret = process.env.JWTKEY;
        if (workspaceScope != "default") {
            let workScope = await this.scopeService.isScopeAuthorize(workspaceScope);
            if (workScope) {
                secret = workScope.settings.key;
            }
            else {
                throw new common_1.NotFoundException("Auth token not exist");
            }
        }
        return secret;
    }
    async revalidate(user, userToken = null, workspaceScope = "default") {
        let scopes = user.scopes.filter((item) => {
            if (item.settings && item.settings.users == process.env.BASE_ROL_KEY)
                return false;
            return true;
        }).map((item) => {
            return item.id;
        });
        let symDifference = [];
        if (userToken) {
            symDifference = scopes.filter(x => !scopes.includes(x))
                .concat(scopes.filter(x => !userToken.scopes.includes(x)));
            if (symDifference.length == 0) {
                return {
                    revalidate: false
                };
            }
        }
        const payload = {
            id: user.id,
            username: user.username,
            roles: user.roles.map((item) => {
                return item.id;
            }),
            scopes: scopes
        };
        return {
            token: await this.jwtService.signAsync(payload, {
                secret: await this.getSecretByWorkSpace(workspaceScope)
            }),
            revalidate: symDifference.length ? true : false
        };
    }
    async getUserPayload(username, workspaceScope = "default") {
        const user = await this.userService.findOne(username);
        if (!user) {
            throw new common_1.NotFoundException("usuario no encontrado");
        }
        const payload = {
            id: user.id,
            username: user.username,
            roles: user.roles.map((item) => {
                return item.id;
            }),
            scopes: user.scopes.filter((item) => {
                if (item.settings && item.settings.users == process.env.BASE_ROL_KEY)
                    return false;
                return true;
            }).map((item) => {
                return item.id;
            })
        };
        return payload;
    }
    async getUserToken(username, workspaceScope = "default") {
        const user = await this.userService.findOne(username);
        if (!user) {
            throw new common_1.NotFoundException("usuario no encontrado");
        }
        const payload = {
            id: user.id,
            username: user.username,
            roles: user.roles.map((item) => {
                return item.id;
            }),
            scopes: user.scopes.filter((item) => {
                if (item.settings && item.settings.users == process.env.BASE_ROL_KEY)
                    return false;
                return true;
            }).map((item) => {
                return item.id;
            })
        };
        return {
            token: await this.jwtService.signAsync(payload, {
                secret: await this.getSecretByWorkSpace(workspaceScope)
            }),
        };
    }
    async getUserTokenByChannel(channel, workspaceScope = "default") {
        const user = await this.userService.findOneByChannel(channel);
        if (!user) {
            throw new common_1.NotFoundException("usuario no encontrado");
        }
        const payload = {
            id: user.id,
            username: user.username,
            roles: user.roles.map((item) => {
                return item.id;
            }),
            scopes: user.scopes.filter((item) => {
                if (item.settings && item.settings.users == process.env.BASE_ROL_KEY)
                    return false;
                return true;
            }).map((item) => {
                return item.id;
            })
        };
        return {
            token: await this.jwtService.signAsync(payload, {
                secret: await this.getSecretByWorkSpace(workspaceScope)
            }),
        };
    }
    async setUserChannel(username, channel) {
        let user = await this.userService.findOne(username);
        let data = user.get({ plain: true });
        if (!data.profile)
            data.profile = {};
        data.profile.channel = channel;
        await this.userService.update(data);
    }
    async signExternal(token, type, workspaceScope = "default", channel = null) {
        try {
            let opt;
            let payloadGoogle;
            switch (type) {
                case 'google':
                    let tokenData = this.jwtService.decode(token, { complete: true });
                    payloadGoogle = tokenData.payload;
                    let alg = tokenData.header.alg;
                    opt = {
                        secret: process.env.GOOGLE_SECRET,
                        algorithms: [alg]
                    };
                    break;
                default:
                    throw new common_1.UnauthorizedException();
            }
            console.log(opt, payloadGoogle);
            try {
                let user = await this.getUserToken(payloadGoogle.email, workspaceScope);
                if (channel)
                    await this.setUserChannel(payloadGoogle.email, channel);
                return user.token;
            }
            catch (error) {
                await this.signUpLegacy({
                    username: payloadGoogle.email,
                    profile: {
                        email: payloadGoogle.email
                    },
                    password: payloadGoogle.sub,
                    fullname: payloadGoogle.name
                }, true);
                let user = await this.getUserToken(payloadGoogle.email, workspaceScope);
                if (channel)
                    await this.setUserChannel(payloadGoogle.email, channel);
                return user.token;
            }
        }
        catch (error) {
            console.log(error, 'loggin');
            throw new common_1.UnauthorizedException();
        }
    }
    async signProvider(token, iss) {
        try {
            let typeArray = new URL(iss).hostname.split('.');
            typeArray.pop();
            let type = typeArray.pop().toUpperCase();
            if (process.env['OAUTH_USERINFO_' + type] == undefined) {
                throw new common_1.UnauthorizedException();
            }
            let payloadGoogle = await (0, rxjs_1.firstValueFrom)(this.httpService.get(process.env['OAUTH_USERINFO_' + type], {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }));
            try {
                let user = await this.getUserToken(payloadGoogle.data.email);
                return user;
            }
            catch (error) {
                await this.signUpLegacy({
                    username: payloadGoogle.data.email,
                    profile: {
                        email: payloadGoogle.data.email
                    },
                    password: payloadGoogle.data.sub + dayjs().toString(),
                    fullname: payloadGoogle.data.name
                }, true);
                let user = await this.getUserToken(payloadGoogle.data.email);
                return user;
            }
        }
        catch (error) {
            console.log(error, 'loggin');
            throw new common_1.UnauthorizedException();
        }
    }
    async signUpLegacy(payload, notCheck = false) {
        let userFind = await this.userService.findOne(payload.username);
        if (userFind)
            throw new common_1.ConflictException("User exist");
        let neg = await this.scopeService.getScopeUserRegister();
        if (!neg) {
            throw new common_1.PreconditionFailedException("No existe una estructura de registro para los usuarios");
        }
        if (!process.env.BASE_ROL_KEY)
            throw new common_1.PreconditionFailedException("No existe una configuracion rol base de registro para los usuarios");
        let role = await this.rolService.getBaseRegisterRole(process.env.BASE_ROL_KEY);
        if (!role)
            throw new common_1.PreconditionFailedException("No existe un rol base de registro para los usuarios");
        payload.state = notCheck ? 1 : 0;
        payload.profile.vCode = (Math.round(Math.random() * 1000000)).toString();
        let user = await this.userService.create(payload);
        await user.$set('roles', [role.id]);
        await user.$set('scopes', [neg.id]);
        if (notCheck)
            return;
    }
    async verifyCode(payload) {
        let userFind = await this.userService.findOne(payload.username);
        let profile = {};
        if (userFind.profile) {
            profile = Object.assign({}, userFind.profile);
        }
        profile.vCode = null;
        if (!userFind)
            throw new common_1.NotFoundException("User Not Exist");
        if (userFind.profile && userFind.profile.vCode && userFind.profile.vCode == payload.code) {
            if (payload.password) {
                await userFind.update({
                    password: payload.password,
                    state: 1,
                    profile: profile
                });
            }
            else {
                await userFind.update({
                    state: 1,
                    profile: profile
                });
            }
            return {
                message: "Ok"
            };
        }
        throw new common_1.ForbiddenException("Not valid code");
    }
    async recover(payload) {
        let userFind = await this.userService.findOne(payload.username);
        if (!userFind)
            throw new common_1.NotFoundException("User Not Exist");
        let profile = {};
        if (userFind.profile) {
            profile = Object.assign({}, userFind.profile);
        }
        profile.vCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        await userFind.update({
            profile: profile
        });
        let settings = await this.scopeService.getAppSettings(payload.tid, 'polisafe');
        let webhookConfigUrl = settings.find((setting) => {
            return setting.name == 'external.webhook.url';
        });
        let webhookConfigHeadersString = settings.find((setting) => {
            return setting.name == 'external.webhook.headers';
        });
        let webhookHeaders = {};
        if (webhookConfigHeadersString) {
            webhookHeaders = webhookConfigHeadersString.value.split(',').map((rowHeader) => {
                let row = rowHeader.split(':');
                return { [row[0]]: row[1] };
            });
        }
        try {
            if (webhookConfigUrl) {
                await this.notificationService.webhook(webhookConfigUrl.value, {
                    type: 'user:recover',
                    payload: {
                        fullname: userFind.fullname,
                        email: userFind.profile.email,
                        username: userFind.username,
                        code: profile.vCode
                    }
                }, {
                    ...webhookHeaders
                });
            }
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException("webhook fail");
        }
    }
    async signUp(payload, tid, notCheck = false) {
        let userFind = await this.userService.findByUsernameAndTenant(payload.username, tid);
        if (userFind)
            throw new common_1.ConflictException("User exist");
        let settings = await this.scopeService.getAppSettings(tid, 'polisafe');
        if (payload.extraSettings) {
            settings = settings.concat(await this.scopeService.getAppSettings(tid, payload.extraSettings));
        }
        let webhookConfigUrl = settings.find((setting) => {
            return setting.name == 'external.webhook.url';
        });
        let webhookConfigHeadersString = settings.find((setting) => {
            return setting.name == 'external.webhook.headers';
        });
        let webhookHeaders = {};
        if (webhookConfigHeadersString) {
            webhookHeaders = webhookConfigHeadersString.value.split(',').map((rowHeader) => {
                let row = rowHeader.split(':');
                return { [row[0]]: row[1] };
            });
        }
        let autoRoles = settings.find((setting) => {
            return setting.name == 'register.auto.roles';
        });
        let autoTenant = settings.find((setting) => {
            return setting.name == 'register.auto.tenant';
        });
        payload.state = notCheck ? 1 : 0;
        payload.profile.vCode = (Math.round(Math.random() * 1000000)).toString();
        let user = await this.userService.create(payload);
        if (autoRoles && autoRoles.value && Array.isArray(autoRoles.value))
            await user.$set('roles', autoRoles.value);
        let tenants = [];
        if (autoTenant && autoTenant.value && Array.isArray(autoTenant.value)) {
            tenants = tenants.concat(autoTenant.value);
        }
        else {
            tenants = [tid];
        }
        await user.$set('scopes', tenants);
        if (notCheck)
            return user;
        try {
            if (webhookConfigUrl) {
                await this.notificationService.webhook(webhookConfigUrl.value, {
                    type: 'user:signup',
                    payload: {
                        fullname: user.fullname,
                        email: user.profile.email,
                        username: user.username,
                        code: payload.profile.vCode,
                        url: `${this.urlService.getBaseUrl()}${this.configService.get('APP_PREFIX')}/polisafe/activation?username=${user.username}&code=${payload.profile.vCode}${payload.clientId ? '&client_id=' + payload.clientId : ''}`
                    }
                }, {
                    ...webhookHeaders
                });
            }
            return user;
        }
        catch (error) {
            await user.destroy();
            throw new common_1.ServiceUnavailableException("Comunication webhook failed");
        }
    }
    async authenticate(username, password, tid) {
        const user = await this.userService.findByUsernameAndTenant(username, tid);
        if (user && await bcrypt.compare(password, user.password)) {
            return {
                ...user.dataValues
            };
        }
        throw new common_1.UnauthorizedException();
    }
    async authenticateBySub(subject, password) {
        const user = await this.userService.findById(subject);
        if (user && await bcrypt.compare(password, user.password)) {
            return {
                ...user.dataValues
            };
        }
        throw new common_1.UnauthorizedException();
    }
};
exports.AuthService = AuthService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", user_service_1.UserService)
], AuthService.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", role_service_1.RoleService)
], AuthService.prototype, "rolService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], AuthService.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", notification_service_1.NotificationService)
], AuthService.prototype, "notificationService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], AuthService.prototype, "jwtService", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_session_1.SecuritySession),
    __metadata("design:type", Object)
], AuthService.prototype, "sessionModel", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", axios_1.HttpService)
], AuthService.prototype, "httpService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", url_service_1.UrlService)
], AuthService.prototype, "urlService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], AuthService.prototype, "configService", void 0);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map