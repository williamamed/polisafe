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
exports.ClientScopes = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const client_model_1 = require("./client.model");
const scopes_model_1 = require("./scopes.model");
let ClientScopes = class ClientScopes extends sequelize_typescript_1.Model {
};
exports.ClientScopes = ClientScopes;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => client_model_1.ClientModel),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ClientScopes.prototype, "idClient", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => scopes_model_1.ScopesModel),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ClientScopes.prototype, "idScope", void 0);
exports.ClientScopes = ClientScopes = __decorate([
    (0, sequelize_typescript_1.Table)({
        schema: 'oauth'
    })
], ClientScopes);
//# sourceMappingURL=client.scopes.js.map