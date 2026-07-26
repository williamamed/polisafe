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
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_service_1 = require("../../../polisafe-iam/services/client.service");
const scopes_service_1 = require("../../../polisafe-iam/services/scopes.service");
const permission_decorator_1 = require("../../../polisafe-sdk/decorators/permission.decorator");
let ClientsController = class ClientsController {
    async getList(user, tenant) {
        return this.clientsService.getClientByTenant(tenant);
    }
    async create(clientDto, user, tenant) {
        return this.clientsService.create(clientDto);
    }
    async update(clientDto, tenant) {
        return this.clientsService.update(clientDto);
    }
    destroy(clientDto, tenant) {
        return this.clientsService.destroy(clientDto);
    }
    async getListScopes(user, scope) {
        return this.scopesService.getByTenantAssigment(`${scope}`);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", client_service_1.ClientService)
], ClientsController.prototype, "clientsService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scopes_service_1.ScopesService)
], ClientsController.prototype, "scopesService", void 0);
__decorate([
    (0, common_1.Get)("list"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __param(1, (0, permission_decorator_1.MapTenant)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "getList", null);
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __param(2, (0, permission_decorator_1.MapTenant)('tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("update"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.MapTenant)('tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("delete"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.MapTenant)('tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "destroy", null);
__decorate([
    (0, common_1.Get)("list-scopes"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __param(1, (0, permission_decorator_1.MapTenant)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "getListScopes", null);
exports.ClientsController = ClientsController = __decorate([
    (0, common_1.Controller)('polizei/admin/oauth/clients'),
    (0, swagger_1.ApiTags)("Clients"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permission_decorator_1.Permission)()
], ClientsController);
//# sourceMappingURL=clients.controller.js.map