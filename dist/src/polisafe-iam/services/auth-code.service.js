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
exports.AuthCodeService = void 0;
const common_1 = require("@nestjs/common");
const auth_code_model_1 = require("../models/auth-code.model");
const sequelize_1 = require("sequelize");
const moment = require("moment");
const crypto = require("crypto");
const sequelize_2 = require("@nestjs/sequelize");
let AuthCodeService = class AuthCodeService {
    async findByCode(code) {
        return await this.authCodeModel.findOne({
            where: {
                code: code
            }
        });
    }
    async findByValidCode(code) {
        return await this.authCodeModel.findOne({
            where: {
                code: code,
                expiresAt: {
                    [sequelize_1.Op.gte]: moment().toDate()
                }
            }
        });
    }
    async getActiveCodeByCodeClient(code, clientId, redirectUri) {
        return await this.authCodeModel.findOne({
            where: {
                code: code,
                clientId: clientId,
                redirectUri: redirectUri,
                expiresAt: {
                    [sequelize_1.Op.gte]: moment().toDate()
                }
            }
        });
    }
    async invalidateCode(code) {
        return await this.authCodeModel.update({
            expiresAt: moment().toDate()
        }, {
            where: {
                code: code
            }
        });
    }
    async getLastCodeByUserClient(clientId, userId, redirectUri) {
        return this.authCodeModel.findOne({
            where: {
                clientId: clientId,
                userId: userId,
                redirectUri: redirectUri
            },
            order: [['createdAt', 'DESC']]
        });
    }
    async getActiveCodeByUserClient(clientId, userId, redirectUri) {
        return this.authCodeModel.findOne({
            where: {
                clientId: clientId,
                username: userId,
                redirectUri: redirectUri,
                expiresAt: {
                    [sequelize_1.Op.gte]: moment().toDate()
                }
            },
            order: [['createdAt', 'DESC']]
        });
    }
    async create(data) {
        data.code = data.code ? data.code : crypto.randomBytes(32).toString('hex');
        if (!data.expiresAt) {
            data.expiresAt = moment().add(10, 'minutes').toDate();
            if (process.env.PLS_CODE_EXPIRE) {
                data.expiresAt = moment().add(parseInt(process.env.PLS_CODE_EXPIRE), 'minutes').toDate();
            }
        }
        return await this.authCodeModel.create(data);
    }
    async getConsentAuthCode(authRequest, userId, clientId) {
        let history = await this.getLastCodeByUserClient(clientId, userId, authRequest.redirect_uri);
        let validated = history;
        if (!history)
            return null;
        if (moment(history.expiresAt).isBefore(moment(), 'seconds')) {
            validated = await this.create({
                codeChallenge: authRequest.code_challenge,
                codeChallengeMethod: authRequest.code_challenge_method,
                scopes: authRequest.scope,
                clientId: history.clientId,
                redirectUri: history.redirectUri,
                userId: history.userId,
                expiresAt: null
            });
        }
        let newScopes = authRequest.scope.split(' ').map((sc) => sc.trim());
        let currentScopes = history.scopes.split(' ').map((sc) => sc.trim());
        return newScopes.filter(x => !currentScopes.includes(x)).length > 0 ? null : validated;
    }
};
exports.AuthCodeService = AuthCodeService;
__decorate([
    (0, sequelize_2.InjectModel)(auth_code_model_1.AuthorizationCodeModel),
    __metadata("design:type", Object)
], AuthCodeService.prototype, "authCodeModel", void 0);
exports.AuthCodeService = AuthCodeService = __decorate([
    (0, common_1.Injectable)()
], AuthCodeService);
//# sourceMappingURL=auth-code.service.js.map