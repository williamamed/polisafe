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
exports.IdentityService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const fs_1 = require("fs");
const user_service_1 = require("./user.service");
const config_1 = require("@nestjs/config");
let IdentityService = class IdentityService {
    async getToken(payload) {
        let token = await this.jwtService.signAsync(payload, {
            privateKey: (0, fs_1.readFileSync)(process.cwd() + "\\private.key").toString(),
            algorithm: 'RS256',
            expiresIn: '1s'
        });
        let refresh = await this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow("JWTKEY")
        });
        return {
            token: token,
            refreshToken: refresh
        };
    }
    async getPayloadByUser(user, workspaceScope = "default") {
        const payload = {
            id: user.id,
            username: user.username,
            roles: user.roles.map((item) => {
                return item.id;
            }),
            scopes: user.scopes.filter((item) => {
                if (item.settings && item.settings.users == process.env.BASE_ROL_KEY)
                    return false;
                return true;
            }).map((item) => {
                return item.id;
            })
        };
        return payload;
    }
    async getPayloadByUserName(username, workspaceScope = "default") {
        const user = await this.userService.findOne(username);
        if (!user) {
            throw new common_1.NotFoundException("usuario no encontrado");
        }
        return await this.getPayloadByUser(user);
    }
    createAsyncKey() {
        const crypto = require('crypto');
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
        console.log(privateKey, publicKey, __dirname);
        (0, fs_1.writeFileSync)(__dirname + "\\private.key", privateKey);
        (0, fs_1.writeFileSync)(__dirname + "\\public.key", publicKey);
    }
};
exports.IdentityService = IdentityService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], IdentityService.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", user_service_1.UserService)
], IdentityService.prototype, "userService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], IdentityService.prototype, "configService", void 0);
exports.IdentityService = IdentityService = __decorate([
    (0, common_1.Injectable)()
], IdentityService);
//# sourceMappingURL=identity.service.js.map