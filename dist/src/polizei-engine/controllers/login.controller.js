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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const user_service_1 = require("../services/user.service");
const creator_service_1 = require("../services/creator.service");
const jwt_1 = require("@nestjs/jwt");
const scope_service_1 = require("../services/scope.service");
const swagger_1 = require("@nestjs/swagger");
const invitation_service_1 = require("../services/invitation.service");
const register_dto_1 = require("../dto/register.dto");
const ip_service_1 = require("../services/ip.service");
let LoginController = class LoginController {
    async signUp(registerDto) {
        await this.authService.signUp({
            fullname: registerDto.fullname,
            profile: {
                email: registerDto.email
            },
            state: 0,
            username: registerDto.email,
            password: registerDto.password,
            extraSettings: 'polisafe-' + registerDto.client_id,
            clientId: registerDto.client_id
        }, Number(registerDto.tid), false);
        return {
            message: "user registered"
        };
    }
    async invitation(invitationDto) {
        return await this.invitationService.createUser(invitationDto);
    }
    async invitationState(query) {
        return await this.invitationService.getUserCurrentStatus(query.code);
    }
    async verify(verifyDto) {
        return await this.authService.verifyCode(verifyDto);
    }
    async recover(verifyDto) {
        await this.authService.recover(verifyDto);
        return {
            message: "code send"
        };
    }
    async picture(config) {
        let user = await this.userService.findOne(config.username);
        return {
            image: user.profile ? user.profile.idImage : null
        };
    }
    async ip(config) {
        return await this.ipService.getIpInfo();
    }
};
exports.LoginController = LoginController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", auth_service_1.AuthService)
], LoginController.prototype, "authService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", user_service_1.UserService)
], LoginController.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], LoginController.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", creator_service_1.CreatorService)
], LoginController.prototype, "creatorService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], LoginController.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", invitation_service_1.InvitationService)
], LoginController.prototype, "invitationService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", ip_service_1.IpService)
], LoginController.prototype, "ipService", void 0);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "signUp", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('invitation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "invitation", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('invitation-state'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "invitationState", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "verify", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('recover'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "recover", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('picture'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "picture", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('test-ip'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "ip", null);
exports.LoginController = LoginController = __decorate([
    (0, common_1.Controller)('polizei'),
    (0, swagger_1.ApiTags)("Polizei")
], LoginController);
//# sourceMappingURL=login.controller.js.map