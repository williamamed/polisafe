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
exports.KeyService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const key_model_1 = require("../models/key.model");
const sequelize_1 = require("@nestjs/sequelize");
const moment = require("moment");
let KeyService = class KeyService {
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
        if (active && moment().subtract(1, 'day').diff(moment(active.createdAt), 'day') * -1 > 1)
            return await this.create(tenant);
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
        return await this.keyModel.create({
            kid: crypto.randomBytes(32).toString('hex'),
            publicKeyPem: keys.publicKey,
            privateKeyPem: keys.privateKey,
            active: true,
            tenant: tenant ?? null
        });
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
        let actives = await this.getLastActiveKeys(tenant);
        return {
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
};
exports.KeyService = KeyService;
__decorate([
    (0, sequelize_1.InjectModel)(key_model_1.KeyModel),
    __metadata("design:type", Object)
], KeyService.prototype, "keyModel", void 0);
exports.KeyService = KeyService = __decorate([
    (0, common_1.Injectable)()
], KeyService);
//# sourceMappingURL=key.service.js.map