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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const scope_service_1 = require("../services/scope.service");
const swagger_1 = require("@nestjs/swagger");
const permission_decorator_1 = require("../../polisafe-sdk/decorators/permission.decorator");
let UserController = class UserController {
    async list(id, user, offset, search, limit) {
        await this.scopeService.isIn(Number(user.tenant), id);
        return await this.userService.getUsersByScopePage(id, offset, search, limit ? limit : 50);
    }
    async create(userDto, user) {
        await this.scopeService.isIn(Number(user.tenant), Number(userDto.idScope));
        return this.userService.create(userDto);
    }
    update(userDto, user) {
        return this.userService.update(userDto, Number(user.tenant));
    }
    destroy(userDto, user) {
        return this.userService.destroy(userDto, Number(user.tenant));
    }
    addRoles(id, roles, context, user) {
        return this.userService.addRoles(id, roles, context ? Number(user.tenant) : null);
    }
    async addUser(data, user) {
        await this.scopeService.isIn(Number(user.tenant), Number(data.idScope));
        return this.scopeService.removeUser(data);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", user_service_1.UserService)
], UserController.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], UserController.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Get)("list"),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Number, String, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("update"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("delete"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "destroy", null);
__decorate([
    (0, common_1.Post)("add-roles"),
    __param(0, (0, common_1.Body)("id")),
    __param(1, (0, common_1.Body)("roles")),
    __param(2, (0, common_1.Body)("context")),
    __param(3, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Boolean, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "addRoles", null);
__decorate([
    (0, common_1.Post)("delete-user-scope"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('polizei/admin/user'),
    (0, swagger_1.ApiTags)("User"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permission_decorator_1.Permission)()
], UserController);
//# sourceMappingURL=user.controller.js.map