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
exports.PrivilegesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let PrivilegesGuard = class PrivilegesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        const permissionMethod = this.reflector.get('permission', context.getHandler());
        const permissionClass = this.reflector.get('permission', context.getClass());
        const request = context.switchToHttp().getRequest();
        const user = request['user'];
        let effectivePerm = permissionMethod ? permissionMethod : permissionClass;
        if (!process.env.PERMISSION_CHECK) {
            common_1.Logger.warn(`Permission check development disabled: ${effectivePerm} - ${request.url}`);
            return true;
        }
        if (user.permissions) {
            return user.permissions.includes(effectivePerm);
        }
        else {
            return false;
        }
        if (user.scope) {
            const mapScopes = user.scope.split(' ');
            let index = mapScopes.indexOf('dynamic');
        }
        return true;
    }
};
exports.PrivilegesGuard = PrivilegesGuard;
exports.PrivilegesGuard = PrivilegesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PrivilegesGuard);
//# sourceMappingURL=privileges.guard.js.map