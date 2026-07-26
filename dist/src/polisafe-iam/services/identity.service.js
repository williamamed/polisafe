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
exports.IdentityService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const client_service_1 = require("./client.service");
const crypto = require("crypto");
const SCOPE_PATTERN = /^[a-z0-9-]+:[a-z-]+:[a-z-]+$/;
const URI_SCOPE_PATTERN = /^https:\/\/api\.[^/]+\/scopes\/[^#]+#[^.]+.[^#]+$/;
let IdentityService = class IdentityService {
    async onModuleInit() {
        this.discoverService.getProviders().forEach((value) => {
            if (!value.instance)
                return;
            try {
                const model = this.reflector.get('model-iam', value.metatype);
                if (model) {
                    this.model = value.instance;
                }
            }
            catch (error) {
            }
        });
    }
    getModel() {
        if (!this.model)
            throw new Error("No Iam model declared");
        return this.model;
    }
    async getAccessTokenClaims(data) {
        const scopesMap = new Map();
        const listScopes = data.scope ? data.scope.split(' ').map((value) => {
            scopesMap.set(value, {});
            return value;
        }) : [];
        let payload = {
            sub: data.user.id,
            scope: data.scope,
            tid: data.tid,
            tenants: data.user.tenants
        };
        listScopes.map(async (scopeName) => {
            switch (scopeName) {
                case 'profile': {
                    payload = {
                        ...payload,
                        roles: data.user.roles ?? [],
                        permissions: []
                    };
                    payload = {
                        ...payload,
                        tenants: data.user.tenants ?? [],
                        preferred_username: data.user.username
                    };
                    break;
                }
                case 'email':
                    payload = {
                        ...payload,
                        email: data.user.email
                    };
                    break;
                default:
                    break;
            }
        });
        return payload;
    }
    async getSettings(tenantId) {
        let settings = {
            login_name: 'Iniciar sesión',
            login_description: 'Utiliza tu Cuenta de Elegantys',
            login_icon_url: 'https://www.elegantys.net/identity/elegantys-min.png',
            login_button_next_name: 'Login',
            register_name: 'Crear cuenta',
            register_description: 'Utiliza tu Cuenta de Elegantys',
            register_icon_url: 'https://www.elegantys.net/identity/elegantys-min.png',
            register_button_name: 'Register',
            ...(await this.model.getTenantSettings(tenantId, 'polisafe'))
        };
        return settings;
    }
    async getClientSettings(tenantId, clientId) {
        let global = await this.getSettings(tenantId);
        let settings = {
            ...global,
            ...(await this.model.getTenantSettings(tenantId, 'polisafe-' + clientId))
        };
        return settings;
    }
    async getAppSettings(tenantId, app) {
        let global = await this.getSettings(tenantId);
        let settings = {
            ...global,
            ...(await this.model.getTenantSettings(tenantId, app))
        };
        return settings;
    }
    async getClaims2(sub, scope, client_id) {
        let user = {};
        let tenants = await this.model.getTenantsByUserId(sub);
        let payload = {};
        return payload;
    }
    async getPermissionsMapClient(scope, cliendId) {
        if (scope) {
            let root = await this.clientService.getClientById(cliendId);
            let listed = scope.split(' ');
            return root.scopes.map((perm) => {
                return {
                    name: perm.name,
                    displayName: perm.displayName,
                    description: perm.description
                };
            }).filter((perm) => listed.includes(perm.name));
        }
        return [];
    }
    async getPermissionsMap(scope, tenant) {
        if (scope) {
            let root = {};
            if (!root) {
                throw new common_1.PreconditionFailedException("Root Tenant not configured");
            }
            const scopesMap = {};
            const listScopes = scope.split(' ').filter((value) => {
                let scopePermission = { tenant: 'root', resource: '' };
                if (value.match(SCOPE_PATTERN)) {
                    scopePermission = this.parseScope(value);
                }
                else {
                    return;
                    scopePermission = { tenant: 'root', resource: '' };
                }
                if (scopesMap[scopePermission.tenant]) {
                    scopesMap[scopePermission.tenant].permissions = scopesMap[scopePermission.tenant].permissions.concat(scopePermission);
                }
                else {
                    scopesMap[scopePermission.tenant] = {
                        permissions: [scopePermission]
                    };
                }
            });
            let permissions = [];
            if (scopesMap[tenant])
                for (const element in scopesMap[tenant].permissions) {
                    const permission = scopesMap[tenant].permissions[element];
                    let scopeInst = root.find((perm) => {
                        return perm.name == permission.resource;
                    });
                    if (scopeInst)
                        permissions = permissions.concat([scopeInst]);
                }
            return permissions.map((permission) => {
                return {
                    name: permission.name,
                    description: permission.description
                };
            });
        }
        return [];
    }
    parseScope(scope) {
        const [tenant, resource] = scope.split(':');
        return { tenant, resource };
    }
    parseURIScope(scope) {
        const url = new URL(scope);
        const tenant = url.pathname.split('/').pop();
        const [resource, action] = url.hash.replace('#', '').split('.');
        return { tenant, resource, action };
    }
    generateRandomString(length = 43) {
        return crypto.randomBytes(32).toString('hex');
    }
};
exports.IdentityService = IdentityService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", core_1.DiscoveryService)
], IdentityService.prototype, "discoverService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", core_1.Reflector)
], IdentityService.prototype, "reflector", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", client_service_1.ClientService)
], IdentityService.prototype, "clientService", void 0);
exports.IdentityService = IdentityService = __decorate([
    (0, common_1.Injectable)()
], IdentityService);
//# sourceMappingURL=identity.service.js.map