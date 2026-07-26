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
exports.ClientModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const auth_code_model_1 = require("./auth-code.model");
const scopes_model_1 = require("./scopes.model");
const client_scopes_1 = require("./client.scopes");
let ClientModel = class ClientModel extends sequelize_typescript_1.Model {
    static hashPassword(client) {
        if (client.changed('clientSecretHash')) {
        }
    }
};
exports.ClientModel = ClientModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], ClientModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], ClientModel.prototype, "clientId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ClientModel.prototype, "clientSecretHash", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB }),
    __metadata("design:type", Array)
], ClientModel.prototype, "redirectUris", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB }),
    __metadata("design:type", Array)
], ClientModel.prototype, "postLogoutRedirectUris", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB }),
    __metadata("design:type", Array)
], ClientModel.prototype, "grants", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB }),
    __metadata("design:type", Object)
], ClientModel.prototype, "meta", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => auth_code_model_1.AuthorizationCodeModel),
    __metadata("design:type", Array)
], ClientModel.prototype, "codes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB }),
    __metadata("design:type", Array)
], ClientModel.prototype, "roles", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ClientModel.prototype, "tenant", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ClientModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ClientModel.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => scopes_model_1.ScopesModel, () => client_scopes_1.ClientScopes),
    __metadata("design:type", Array)
], ClientModel.prototype, "scopes", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClientModel]),
    __metadata("design:returntype", void 0)
], ClientModel, "hashPassword", null);
exports.ClientModel = ClientModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'clients',
        schema: 'oauth'
    })
], ClientModel);
//# sourceMappingURL=client.model.js.map