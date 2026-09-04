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
exports.KeyService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const key_model_1 = require("../models/key.model");
const sequelize_1 = require("@nestjs/sequelize");
const dayjs = require("dayjs");
const cache_manager_1 = require("@nestjs/cache-manager");
let KeyService = class KeyService {
    constructor() {
        this.JWKS_CACHE_TTL = 600000;
    }
    get activeKeyCacheTtl() {
        return parseInt(process.env.KEY_ACTIVE_CACHE_TTL, 10) || 300000;
    }
    async getKeys(tenant) {
        return await this.keyModel.findAll({
            where: {
                ...tenant ? {
                    tenant
                } : {}
            },
            order: [['createdAt', 'DESC']]
        });
    }
    async getLastActiveKeys(tenant) {
        let keys = await this.keyModel.findAll({
            where: {
                ...tenant ? {
                    tenant
                } : {}
            },
            order: [['createdAt', 'DESC']],
            limit: 2
        });
        return keys;
    }
    async getActiveKey(tenant) {
        const cacheKey = this.getActiveKeyCacheKey(tenant);
        const cached = await this.cacheGet(cacheKey);
        if (cached)
            return key_model_1.KeyModel.build(cached);
        let active = await this.keyModel.findOne({
            where: {
                ...tenant ? {
                    tenant
                } : {},
            },
            order: [['createdAt', 'DESC']]
        });
        if (!active)
            return await this.create(tenant);
        if (active && dayjs().subtract(1, 'day').diff(dayjs(active.createdAt), 'day') * -1 > 1)
            return await this.create(tenant);
        await this.cacheSet(cacheKey, active.get({ plain: true }), this.activeKeyCacheTtl);
        return active;
    }
    async getKey(kid) {
        let active = await this.keyModel.findOne({
            where: {
                kid: kid
            }
        });
        return active;
    }
    async create(tenant) {
        const keys = this.createAsyncKey();
        const key = await this.keyModel.create({
            kid: crypto.randomBytes(32).toString('hex'),
            publicKeyPem: keys.publicKey,
            privateKeyPem: keys.privateKey,
            active: true,
            tenant: tenant ?? null
        });
        await this.invalidateJwks(tenant);
        await this.invalidateActiveKey(tenant);
        return key;
    }
    createAsyncKey() {
        return crypto.generateKeyPairSync('rsa', {
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
    }
    async getJwks(tenant) {
        const cacheKey = `jwks:${tenant ?? 'default'}`;
        try {
            const cached = await this.cache.get(cacheKey);
            if (cached)
                return cached;
        }
        catch (error) {
            common_1.Logger.warn(`[cache] getJwks get failed for ${cacheKey}: ${error.message}`);
        }
        let actives = await this.getLastActiveKeys(tenant);
        const jwks = {
            keys: actives.map((key) => {
                const { modulus, exponent } = this.extractRSAParameters(key.publicKeyPem);
                return {
                    alg: 'RS256',
                    kty: 'RSA',
                    use: 'sig',
                    kid: key.kid,
                    n: modulus,
                    e: exponent,
                    x5c: this.extractX5c(key.publicKeyPem)
                };
            })
        };
        try {
            await this.cache.set(cacheKey, jwks, this.JWKS_CACHE_TTL);
        }
        catch (error) {
            common_1.Logger.warn(`[cache] getJwks set failed for ${cacheKey}: ${error.message}`);
        }
        return jwks;
    }
    async invalidateJwks(tenant) {
        const cacheKey = `jwks:${tenant ?? 'default'}`;
        try {
            await this.cache.del(cacheKey);
            common_1.Logger.debug(`[cache] jwks invalidated for ${cacheKey}`);
        }
        catch (error) {
            common_1.Logger.warn(`[cache] jwks invalidate failed for ${cacheKey}: ${error.message}`);
        }
    }
    getEncodedModulus(modulusBase64) {
        return modulusBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    getEncodedExponent(exponentBase64) {
        return exponentBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    extractRSAParameters(publicKeyPem) {
        try {
            const publicKey = crypto.createPublicKey(publicKeyPem);
            const jwk = publicKey.export({ format: 'jwk' });
            return {
                modulus: jwk.n,
                exponent: jwk.e
            };
        }
        catch (error) {
            throw new Error(`Error procesando clave pública: ${error.message}`);
        }
    }
    extractX5c(certPem) {
        const base64Cert = certPem
            .replace(/-----BEGIN PUBLIC KEY-----/g, '')
            .replace(/-----END PUBLIC KEY-----/g, '')
            .replace(/\n/g, '')
            .trim();
        return [base64Cert];
    }
    getActiveKeyCacheKey(tenant) {
        return `key:active:${tenant ?? 'default'}`;
    }
    async invalidateActiveKey(tenant) {
        const cacheKey = this.getActiveKeyCacheKey(tenant);
        try {
            await this.cache.del(cacheKey);
            common_1.Logger.debug(`[cache] active key invalidated for ${cacheKey}`);
        }
        catch (error) {
            common_1.Logger.warn(`[cache] active key invalidate failed for ${cacheKey}: ${error.message}`);
        }
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
    async cacheSet(key, value, ttl) {
        try {
            await this.cache.set(key, value, ttl);
        }
        catch (error) {
            common_1.Logger.warn(`[cache] set failed for ${key}: ${error.message}`);
        }
    }
};
exports.KeyService = KeyService;
__decorate([
    (0, sequelize_1.InjectModel)(key_model_1.KeyModel),
    __metadata("design:type", Object)
], KeyService.prototype, "keyModel", void 0);
__decorate([
    (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER),
    __metadata("design:type", cache_manager_1.Cache)
], KeyService.prototype, "cache", void 0);
exports.KeyService = KeyService = __decorate([
    (0, common_1.Injectable)()
], KeyService);
//# sourceMappingURL=key.service.js.map