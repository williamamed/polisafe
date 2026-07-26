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
exports.InvitationService = void 0;
const common_1 = require("@nestjs/common");
const security_invitation_1 = require("../models/security.invitation");
const sequelize_1 = require("@nestjs/sequelize");
const security_scope_1 = require("../models/security.scope");
const sequelize_2 = require("sequelize");
const user_service_1 = require("./user.service");
const auth_service_1 = require("./auth.service");
const scope_service_1 = require("./scope.service");
const notification_service_1 = require("./notification.service");
const role_service_1 = require("./role.service");
const url_service_1 = require("./url.service");
const config_1 = require("@nestjs/config");
let InvitationService = class InvitationService {
    getByScope(base) {
        return this.invitationModel.findAll({
            where: {
                idScope: base,
                state: {
                    [sequelize_2.Op.in]: [0, 1]
                }
            },
            include: [{
                    model: security_scope_1.SecurityScope
                }]
        });
    }
    getById(id) {
        return this.invitationModel.findByPk(id);
    }
    async create(data) {
        if (!data.meta)
            data.meta = {};
        let { settings, app, id } = await this.scopeService.getHubSettings(data.idScope);
        let roles = settings.find((setting) => {
            return setting.name == 'invitation.roles';
        });
        if (roles && roles.value && Array.isArray(roles.value)) {
            data.meta.roles = data.meta.roles.filter((role) => roles.value.includes(role));
        }
        data.meta.link = '';
        let inv = await this.invitationModel.create(data);
        let link = `${this.urlService.getBaseUrl()}${this.configService.get('APP_PREFIX')}/polisafe/invitation?code=${inv.id}&${app == 'polisafe' ? 'tid=' + id : 'client_id=' + app.replace('polisafe-', '')}`;
        await inv.set('meta', {
            ...inv.meta,
            link: link
        }).save();
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
                    type: 'user:invitation',
                    payload: {
                        email: data.email,
                        description: data.description,
                        author: data.meta.author,
                        url: link
                    }
                }, {
                    ...webhookHeaders
                });
            }
        }
        catch (error) {
        }
        return inv;
    }
    async update(data) {
        return await this.invitationModel.update(data, {
            where: {
                id: data.id
            }
        });
    }
    async destroy(data) {
        return await this.invitationModel.destroy({
            where: {
                id: data.id
            }
        });
    }
    async getUserCurrentStatus(idInvitation) {
        let invitation = await this.getById(idInvitation);
        if (!invitation)
            throw new common_1.NotFoundException("Invitation not found");
        let { id } = await this.scopeService.getHubSettings(invitation.idScope);
        let user = await this.userService.findByEmailAndTenant(invitation.email, id);
        await this.update({
            id: invitation.id,
            state: 1
        });
        let scope = await this.scopeService.getScope(invitation.idScope);
        return {
            action: user ? 'JOIN' : 'CREATE',
            invitation: invitation,
            scope: {
                name: scope.name,
                description: scope.description,
                picture: scope.settings && scope.settings.picture ? scope.settings.picture : null
            }
        };
    }
    async createUser(invitationDto) {
        let invitation = await this.getById(invitationDto.code);
        if (!invitation)
            throw new common_1.NotFoundException("Invitation not found");
        let { id, app } = await this.scopeService.getHubSettings(invitation.idScope);
        let user = await this.userService.findByEmailAndTenant(invitation.email, id);
        if (user) {
            await this.scopeService.addUser({
                idScope: invitation.idScope,
                username: user.username
            });
        }
        if (!user) {
            await this.authService.signUp({
                username: invitation.email,
                fullname: invitationDto.fullname,
                password: invitationDto.password,
                profile: {
                    email: invitation.email
                },
                state: 0,
                extraSettings: app
            }, id, true);
            user = await this.userService.findOne(invitation.email);
        }
        await this.scopeService.addUser({
            username: invitation.email,
            idScope: invitation.idScope
        });
        if (invitation.meta && invitation.meta.roles) {
            await this.userService.addRoles(user.id, invitation.meta.roles, invitation.idScope);
        }
        await this.destroy({
            id: invitation.id
        });
    }
    async getRoles(tenant) {
        let { settings } = await this.scopeService.getHubSettings(tenant);
        let roles = settings.find((setting) => {
            return setting.name == 'invitation.roles';
        });
        if (roles && roles.value && Array.isArray(roles.value)) {
            return await this.roleService.getRolesByArray(roles.value);
        }
        return [];
    }
    async setRoles(workTenant, targetUserId, rolesId, tid, clientId) {
        let settings = await this.scopeService.getAppSettings(tid, 'polisafe');
        settings = settings.concat(await this.scopeService.getAppSettings(tid, 'polisafe-' + clientId));
        let validRoles = [];
        let roles = settings.find((setting) => {
            return setting.name == 'invitation.roles';
        });
        let shared = settings.find((setting) => {
            return setting.name == 'invitation.shared.roles';
        });
        if (roles && roles.value && Array.isArray(roles.value)) {
            validRoles = await this.roleService.getRolesByArray(roles.value);
        }
        let user = await this.userService.findById(targetUserId);
        let tenants = await user.$get('scopes');
        let currentRoles = await user.$get('roles');
        if (!tenants.find((t) => Number(t) == workTenant))
            throw new common_1.ForbiddenException("Target user out of scope");
        let targetRoles = rolesId.filter((role) => {
            return validRoles.find((validRole) => {
                return validRole.id == role;
            });
        });
        currentRoles = currentRoles.filter((role) => {
            return !targetRoles.find((t) => role.id == t);
        });
        return await user.$set("roles", currentRoles.map((role) => role.id));
    }
};
exports.InvitationService = InvitationService;
__decorate([
    (0, sequelize_1.InjectModel)(security_invitation_1.SecurityInvitation),
    __metadata("design:type", Object)
], InvitationService.prototype, "invitationModel", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", user_service_1.UserService)
], InvitationService.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", auth_service_1.AuthService)
], InvitationService.prototype, "authService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], InvitationService.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", role_service_1.RoleService)
], InvitationService.prototype, "roleService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", notification_service_1.NotificationService)
], InvitationService.prototype, "notificationService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", url_service_1.UrlService)
], InvitationService.prototype, "urlService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], InvitationService.prototype, "configService", void 0);
exports.InvitationService = InvitationService = __decorate([
    (0, common_1.Injectable)()
], InvitationService);
//# sourceMappingURL=invitation.service.js.map