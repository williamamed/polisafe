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
exports.InvitationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invitation_service_1 = require("../services/invitation.service");
const scope_service_1 = require("../services/scope.service");
const permission_decorator_1 = require("../../polisafe-sdk/decorators/permission.decorator");
const user_service_1 = require("../services/user.service");
let InvitationController = class InvitationController {
    async getList(user) {
        return this.invitationService.getByScope(Number(user.tenant));
    }
    async create(invitationDto, user) {
        invitationDto.idScope = Number(user.tenant);
        if (!invitationDto.meta)
            invitationDto.meta = {};
        invitationDto.meta.author = user.preferred_username;
        return this.invitationService.create(invitationDto);
    }
    destroy(invitationDto, tenant) {
        return this.invitationService.destroy(invitationDto);
    }
    async getListRoles(user) {
        return this.invitationService.getRoles(Number(user.tenant));
    }
    async getListUsers(user, offset, limit) {
        return await this.userService.getUsersByScopePage(Number(user.tenant), offset, null, limit ? limit : 50);
    }
    async rejectUser(invitationDto, tenantRoot, user) {
        return this.scopeService.removeUser(invitationDto);
    }
    addRoles(id, roles, user) {
        return this.userService.addRoles(id, roles, Number(user.tenant));
    }
};
exports.InvitationController = InvitationController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", invitation_service_1.InvitationService)
], InvitationController.prototype, "invitationService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", user_service_1.UserService)
], InvitationController.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], InvitationController.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Get)("list"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvitationController.prototype, "getList", null);
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InvitationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("delete"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.MapTenant)("idScope")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InvitationController.prototype, "destroy", null);
__decorate([
    (0, common_1.Get)("list-roles"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvitationController.prototype, "getListRoles", null);
__decorate([
    (0, common_1.Get)("list-users"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], InvitationController.prototype, "getListUsers", null);
__decorate([
    (0, common_1.Post)("reject-user"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.MapTenant)("idScope")),
    __param(2, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], InvitationController.prototype, "rejectUser", null);
__decorate([
    (0, common_1.Post)("add-roles"),
    __param(0, (0, common_1.Body)("id")),
    __param(1, (0, common_1.Body)("roles")),
    __param(2, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Object]),
    __metadata("design:returntype", void 0)
], InvitationController.prototype, "addRoles", null);
exports.InvitationController = InvitationController = __decorate([
    (0, common_1.Controller)('polizei/admin/invitation'),
    (0, swagger_1.ApiTags)("Invitation"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permission_decorator_1.Permission)()
], InvitationController);
//# sourceMappingURL=invitation.controller.js.map