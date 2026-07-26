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
exports.AccessTokenModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const client_model_1 = require("./client.model");
const refresh_token_model_1 = require("./refresh-token.model");
let AccessTokenModel = class AccessTokenModel extends sequelize_typescript_1.Model {
};
exports.AccessTokenModel = AccessTokenModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true }),
    __metadata("design:type", String)
], AccessTokenModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], AccessTokenModel.prototype, "token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], AccessTokenModel.prototype, "scope", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], AccessTokenModel.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => client_model_1.ClientModel),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AccessTokenModel.prototype, "clientId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => client_model_1.ClientModel),
    __metadata("design:type", client_model_1.ClientModel)
], AccessTokenModel.prototype, "client", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], AccessTokenModel.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], AccessTokenModel.prototype, "isRevoked", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], AccessTokenModel.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => refresh_token_model_1.RefreshTokenModel),
    __metadata("design:type", refresh_token_model_1.RefreshTokenModel)
], AccessTokenModel.prototype, "refreshToken", void 0);
exports.AccessTokenModel = AccessTokenModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'access_tokens',
        schema: 'oauth'
    })
], AccessTokenModel);
//# sourceMappingURL=access-token.model.js.map