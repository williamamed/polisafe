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
exports.IoController = void 0;
const common_1 = require("@nestjs/common");
const permission_service_1 = require("../../services/permission.service");
const scope_service_1 = require("../../services/scope.service");
const trace_service_1 = require("../../services/trace.service");
const auth_service_1 = require("../../services/auth.service");
const role_service_1 = require("../../services/role.service");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../../services/user.service");
const permission_decorator_1 = require("../../../polisafe-sdk/decorators/permission.decorator");
const authorize_io_dto_1 = require("../../dto/authorize-io.dto");
let IoController = class IoController {
    async verifyAuthorization(data, root) {
        let access = await this.permissionService.isAuthorizedBySub(data.sub, data.url, data.method, Number(root.tid));
        if (!access)
            throw new common_1.NotFoundException();
        return access;
    }
    async getTenants(data, root) {
        return await this.scopeService.getAllUserScopes(Number(root.tid));
    }
    async getUsersScope(data, root) {
        return await this.scopeService.getUsersScope(data.id);
    }
    async getQueryUsers(data) {
        return await this.userService.findUsers(data.username);
    }
    async getScope(data) {
        return await this.scopeService.getScope(data.id);
    }
    async authorizeScope(data) {
        return await this.scopeService.isScopeAuthorize(data.apiKey);
    }
    async getUser(data) {
        return await this.authService.getUserToken(data.username, data.workspace);
    }
    async getUserPayload(data) {
        return await this.authService.getUserPayload(data.username, data.workspace);
    }
    async addUserUser(data) {
        return await this.scopeService.addUser(data);
    }
    async createUser(data) {
        return await this.authService.signUpLegacy(data.user, true);
    }
    async addUserRol(data) {
        return await this.roleService.addUser(data);
    }
    async addUserRoles(data) {
        let user = await this.userService.findOne(data.username);
        return await this.userService.addRoleList(user.id, data.roles);
    }
    async removeUserRoles(data) {
        let user = await this.userService.findOne(data.username);
        return await this.userService.removeRoles(user.id, data.roles);
    }
    async listUserRoles(data) {
        let user = await this.userService.findOne(data.username);
        return await this.userService.listRoles(user.id);
    }
    async removeUserUser(data) {
        return await this.scopeService.removeUser(data);
    }
    async getScopeOwner(data) {
        return await this.scopeService.getOwner(data.id);
    }
    async getScopesData(data) {
        return await this.scopeService.getScopesByIds(data.scopes, data.attr ? data.attr : {});
    }
    async addScopeData(data) {
        return await this.scopeService.editScope(data.scope);
    }
};
exports.IoController = IoController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", permission_service_1.PermissionService)
], IoController.prototype, "permissionService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", auth_service_1.AuthService)
], IoController.prototype, "authService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], IoController.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", role_service_1.RoleService)
], IoController.prototype, "roleService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", trace_service_1.TraceService)
], IoController.prototype, "traceService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", user_service_1.UserService)
], IoController.prototype, "userService", void 0);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('authorization'),
    (0, permission_decorator_1.Scope)('security:io:authorization', 'client'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authorize_io_dto_1.AuthorizeIoDto, Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "verifyAuthorization", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('tenants'),
    (0, permission_decorator_1.Scope)('security:io:tenants', 'client'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "getTenants", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('tenant/users'),
    (0, permission_decorator_1.Scope)('security:io:tenant:users', 'client'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "getUsersScope", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('users-search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "getQueryUsers", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('scope'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "getScope", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('auth-scope'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "authorizeScope", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('get-user-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "getUser", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('get-user-payload'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "getUserPayload", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('add-user-scope'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "addUserUser", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('create-user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "createUser", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('add-user-role'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "addUserRol", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('add-user-roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "addUserRoles", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('remove-user-roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "removeUserRoles", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('list-user-roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "listUserRoles", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('delete-user-scope'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "removeUserUser", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('scope-owner'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "getScopeOwner", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('scopes-ids'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "getScopesData", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('edit-scope'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "addScopeData", null);
exports.IoController = IoController = __decorate([
    (0, common_1.Controller)('polizei/io'),
    (0, swagger_1.ApiTags)("Polizei IO-Api"),
    (0, swagger_1.ApiBearerAuth)()
], IoController);
//# sourceMappingURL=io.controller.js.map