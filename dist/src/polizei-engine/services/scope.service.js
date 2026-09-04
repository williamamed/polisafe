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
exports.ScopeService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const security_scope_1 = require("../models/security.scope");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = __importDefault(require("sequelize"));
const security_user_1 = require("../models/security.user");
const security_user_scope_1 = require("../models/security.user.scope");
const sequelize_3 = require("sequelize");
const core_1 = require("@nestjs/core");
const scope_settings_decorator_1 = require("../decorators/scope-settings.decorator");
let ScopeService = class ScopeService {
    constructor() {
        this.listeners = [];
    }
    async onModuleInit() {
        await this.discoverHandlers();
    }
    async discoverHandlers() {
        this.discoverService.getProviders().forEach(async (value) => {
            if (!value.instance)
                return;
            try {
                const prototype = Object.getPrototypeOf(value.instance);
                const methods = Object.getOwnPropertyNames(prototype)
                    .filter(name => name !== 'constructor' && typeof value.instance[name] === 'function');
                for (const methodName of methods) {
                    const metadata = Reflect.getMetadata('settings-save', value.instance[methodName]);
                    if (metadata) {
                        this.listeners.push({ instance: value.instance, method: methodName });
                    }
                }
            }
            catch (error) {
            }
        });
    }
    getScopes() {
        return this.scopeModel.findAll();
    }
    getScopesByParent(id) {
        return this.scopeModel.findAll({
            where: {
                idScope: id
            },
            attributes: {
                include: [
                    [sequelize_2.default.fn("COUNT", sequelize_2.default.col("scopes.id")), "childsCount"],
                ]
            },
            include: [{
                    model: this.scopeModel,
                    attributes: []
                }],
            group: ['SecurityScope.id']
        });
        return this.scopeModel.findAll({
            where: {
                idScope: id
            },
            attributes: {
                include: [
                    [sequelize_2.default.fn("COUNT", sequelize_2.default.col("scopes.id")), "childsCount"],
                    [sequelize_2.default.fn("COUNT", sequelize_2.default.col("users.id")), "userCount"]
                ]
            },
            include: [{
                    model: this.scopeModel,
                    attributes: []
                }, {
                    model: this.userModel,
                    attributes: []
                }],
            group: ['SecurityScope.id', 'users->SecurityUserScope.idUser', 'users->SecurityUserScope.idUser']
        });
    }
    getScopesTree(base) {
        return this.scopeModel.findAll({
            where: {
                idScope: base
            },
            include: [{
                    model: this.scopeModel,
                    nested: true
                }]
        });
    }
    async create(data) {
        return await this.scopeModel.create(data);
    }
    async update(data) {
        return await this.scopeModel.update(data, {
            where: {
                id: data.id
            }
        });
    }
    async destroy(data) {
        return await this.scopeModel.destroy({
            where: {
                id: data.id
            }
        });
    }
    async getAllUserScopes(base) {
        let scope = await this.scopeModel.findByPk(base, {
            include: [{
                    model: this.scopeModel
                }]
        });
        let scopes = [scope];
        for (const item of scope.scopes) {
            scopes = scopes.concat(await this.getAllUserScopes(item.id));
        }
        return scopes;
    }
    async isScopeAuthorize(key, app) {
        let legacyVersion = this.scopeModel.findOne({
            where: {
                settings: {
                    key: key
                }
            }
        });
        if (key.indexOf('sk_') == 0) {
            let segment = key.split('_');
            if (segment.length == 3) {
                let scope = await this.scopeModel.findByPk(segment[1]);
                if (scope && scope.settings && scope.settings.configApps) {
                    if (!app && scope.settings.configApps.global) {
                        for (const keyProperty in scope.settings.configApps.global) {
                            const property = scope.settings.configApps.global[keyProperty];
                            if (property.name == 'elegantio:apikey' && property.value == key) {
                                return scope;
                            }
                        }
                    }
                    if (app && scope.settings.configApps[app]) {
                        for (const keyProperty in scope.settings.configApps[app]) {
                            const property = scope.settings.configApps[app][keyProperty];
                            if (property.name == 'elegantio:apikey' && property.value == key) {
                                return scope;
                            }
                        }
                    }
                }
            }
        }
        return legacyVersion;
    }
    async getScope(id) {
        return this.scopeModel.findByPk(id);
    }
    async getUsersScope(id) {
        let scope = await this.scopeModel.findByPk(id, {
            include: this.userModel
        });
        return scope.users;
    }
    async addUser(data) {
        let userFind = await this.userModel.findOne({
            where: {
                username: data.username
            }
        });
        if (!userFind)
            throw new common_1.NotFoundException("User Not Found");
        userFind.$add('scopes', data.idScope);
        return data;
    }
    async addUsers(scope, usersId) {
        let scopeFind = await this.scopeModel.findByPk(scope);
        await scopeFind.$set('users', usersId);
    }
    async removeUser(data) {
        let userFind = await this.userModel.findOne({
            where: {
                id: data.id
            }
        });
        if (!userFind)
            throw new common_1.NotFoundException("User Not Found");
        userFind.$remove('scopes', data.idScope);
        return data;
    }
    async getScopesEditable(id) {
        let scopes = await this.getAllUserScopes(id);
        return scopes.filter((item) => {
            return !item.settings || (item.settings && !item.settings.users);
        });
    }
    async isIn(id, requestedScope) {
        let scopes = await this.getAllUserScopes(id);
        let scope = null;
        if (Array.isArray(requestedScope)) {
            scope = scopes.find((item) => {
                return requestedScope.includes(item.id);
            });
        }
        else {
            scope = scopes.find((item) => {
                return item.id == requestedScope;
            });
        }
        if (!scope)
            new common_1.PreconditionFailedException("out of scope");
        return scope;
    }
    async getUserScopes(id) {
        let scopes = await this.scopeModel.findAll({
            include: [{
                    model: this.userModel,
                    attributes: {
                        exclude: ['password', 'profile']
                    },
                    where: {
                        id: id
                    }
                }]
        });
        return scopes.filter((item) => {
            if (item.settings && item.settings.users == process.env.BASE_ROL_KEY)
                return false;
            return true;
        });
    }
    getNegociosScope() {
        return this.scopeModel.findOne({
            where: {
                settings: {
                    negocios: process.env.BASE_ROL_KEY
                }
            }
        });
    }
    getScopeUserRegister() {
        return this.scopeModel.findOne({
            where: {
                settings: {
                    users: process.env.BASE_ROL_KEY
                }
            }
        });
    }
    async getOwner(id) {
        let scope = await this.scopeModel.findOne({
            where: {
                id: id
            },
            include: [{
                    model: this.userModel,
                    attributes: {
                        exclude: ['password']
                    },
                    include: [{
                            model: this.userScopeModel
                        }]
                }],
            order: [
                [{ model: this.userModel, as: 'users' }, { model: this.userScopeModel, as: 'usersScopes' }, 'createdAt', 'ASC']
            ]
        });
        if (scope && scope.users.length > 0) {
            return scope.users[0];
        }
        throw new common_1.PreconditionFailedException();
    }
    getScopesByIds(scopes, options = {}) {
        return this.scopeModel.findAll({
            ...options,
            where: {
                id: {
                    [sequelize_3.Op.in]: scopes
                }
            }
        });
    }
    async editScope(data) {
        if (data.id) {
            let scope = await this.getScope(data.id);
            if (data.meta && scope.settings) {
                data.meta = {
                    ...scope.settings,
                    ...data.meta
                };
            }
            return await this.scopeModel.update(data, {
                where: {
                    id: data.id
                }
            });
        }
        else {
            return this.create(data);
        }
    }
    async getAppSettings(id, app) {
        let scope = await this.getScope(id);
        if (scope && scope.settings && scope.settings.configApps) {
            return scope.settings.configApps[app] ? scope.settings.configApps[app] : [];
        }
        return [];
    }
    async setAppSettings(id, app, settings) {
        let scope = await this.getScope(id);
        let current = scope.settings;
        if (!current) {
            current = {};
        }
        if (!current.configApps) {
            current.configApps = {
                global: {}
            };
        }
        for (let index = 0; index < this.listeners.length; index++) {
            const listener = this.listeners[index];
            await listener.instance[listener.method].call(listener.instance, {
                tenant: id,
                app: app,
                settings: settings
            });
        }
        current.configApps[app] = settings;
        await this.update({
            id: scope.id,
            settings: current
        });
        try {
            await this.cache.del(`iam:settings:${id}:${app}`);
            await this.cache.del(`iam:settings:${id}:${app}:any`);
            await this.cache.del(`iam:settings:${id}:${app}:public`);
            await this.cache.del(`iam:settings:${id}:${app}:private`);
        }
        catch (error) {
            common_1.Logger.warn(`[cache] del failed for iam:settings:${id}:${app}: ${error.message}`);
        }
        return await this.getAppSettings(id, app);
    }
    async onHubTenant(event) {
        let hub = event.settings.find((setting) => {
            return setting.name == 'register.hub.tenant';
        });
        if (hub && hub.value) {
            let tenant = await this.scopeModel.findByPk(hub.value);
            tenant.set('settings', {
                ...tenant.settings,
                'hub-reference': { tenant: event.tenant, app: event.app }
            })
                .save();
        }
    }
    async getParent(id) {
        let tenant = await this.scopeModel.findByPk(id);
        return await this.scopeModel.findByPk(tenant.idScope);
    }
    async getHubSettings(tenant) {
        let parent = await this.getParent(tenant);
        let id = tenant, app = 'polisafe';
        if (parent && parent.settings?.['hub-reference']) {
            let hub = parent.settings?.['hub-reference'];
            id = hub.tenant;
            app = hub.app;
        }
        let settings = await this.getAppSettings(id, 'polisafe');
        settings = settings.concat(await this.getAppSettings(id, app));
        return { id, settings, app };
    }
};
exports.ScopeService = ScopeService;
__decorate([
    (0, sequelize_1.InjectModel)(security_scope_1.SecurityScope),
    __metadata("design:type", Object)
], ScopeService.prototype, "scopeModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_1.SecurityUser),
    __metadata("design:type", Object)
], ScopeService.prototype, "userModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_scope_1.SecurityUserScope),
    __metadata("design:type", Object)
], ScopeService.prototype, "userScopeModel", void 0);
__decorate([
    (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER),
    __metadata("design:type", cache_manager_1.Cache)
], ScopeService.prototype, "cache", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", core_1.ModuleRef)
], ScopeService.prototype, "moduleRef", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", core_1.DiscoveryService)
], ScopeService.prototype, "discoverService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", core_1.Reflector)
], ScopeService.prototype, "reflector", void 0);
__decorate([
    (0, scope_settings_decorator_1.OnSettings)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScopeService.prototype, "onHubTenant", null);
exports.ScopeService = ScopeService = __decorate([
    (0, common_1.Injectable)()
], ScopeService);
//# sourceMappingURL=scope.service.js.map