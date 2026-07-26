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
exports.ClaimsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permission_service_1 = require("../services/permission.service");
let ClaimsGuard = class ClaimsGuard {
    constructor(reflector, permissionService) {
        this.reflector = reflector;
        this.permissionService = permissionService;
    }
    async canActivate(context) {
        const perm = this.reflector.get('permission', context.getHandler());
        const request = context.switchToHttp().getRequest();
        if (request.user.roles?.length > 0) {
            let result = await this.permissionService.isAuthorizedByUser(request.user.username, request.route.path);
            if (result || process.env.TR_MODE == "development")
                return true;
        }
        throw new common_1.ForbiddenException();
    }
};
exports.ClaimsGuard = ClaimsGuard;
exports.ClaimsGuard = ClaimsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector, permission_service_1.PermissionService])
], ClaimsGuard);
//# sourceMappingURL=claims.guard.js.map