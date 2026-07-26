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
exports.AuthorizationCodeModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const client_model_1 = require("./client.model");
let AuthorizationCodeModel = class AuthorizationCodeModel extends sequelize_typescript_1.Model {
};
exports.AuthorizationCodeModel = AuthorizationCodeModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true }),
    __metadata("design:type", String)
], AuthorizationCodeModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AuthorizationCodeModel.prototype, "code", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AuthorizationCodeModel.prototype, "username", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AuthorizationCodeModel.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => client_model_1.ClientModel),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.UUID }),
    __metadata("design:type", String)
], AuthorizationCodeModel.prototype, "clientId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => client_model_1.ClientModel),
    __metadata("design:type", client_model_1.ClientModel)
], AuthorizationCodeModel.prototype, "client", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], AuthorizationCodeModel.prototype, "redirectUri", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], AuthorizationCodeModel.prototype, "scopes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], AuthorizationCodeModel.prototype, "codeChallenge", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true }),
    __metadata("design:type", String)
], AuthorizationCodeModel.prototype, "codeChallengeMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], AuthorizationCodeModel.prototype, "expiresAt", void 0);
exports.AuthorizationCodeModel = AuthorizationCodeModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'authorization_codes',
        schema: 'oauth'
    })
], AuthorizationCodeModel);
//# sourceMappingURL=auth-code.model.js.map