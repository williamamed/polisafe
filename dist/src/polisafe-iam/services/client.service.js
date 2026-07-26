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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const client_model_1 = require("../models/client.model");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const crypto = require("crypto");
const auth_code_model_1 = require("../models/auth-code.model");
const scopes_model_1 = require("../models/scopes.model");
let ClientService = class ClientService {
    async verifyClient(client_id, secret) {
        let client = await this.clientModel.findOne({
            where: {
                clientId: client_id
            }
        });
        if (!client)
            throw new common_1.UnauthorizedException("Client not exist");
        const isMatch = secret == client.clientSecretHash;
        if (!isMatch)
            throw new common_1.UnauthorizedException("Wrong secret");
        return client;
    }
    async getClientByIdAndUri(idClient, uri) {
        return await this.clientModel.findOne({
            where: {
                clientId: idClient,
                redirectUris: {
                    [sequelize_2.Op.contains]: [uri]
                }
            },
            include: [auth_code_model_1.AuthorizationCodeModel, scopes_model_1.ScopesModel]
        });
    }
    async getClientById(idClient) {
        return await this.clientModel.findOne({
            where: {
                clientId: idClient
            },
            include: [auth_code_model_1.AuthorizationCodeModel, scopes_model_1.ScopesModel]
        });
    }
    async getClientByInternalId(id) {
        return await this.clientModel.findByPk(id, {
            include: [auth_code_model_1.AuthorizationCodeModel, scopes_model_1.ScopesModel]
        });
    }
    async getClientByTenant(tenant) {
        return await this.clientModel.findAll({
            where: {
                tenant: tenant
            },
            include: [scopes_model_1.ScopesModel],
            order: [['createdAt', 'ASC']]
        });
    }
    async getDeniedScopes(idClient, scopes) {
        let client = await this.clientModel.findOne({
            where: {
                clientId: idClient
            },
            include: [{
                    model: scopes_model_1.ScopesModel
                }]
        });
        let scopeList = scopes.split(' ').map((scope) => {
            return scope.trim();
        });
        let whiteList = client.scopes.map((scope) => {
            return scope.name.trim();
        });
        let denied = [];
        for (let index = 0; index < scopeList.length; index++) {
            const requestedScope = scopeList[index];
            if (whiteList.indexOf(requestedScope) < 0) {
                denied.push(requestedScope);
            }
        }
        return denied;
    }
    async create(client) {
        const id = crypto.randomBytes(32).toString('hex');
        const secret = crypto.randomBytes(32).toString('hex');
        let clientInst = await this.clientModel.create({
            clientId: client.id ? client.id : id,
            clientSecretHash: secret,
            redirectUris: client.redirectUris,
            grants: client.grants,
            tenant: client.tenant,
            name: client.name,
            type: client.type,
            meta: client.meta,
            postLogoutRedirectUris: client.postLogoutRedirectUris
        });
        if (client.scopes && client.scopes.length > 0)
            await clientInst.$add('scopes', client.scopes);
        return clientInst;
    }
    async update(client) {
        let [affect, clientInst] = await this.clientModel.update(client, {
            where: {
                id: client.id
            },
            returning: true
        });
        if (client.scopes && client.scopes.length > 0)
            await clientInst[0].$add('scopes', client.scopes);
        return clientInst[0];
    }
    async destroy(client) {
        return this.clientModel.destroy({
            where: {
                id: client.id
            }
        });
    }
};
exports.ClientService = ClientService;
__decorate([
    (0, sequelize_1.InjectModel)(client_model_1.ClientModel),
    __metadata("design:type", Object)
], ClientService.prototype, "clientModel", void 0);
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)()
], ClientService);
//# sourceMappingURL=client.service.js.map