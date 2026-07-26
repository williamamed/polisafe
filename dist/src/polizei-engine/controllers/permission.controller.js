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
exports.PermissionController = void 0;
const common_1 = require("@nestjs/common");
const permission_service_1 = require("../services/permission.service");
const scope_service_1 = require("../services/scope.service");
const swagger_1 = require("@nestjs/swagger");
const permission_decorator_1 = require("../../polisafe-sdk/decorators/permission.decorator");
let PermissionController = class PermissionController {
    async getPermissions(id, tenant, user) {
        return this.permissionService.getPermissionsFlatByScopeArray([Number(user.tenant)]);
    }
    async create(permissionDto, user) {
        permissionDto.idScope = Number(user.tenant);
        return this.permissionService.create(permissionDto);
    }
    update(permissionDto, tenant) {
        return this.permissionService.update(permissionDto);
    }
    destroy(permissionDto, tenant) {
        if (permissionDto.ids)
            return this.permissionService.destroyGroupArray(permissionDto.ids);
        if (permissionDto.children)
            return this.permissionService.destroyGroup(permissionDto);
        return this.permissionService.destroy(permissionDto);
    }
    async importData(permissionDto, user) {
        await this.scopeService.isIn(Number(user.tenant), Number(permissionDto.idScope));
        permissionDto.idScope = permissionDto.idScope == 0 ? user.tenant : permissionDto.idScope;
        return this.permissionService.createBulk(permissionDto);
    }
};
exports.PermissionController = PermissionController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", permission_service_1.PermissionService)
], PermissionController.prototype, "permissionService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], PermissionController.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Get)("list"),
    __param(0, (0, common_1.Query)("id")),
    __param(1, (0, permission_decorator_1.MapTenant)("id")),
    __param(2, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("update"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.MapTenant)("idScope")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PermissionController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("delete"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.MapTenant)("idScope")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PermissionController.prototype, "destroy", null);
__decorate([
    (0, common_1.Post)("import"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "importData", null);
exports.PermissionController = PermissionController = __decorate([
    (0, common_1.Controller)('polizei/admin/permissions'),
    (0, swagger_1.ApiTags)("Permissions"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permission_decorator_1.Permission)()
], PermissionController);
//# sourceMappingURL=permission.controller.js.map