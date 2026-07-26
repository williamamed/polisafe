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
exports.ScopeController = void 0;
const common_1 = require("@nestjs/common");
const scope_service_1 = require("../services/scope.service");
const review_service_1 = require("../services/review.service");
const swagger_1 = require("@nestjs/swagger");
const permission_decorator_1 = require("../../polisafe-sdk/decorators/permission.decorator");
let ScopeController = class ScopeController {
    async getList(user, id) {
        await this.scopeService.isIn(Number(user.tenant), id);
        return this.scopeService.getScopesByParent(id);
    }
    async getListAll(user) {
        return this.scopeService.getAllUserScopes(Number(user.tenant));
    }
    async create(scopeDto, user) {
        await this.scopeService.isIn(Number(user.tenant), Number(scopeDto.idScope));
        return this.scopeService.create(scopeDto);
    }
    update(scopeDto) {
        return this.scopeService.update(scopeDto);
    }
    destroy(scopeDto) {
        return this.scopeService.destroy(scopeDto);
    }
    async getReview(user) {
        return this.reviewService.getReview(user.tenant);
    }
    async addUser(data, user) {
        await this.scopeService.isIn(Number(user.tenant), Number(data.idScope));
        data.idScope = data.idScope != 0 ? data.idScope : user.tenant;
        return this.scopeService.addUser(data);
    }
};
exports.ScopeController = ScopeController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], ScopeController.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", review_service_1.ReviewService)
], ScopeController.prototype, "reviewService", void 0);
__decorate([
    (0, common_1.Get)("list"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __param(1, (0, common_1.Query)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ScopeController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)("list-all"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScopeController.prototype, "getListAll", null);
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScopeController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("update"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScopeController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("delete"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScopeController.prototype, "destroy", null);
__decorate([
    (0, common_1.Get)("review"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScopeController.prototype, "getReview", null);
__decorate([
    (0, common_1.Post)("add-user"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScopeController.prototype, "addUser", null);
exports.ScopeController = ScopeController = __decorate([
    (0, common_1.Controller)('polizei/admin/scope'),
    (0, swagger_1.ApiTags)("Scope"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permission_decorator_1.Permission)()
], ScopeController);
//# sourceMappingURL=scope.controller.js.map