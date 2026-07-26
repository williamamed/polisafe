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
exports.ScopesModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const client_scopes_1 = require("./client.scopes");
const client_model_1 = require("./client.model");
let ScopesModel = class ScopesModel extends sequelize_typescript_1.Model {
};
exports.ScopesModel = ScopesModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true }),
    __metadata("design:type", String)
], ScopesModel.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ScopesModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ScopesModel.prototype, "displayName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ScopesModel.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ScopesModel.prototype, "tenant", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => client_model_1.ClientModel, () => client_scopes_1.ClientScopes),
    __metadata("design:type", Array)
], ScopesModel.prototype, "clients", void 0);
exports.ScopesModel = ScopesModel = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'scopes',
        schema: 'oauth'
    })
], ScopesModel);
//# sourceMappingURL=scopes.model.js.map