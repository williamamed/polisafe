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
const log_enum_1 = require("../../../polisafe-iam/log.enum");
let IoController = class IoController {
    async verifyAuthorization(data, root) {
        let access = await this.permissionService.isAuthorizedBySub(data.sub, data.url, data.method, Number(root.tid));
        this.traceService.register(`${data.sub}`, Number(root.tid) || null, `Acceso ${access ? 'Permitido' : 'Denegado'}: ${data.url}`, access ? log_enum_1.LogType.AUTHORIZATION_API : log_enum_1.LogType.AUTHORIZATION_API_DENIED, {
            user: data.sub,
            url: data.sub,
            method: data.method,
            client: root
        }).catch(error => {
            console.error('Error al registrar trace:', error);
        });
        if (!access)
            throw new common_1.NotFoundException();
        return access;
    }
    async getTenants(data, root) {
        return await this.scopeService.getAllUserScopes(Number(root.tid));
    }
    async getAppSettings(app, tid, root) {
        if (!app)
            throw new common_1.BadRequestException("No se encontro el atributo `app` en la query de esta peticion");
        let tenant = Number(root.tid);
        if (tid) {
            if (!Number.isFinite(Number(tid)))
                throw new common_1.BadRequestException("El atributo `tid` de la query no es un tenant valido");
            tenant = Number(tid);
        }
        if (!await this.scopeService.isSameOrSubScope(Number(root.tid), tenant))
            throw new common_1.ForbiddenException(`Out of bound, tenant ${tenant} is not part of ${root.tid}`);
        return await this.scopeService.getAppSettings(tenant, app);
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
    (0, common_1.Get)('app-settings'),
    (0, permission_decorator_1.Scope)('security:io:app-settings', 'client'),
    __param(0, (0, common_1.Query)('app')),
    __param(1, (0, common_1.Query)('tid')),
    __param(2, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IoController.prototype, "getAppSettings", null);
exports.IoController = IoController = __decorate([
    (0, common_1.Controller)('polizei/io'),
    (0, swagger_1.ApiTags)("Polizei IO-Api"),
    (0, swagger_1.ApiBearerAuth)()
], IoController);
//# sourceMappingURL=io.controller.js.map