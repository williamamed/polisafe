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
exports.RoleController = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("../services/role.service");
const scope_service_1 = require("../services/scope.service");
const swagger_1 = require("@nestjs/swagger");
const permission_decorator_1 = require("../../polisafe-sdk/decorators/permission.decorator");
let RoleController = class RoleController {
    async getList(id, user) {
        await this.scopeService.isIn(Number(user.tenant), id);
        return this.roleService.getRolesByScope(id);
    }
    async getListAssign(id, user) {
        await this.scopeService.isIn(Number(user.tenant), id);
        let scopes = await this.scopeService.getAllUserScopes(Number(user.tenant));
        if (scopes.length == 0)
            throw new common_1.PreconditionFailedException();
        return this.roleService.getRolesByScopeArray(scopes.map((item) => item.id));
    }
    async create(roleDto, user) {
        await this.scopeService.isIn(Number(user.tenant), Number(roleDto.idScope));
        return this.roleService.create(roleDto);
    }
    update(roleDto) {
        return this.roleService.update(roleDto);
    }
    destroy(roleDto) {
        return this.roleService.destroy(roleDto);
    }
    getPermissions(role) {
        return this.roleService.getRolePermissions(role);
    }
    addPermissions(id, permissions) {
        return this.roleService.addPermissions(id, permissions);
    }
};
exports.RoleController = RoleController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", role_service_1.RoleService)
], RoleController.prototype, "roleService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], RoleController.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Get)("list"),
    __param(0, (0, common_1.Query)("id")),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)("list-assign"),
    __param(0, (0, common_1.Query)("id")),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "getListAssign", null);
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoleController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("update"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("delete"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "destroy", null);
__decorate([
    (0, common_1.Get)("list-permissions"),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Post)("add-permissions"),
    __param(0, (0, common_1.Body)("id")),
    __param(1, (0, common_1.Body)("permissions")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "addPermissions", null);
exports.RoleController = RoleController = __decorate([
    (0, common_1.Controller)('polizei/admin/roles'),
    (0, swagger_1.ApiTags)("Roles"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permission_decorator_1.Permission)()
], RoleController);
//# sourceMappingURL=role.controller.js.map