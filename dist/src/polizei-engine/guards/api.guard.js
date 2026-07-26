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
exports.ApiGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const scope_service_1 = require("../services/scope.service");
let ApiGuard = class ApiGuard {
    constructor(reflector, scopeService) {
        this.reflector = reflector;
        this.scopeService = scopeService;
    }
    async canActivate(context) {
        const perm = this.reflector.get('permission', context.getHandler());
        const request = context.switchToHttp().getRequest();
        if (request.body && (request.body.apiKey || request.headers.apiKey)) {
            let result = await this.scopeService.isScopeAuthorize(request.headers.apiKey ? request.headers.apiKey : request.body.apiKey, 'polisafe');
            if (result) {
                request['rootBusiness'] = result;
                return true;
            }
        }
        throw new common_1.ForbiddenException();
    }
};
exports.ApiGuard = ApiGuard;
exports.ApiGuard = ApiGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector, scope_service_1.ScopeService])
], ApiGuard);
//# sourceMappingURL=api.guard.js.map