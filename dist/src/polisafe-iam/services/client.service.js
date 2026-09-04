"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const client_model_1 = require("../models/client.model");
const sequelize_1 = require("@nestjs/sequelize");
const crypto = __importStar(require("crypto"));
const scopes_model_1 = require("../models/scopes.model");
const cache_manager_1 = require("@nestjs/cache-manager");
let ClientService = class ClientService {
    constructor() {
        this.CLIENT_CACHE_TTL = 600000;
    }
    async verifyClient(client_id, secret) {
        let client = await this.getCachedClientByClientId(client_id);
        if (!client)
            throw new common_1.UnauthorizedException("Client not exist");
        const isMatch = secret == client.clientSecretHash;
        if (!isMatch)
            throw new common_1.UnauthorizedException("Wrong secret");
        return client;
    }
    async getClientByIdAndUri(idClient, uri) {
        const client = await this.getCachedClientByClientId(idClient);
        if (!client)
            return null;
        if (!(client.redirectUris ?? []).includes(uri))
            return null;
        return client;
    }
    async getClientById(idClient) {
        return await this.getCachedClientByClientId(idClient);
    }
    async getClientByInternalId(id) {
        const cacheKey = this.getClientPkCacheKey(id);
        const cached = await this.cacheGet(cacheKey);
        if (cached)
            return cached;
        const client = await this.clientModel.findByPk(id, {
            include: [scopes_model_1.ScopesModel]
        });
        if (!client)
            return null;
        const plain = this.toPlain(client);
        await this.cacheSet(cacheKey, plain);
        return plain;
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
        let client = await this.getCachedClientByClientId(idClient);
        let scopeList = scopes.split(' ').map((scope) => {
            return scope.trim();
        });
        let whiteList = (client?.scopes ?? []).map((scope) => {
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
        await this.invalidateClientCache(clientInst.clientId, clientInst.id);
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
        const updated = clientInst[0];
        await this.invalidateClientCache(updated.clientId, updated.id);
        return updated;
    }
    async destroy(client) {
        const current = await this.clientModel.findByPk(client.id);
        if (current) {
            await this.invalidateClientCache(current.clientId, current.id);
        }
        return this.clientModel.destroy({
            where: {
                id: client.id
            }
        });
    }
    async getCachedClientByClientId(clientId) {
        const cacheKey = this.getClientCacheKey(clientId);
        const cached = await this.cacheGet(cacheKey);
        if (cached)
            return cached;
        const client = await this.clientModel.findOne({
            where: {
                clientId
            },
            include: [scopes_model_1.ScopesModel]
        });
        if (!client)
            return null;
        const plain = this.toPlain(client);
        await this.cacheSet(cacheKey, plain);
        return plain;
    }
    toPlain(client) {
        if (!client)
            return null;
        return {
            id: client.id,
            clientId: client.clientId,
            clientSecretHash: client.clientSecretHash,
            name: client.name,
            type: client.type,
            tenant: client.tenant,
            grants: client.grants,
            redirectUris: client.redirectUris,
            postLogoutRedirectUris: client.postLogoutRedirectUris,
            meta: client.meta,
            roles: client.roles,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
            scopes: (client.scopes ?? []).map((scope) => ({
                id: scope.id,
                name: scope.name,
                displayName: scope.displayName,
                description: scope.description,
                tenant: scope.tenant
            }))
        };
    }
    getClientCacheKey(clientId) {
        return `client:${clientId}`;
    }
    getClientPkCacheKey(id) {
        return `client:pk:${id}`;
    }
    async invalidateClientCache(clientId, id) {
        await this.cacheDel(this.getClientCacheKey(clientId));
        await this.cacheDel(this.getClientPkCacheKey(id));
    }
    async cacheGet(key) {
        try {
            return await this.cache.get(key);
        }
        catch (error) {
            common_1.Logger.warn(`[cache] get failed for ${key}: ${error.message}`);
            return null;
        }
    }
    async cacheSet(key, value) {
        try {
            await this.cache.set(key, value, this.CLIENT_CACHE_TTL);
        }
        catch (error) {
            common_1.Logger.warn(`[cache] set failed for ${key}: ${error.message}`);
        }
    }
    async cacheDel(key) {
        try {
            await this.cache.del(key);
        }
        catch (error) {
            common_1.Logger.warn(`[cache] del failed for ${key}: ${error.message}`);
        }
    }
};
exports.ClientService = ClientService;
__decorate([
    (0, sequelize_1.InjectModel)(client_model_1.ClientModel),
    __metadata("design:type", Object)
], ClientService.prototype, "clientModel", void 0);
__decorate([
    (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER),
    __metadata("design:type", cache_manager_1.Cache)
], ClientService.prototype, "cache", void 0);
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)()
], ClientService);
//# sourceMappingURL=client.service.js.map