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
exports.AccessTokenService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const client_model_1 = require("../models/client.model");
const access_token_model_1 = require("../models/access-token.model");
let AccessTokenService = class AccessTokenService {
    async getRefresh(token) {
        let accessToken = await this.accessTokenModel.findOne({
            where: {
                token: token
            },
            include: [client_model_1.ClientModel]
        });
        return accessToken;
    }
    async geAccessTokenByClient(token, clientId) {
        let accessToken = await this.accessTokenModel.findOne({
            where: {
                token: token,
                clientId: clientId,
                isRevoked: false
            },
            include: [client_model_1.ClientModel]
        });
        return accessToken;
    }
    async geAccessTokenByUserAndClient(sub, clientId) {
        let accessToken = await this.accessTokenModel.findOne({
            where: {
                userId: sub,
                clientId: clientId,
                isRevoked: false
            },
            order: [['createdAt', 'DESC']]
        });
        return accessToken;
    }
    async revokeAllUser(userId, clientId) {
        return await this.accessTokenModel.update({
            isRevoked: true
        }, {
            where: {
                userId: userId,
                isRevoked: false,
                clientId: clientId
            }
        });
    }
    async revoke(token, clientId) {
        return await this.accessTokenModel.update({
            isRevoked: true
        }, {
            where: {
                token: token,
                isRevoked: false,
                clientId: clientId
            }
        });
    }
    async revokeById(id) {
        return await this.accessTokenModel.update({
            isRevoked: true
        }, {
            where: {
                id: id
            }
        });
    }
    async create(refreshToken) {
        return await this.accessTokenModel.create(refreshToken);
    }
};
exports.AccessTokenService = AccessTokenService;
__decorate([
    (0, sequelize_1.InjectModel)(access_token_model_1.AccessTokenModel),
    __metadata("design:type", Object)
], AccessTokenService.prototype, "accessTokenModel", void 0);
exports.AccessTokenService = AccessTokenService = __decorate([
    (0, common_1.Injectable)()
], AccessTokenService);
//# sourceMappingURL=access-token.service.js.map