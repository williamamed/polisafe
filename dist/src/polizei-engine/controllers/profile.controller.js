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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const permission_service_1 = require("../services/permission.service");
const auth_service_1 = require("../services/auth.service");
const scope_service_1 = require("../services/scope.service");
const swagger_1 = require("@nestjs/swagger");
const permission_decorator_1 = require("../../polisafe-sdk/decorators/permission.decorator");
const user_update_dto_1 = require("../dto/user-update.dto");
const change_password_dto_1 = require("../dto/change-password.dto");
let ProfileController = class ProfileController {
    async user(user, include, defaultScope) {
        let userData = await this.userService.getUserData(user.preferred_username);
        let scopes = userData.scopes.filter((item) => {
            if (item.settings && item.settings.users == process.env.BASE_ROL_KEY)
                return false;
            return true;
        });
        if (defaultScope && scopes.length == 0) {
            let neg = await this.scopeService.getNegociosScope();
            if (neg) {
                let scopeDto = {
                    name: 'Mi Negocio',
                    description: 'Negocio creado por defecto, cambie esta descripción y el nombre',
                    idScope: neg.id
                };
                let scope = await this.scopeService.create(scopeDto);
                scopes.push(scope);
                await this.scopeService.addUser({
                    username: user.preferred_username,
                    idScope: scope.id
                });
                userData = await this.userService.getUserData(user.preferred_username);
            }
        }
        userData.dataValues.scopes = scopes;
        userData.scopes = scopes;
        let check = await this.authService.revalidate(userData, user);
        return {
            user: userData,
            permissions: include ? await this.permissionService.getPermissionsUserFlat(user.preferred_username) : [],
            revalidate: check.revalidate ? check.token : false
        };
    }
    async update(userDto, user) {
        userDto.id = Number(user.sub);
        await this.userService.update(userDto);
        return {
            ok: true
        };
    }
    async password(userDto, user) {
        try {
            await this.authService.authenticateBySub(Number(user.sub), userDto.currentPassword);
        }
        catch (error) {
            throw new common_1.UnauthorizedException("WRONG_CURRENT_PASSWORD");
        }
        await this.userService.update({
            id: user.id,
            password: userDto.newPassword
        });
        return {
            ok: true
        };
    }
    async permissions(user) {
        return await this.permissionService.getPermissionsRolesFlat(user.roles.map((role) => Number(role)));
    }
    async scopes(user) {
        return await this.scopeService.getUserScopes(user.id);
    }
    async searchUser(data) {
        return await this.userService.findUsers(data.username);
    }
    async saveScope(scopeDto, user) {
        let neg = await this.scopeService.getNegociosScope();
        if (neg) {
            if (scopeDto.id) {
                let owner = await this.scopeService.getOwner(scopeDto.id);
                if (owner.id != scopeDto.id) {
                    throw new common_1.ForbiddenException("Out of bound, you are not owner");
                }
                if (scopeDto.users) {
                    this.scopeService.addUsers(scopeDto.id, scopeDto.users.map((item) => item.id));
                }
                return this.scopeService.update(scopeDto);
            }
            else {
                scopeDto.idScope = neg.id;
                let scope = await this.scopeService.create(scopeDto);
                if (scopeDto.users) {
                    this.scopeService.addUsers(scope.id, scopeDto.users.map((item) => item.id));
                }
                return await this.scopeService.addUser({
                    username: user.preferred_username,
                    idScope: scope.id
                });
            }
        }
        throw new common_1.PreconditionFailedException();
    }
    async deleteScope(scopeDto, user) {
        if (scopeDto.force) {
            let userOwner = await this.scopeService.getOwner(scopeDto.id);
            if (user && userOwner.id == Number(user.sub)) {
                return this.scopeService.destroy(scopeDto);
            }
            else {
                throw new common_1.ForbiddenException("Cannot remove scope, you are not the owner");
            }
        }
        else {
            return await this.scopeService.removeUser({
                idScope: scopeDto.id,
                username: user.preferred_username
            });
        }
    }
    async scopeSettings(data, user) {
        let users = await this.scopeService.getUsersScope(data.id);
        if (users.filter((u) => u.id == Number(user.sub)).length == 0) {
            throw new common_1.ForbiddenException("Out of bound, you are not part of this organization");
        }
        return await this.scopeService.getAppSettings(data.id, data.app);
    }
    async setScopeSettings(data, user) {
        let users = await this.scopeService.getUsersScope(data.id);
        if (users.filter((u) => u.id == Number(user.sub)).length == 0) {
            throw new common_1.ForbiddenException("Out of bound, you are not part of this organization");
        }
        return await this.scopeService.setAppSettings(data.id, data.app, data.settings);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", user_service_1.UserService)
], ProfileController.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", auth_service_1.AuthService)
], ProfileController.prototype, "authService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", permission_service_1.PermissionService)
], ProfileController.prototype, "permissionService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], ProfileController.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Get)("user"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __param(1, (0, common_1.Query)("includePermissions")),
    __param(2, (0, common_1.Query)("createDefaultScope")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "user", null);
__decorate([
    (0, common_1.Post)("update"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_update_dto_1.UserUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("password"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "password", null);
__decorate([
    (0, common_1.Get)("permissions"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "permissions", null);
__decorate([
    (0, common_1.Get)("scopes"),
    __param(0, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "scopes", null);
__decorate([
    (0, common_1.Get)("search-user"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "searchUser", null);
__decorate([
    (0, common_1.Post)("save-scope"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "saveScope", null);
__decorate([
    (0, common_1.Post)("delete-scope"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "deleteScope", null);
__decorate([
    (0, common_1.Get)("get-scope-settings"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "scopeSettings", null);
__decorate([
    (0, common_1.Post)("set-scope-settings"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, permission_decorator_1.UserToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "setScopeSettings", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)('polizei/profile'),
    (0, swagger_1.ApiTags)("Profile"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permission_decorator_1.Permission)()
], ProfileController);
//# sourceMappingURL=profile.controller.js.map