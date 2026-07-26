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
exports.ScopesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const scopes_model_1 = require("../models/scopes.model");
const sequelize_2 = require("sequelize");
let ScopesService = class ScopesService {
    async onMod() {
        let base = await this.scopesModel.findOne({
            where: {
                tenant: null,
                name: 'openid'
            }
        });
        if (!base) {
            await this.scopesModel.bulkCreate([
                {
                    "name": "openid",
                    "displayName": "Verificar tu identidad",
                    "description": "Permite a la aplicación verificar tu identidad mediante OpenID Connect."
                },
                {
                    "name": "profile",
                    "displayName": "Ver información básica de tu perfil",
                    "description": "Permite a la aplicación acceder a la información pública de tu perfil."
                },
                {
                    "name": "email",
                    "displayName": "Ver tu dirección de correo electrónico",
                    "description": "Permite a la aplicación acceder a tu dirección de correo electrónico (email) y al estado de verificación de la misma (email_verified)."
                },
                {
                    "name": "address",
                    "displayName": "Ver tu dirección postal",
                    "description": "Permite a la aplicación acceder a tu dirección postal completa."
                },
                {
                    "name": "phone",
                    "displayName": "Ver tu número de teléfono",
                    "description": "Permite a la aplicación acceder a tu número de teléfono (phone_number) y al estado de verificación del mismo (phone_number_verified)."
                },
                {
                    "name": "offline_access",
                    "displayName": "Mantener el acceso incluso cuando no estés conectado",
                    "description": "Permite que la aplicación reciba un Refresh Token, que puede ser utilizado para obtener nuevos Access Tokens cuando el actual expire."
                },
                {
                    "name": "groups",
                    "displayName": "Ver tus grupos de pertenencia",
                    "description": "Permite a la aplicación conocer los grupos a los que perteneces dentro del sistema. Esto es útil para implementar lógica de autorización basada en grupos o roles organizacionales."
                }
            ]);
        }
    }
    async getById(id) {
        return await this.scopesModel.findByPk(id);
    }
    async create(scope) {
        return await this.scopesModel.create(scope);
    }
    async getByTenant(tenant) {
        return await this.scopesModel.findAll({
            where: {
                tenant: tenant
            }
        });
    }
    async getByTenantAssigment(tenant) {
        return await this.scopesModel.findAll({
            where: {
                [sequelize_2.Op.or]: [{
                        tenant: null
                    }, {
                        tenant: tenant
                    }]
            }
        });
    }
    async update(scope) {
        return this.scopesModel.update(scope, {
            where: {
                id: scope.id
            }
        });
    }
    async destroy(scope) {
        return this.scopesModel.destroy({
            where: {
                id: scope.id
            }
        });
    }
    async bulkCreate(scopes) {
        return await this.scopesModel.bulkCreate(scopes);
    }
};
exports.ScopesService = ScopesService;
__decorate([
    (0, sequelize_1.InjectModel)(scopes_model_1.ScopesModel),
    __metadata("design:type", Object)
], ScopesService.prototype, "scopesModel", void 0);
exports.ScopesService = ScopesService = __decorate([
    (0, common_1.Injectable)()
], ScopesService);
//# sourceMappingURL=scopes.service.js.map