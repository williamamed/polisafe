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
exports.RefreshTokenModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const client_model_1 = require("./client.model");
const access_token_model_1 = require("./access-token.model");
let RefreshTokenModel = class RefreshTokenModel extends sequelize_typescript_1.Model {
};
exports.RefreshTokenModel = RefreshTokenModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true }),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "scope", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => client_model_1.ClientModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "clientId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => client_model_1.ClientModel),
    __metadata("design:type", client_model_1.ClientModel)
], RefreshTokenModel.prototype, "client", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => access_token_model_1.AccessTokenModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "accessTokenId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => access_token_model_1.AccessTokenModel),
    __metadata("design:type", access_token_model_1.AccessTokenModel)
], RefreshTokenModel.prototype, "accessToken", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], RefreshTokenModel.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], RefreshTokenModel.prototype, "isRevoked", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], RefreshTokenModel.prototype, "userId", void 0);
exports.RefreshTokenModel = RefreshTokenModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'refresh_tokens',
        schema: 'oauth'
    })
], RefreshTokenModel);
//# sourceMappingURL=refresh-token.model.js.map