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
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const refresh_token_model_1 = require("../models/refresh-token.model");
const client_model_1 = require("../models/client.model");
const access_token_model_1 = require("../models/access-token.model");
let RefreshTokenService = class RefreshTokenService {
    async getRefresh(token) {
        let refreshToken = await this.refreshTokenModel.findOne({
            where: {
                token: token
            },
            include: [client_model_1.ClientModel, access_token_model_1.AccessTokenModel]
        });
        return refreshToken;
    }
    async getRefreshByClient(token, clientId) {
        let refreshToken = await this.refreshTokenModel.findOne({
            where: {
                token: token,
                clientId: clientId,
                isRevoked: false
            },
            include: [client_model_1.ClientModel]
        });
        return refreshToken;
    }
    async revokeAllUser(userId) {
        return await this.refreshTokenModel.update({
            isRevoked: true
        }, {
            where: {
                userId: userId,
                isRevoked: false
            }
        });
    }
    async revoke(token, clientId) {
        return await this.refreshTokenModel.update({
            isRevoked: true
        }, {
            where: {
                token: token,
                isRevoked: false,
                clientId: clientId
            }
        });
    }
    async create(refreshToken) {
        return await this.refreshTokenModel.create(refreshToken);
    }
};
exports.RefreshTokenService = RefreshTokenService;
__decorate([
    (0, sequelize_1.InjectModel)(refresh_token_model_1.RefreshTokenModel),
    __metadata("design:type", Object)
], RefreshTokenService.prototype, "refreshTokenModel", void 0);
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)()
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map