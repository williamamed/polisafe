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
exports.IamModelService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const model_decorator_1 = require("../../polisafe-iam/decorators/model.decorator");
const user_service_1 = require("./user.service");
const permission_service_1 = require("./permission.service");
const scope_service_1 = require("./scope.service");
const role_service_1 = require("./role.service");
const auth_service_1 = require("./auth.service");
let IamModelService = class IamModelService {
    async findByEmail(email, tid) {
        let user = await this.userService.findByUsernameAndTenant(email, parseInt(tid));
        if (!user)
            throw new common_1.NotFoundException("user not found");
        return {
            ...user.dataValues,
            roles: user.roles ? user.roles.map((role) => role.id) : null,
            tenants: user.tenants ? user.tenants.map((tenant) => tenant.id) : null
        };
    }
    async findById(id) {
        let user = await this.userService.findById(parseInt(id));
        if (!user)
            throw new common_1.NotFoundException("user not found");
        return {
            passwordHash: user.password,
            username: user.username,
            email: user.profile.email,
            name: user.fullname,
            id: String(user.id),
            preferred_username: user.username,
            roles: user.roles ? user.roles.map((role) => String(role.id)) : null,
            tenants: user.scopes ? user.scopes.map((tenant) => String(tenant.id)) : null
        };
    }
    async validateUser(email, password, tid) {
        const user = await this.userService.findByUsernameAndTenant(email, parseInt(tid));
        if (user && await bcrypt.compare(password, user.password)) {
            return {
                ...user.dataValues
            };
        }
        return null;
    }
    getTenantsByUserId(userId) {
        return;
    }
    async getUserOrRegister(user, tid) {
        let userExist = await this.userService.findByUsernameAndTenant(user.email, Number(tid));
        if (!userExist) {
            userExist = await this.authService.signUp({
                fullname: user.fullname,
                state: 0,
                username: user.email,
                password: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
                profile: {
                    email: user.email,
                    picture: user.picture,
                    address: user.address,
                    phone: user.phone
                },
                ...user.extraSettings ? {
                    extraSettings: user.extraSettings
                } : {},
                clientId: user.clientId
            }, Number(tid), true);
        }
        return {
            ...userExist.dataValues
        };
    }
    async getUser(sub, tid) {
        let user = await this.userService.findById(parseInt(sub));
        let userName = this.parseFullNameAdvanced(user.fullname);
        let tenantsAvailable = await this.scopeService.getAllUserScopes(parseInt(tid));
        let tenantsId = tenantsAvailable.map((tenant) => String(tenant.id));
        let tenants = user.scopes
            .filter((tenant) => {
            return tenantsId.includes(String(tenant.id));
        });
        let rolesAvailable = await this.roleService.getRolesByScopeArray(tenantsId.map((tenant) => parseInt(tenant)));
        let rolesId = rolesAvailable.map((role) => String(role.id));
        let roles = user.roles
            .filter((role) => {
            return rolesId.includes(String(role.id));
        });
        return {
            "sub": String(user.id),
            "email_verified": user.profile && user.profile.email_verified ? user.profile.email_verified : false,
            "name": user.fullname,
            "preferred_username": user.username,
            "given_name": userName.given_name,
            "family_name": userName.family_name,
            "username": user.username,
            "id": String(user.id),
            "picture": user.profile?.idImage ? `${process.env.MEDIA_SERVICE_FILE_ENDPOINT}${user.profile?.idImage}` : "",
            "address": user.profile?.address ? `${user.profile?.address}` : "",
            "phone_number": user.profile?.phone ? `${user.profile?.phone}` : "",
            "email": user.profile.email,
            "tenants": tenants.map((tenant) => String(tenant.id)),
            "roles": roles.map((role) => String(role.id)),
            "mappedRoles": {},
            "tenantsObject": tenants.map((tenant) => {
                return {
                    name: tenant.name,
                    id: tenant.id
                };
            }),
            "rolesObject": roles.map((role) => {
                return {
                    name: role.name,
                    id: role.id,
                    tenant: role.SecurityUserRole.tenant
                };
            })
        };
    }
    async getTenantSettings(tenantId, app) {
        let appSettings = await this.scopeService.getAppSettings(Number(tenantId), app);
        let settings = {};
        appSettings.map((setting) => {
            switch (setting.name) {
                case 'register.title':
                    settings.register_name = setting.value;
                    break;
                case 'register.description':
                    settings.register_description = setting.value;
                    break;
                case 'register.icon':
                    settings.register_icon_url = setting.value;
                    break;
                case 'register.button.name':
                    settings.register_button_name = setting.value;
                    break;
                case 'login.title':
                    settings.login_name = setting.value;
                    break;
                case 'login.description':
                    settings.login_description = setting.value;
                    break;
                case 'login.icon':
                    settings.login_icon_url = setting.value;
                    break;
                case 'login.darkmode':
                    settings.login_darkmode = setting.value;
                    break;
                case 'login.darkmode':
                    settings.login_darkmode = setting.value;
                    break;
                case 'login.button.next.name':
                    settings.login_button_next_name = setting.value;
                    break;
                case 'login.button.register.name':
                    settings.login_button_register_name = setting.value;
                    break;
                case 'login.css.url':
                    settings.login_css_url = setting.value;
                    break;
                case 'login.register.url':
                    settings.login_register_url = setting.value;
                    break;
                case 'login.google.provider':
                    settings.login_google_provider = setting.value;
                    break;
                case 'login.google.client_id':
                    settings.login_google_client_id = setting.value;
                    break;
                case 'login.google.client_secret':
                    settings.login_google_client_secret = setting.value;
                    break;
                case 'login.linkedin.provider':
                    settings.login_linkedin_provider = setting.value;
                    break;
                case 'login.linkedin.client_id':
                    settings.login_linkedin_client_id = setting.value;
                    break;
                case 'login.linkedin.client_secret':
                    settings.login_linkedin_client_secret = setting.value;
                    break;
                case 'login.facebook.provider':
                    settings.login_facebook_provider = setting.value;
                    break;
                case 'login.facebook.client_id':
                    settings.login_facebook_client_id = setting.value;
                    break;
                case 'login.facebook.client_secret':
                    settings.login_facebook_client_secret = setting.value;
                    break;
                case 'login.github.provider':
                    settings.login_github_provider = setting.value;
                    break;
                case 'login.github.client_id':
                    settings.login_github_client_id = setting.value;
                    break;
                case 'login.github.client_secret':
                    settings.login_github_client_secret = setting.value;
                case 'login.language':
                    settings.login_language = setting.value;
                    break;
                case 'login.magiclink':
                    settings.login_magic_link = setting.value;
                    break;
                case 'external.webhook.url':
                    settings.external_webhook_url = setting.value;
                    break;
                case 'external.webhook.headers':
                    settings.external_webhook_headers = setting.value;
                    break;
                case 'contact.support':
                    settings.contact_support = setting.value;
                    break;
                default:
                    break;
            }
        });
        return settings;
    }
    async getPermissionsByTenant(tenant) {
        return await this.permissionService.getPermissionsFlatByScope(parseInt(tenant));
    }
    async getPermissionsByRoles(roles) {
        let permissions = await this.permissionService.getPermissionsRolesFlat(roles.map((role) => parseInt(role)));
        return permissions.map((perm) => {
            return {
                name: perm.name,
                type: perm.settings && perm.settings.type ? perm.settings.type : null
            };
        });
    }
    parseFullNameAdvanced(fullname) {
        if (!fullname || typeof fullname !== 'string') {
            return { given_name: "", family_name: "" };
        }
        const name = fullname.trim();
        if (name.includes(',')) {
            const [family, given] = name.split(',').map(part => part.trim());
            return {
                given_name: given,
                family_name: family
            };
        }
        const prefixes = ['Dr.', 'Dr', 'Mr.', 'Mr', 'Mrs.', 'Mrs', 'Ms.', 'Ms', 'Prof.', 'Prof'];
        let cleanName = name;
        let prefix = '';
        for (const p of prefixes) {
            if (name.startsWith(p + ' ')) {
                prefix = p;
                cleanName = name.substring(p.length).trim();
                break;
            }
        }
        const parts = cleanName.split(/\s+/);
        if (parts.length === 1) {
            return {
                given_name: parts[0],
                family_name: ""
            };
        }
        const family_name = parts[parts.length - 1];
        const given_name = parts.slice(0, -1).join(" ");
        return {
            given_name: prefix ? `${prefix} ${given_name}`.trim() : given_name,
            family_name: family_name
        };
    }
};
exports.IamModelService = IamModelService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", user_service_1.UserService)
], IamModelService.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", auth_service_1.AuthService)
], IamModelService.prototype, "authService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], IamModelService.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", role_service_1.RoleService)
], IamModelService.prototype, "roleService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", permission_service_1.PermissionService)
], IamModelService.prototype, "permissionService", void 0);
exports.IamModelService = IamModelService = __decorate([
    (0, common_1.Injectable)(),
    (0, model_decorator_1.IamModel)()
], IamModelService);
//# sourceMappingURL=iam-model.service.js.map