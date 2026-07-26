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
exports.SecuritySession = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let SecuritySession = class SecuritySession extends sequelize_typescript_1.Model {
};
exports.SecuritySession = SecuritySession;
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ allowNull: false }),
    __metadata("design:type", Number)
], SecuritySession.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false }),
    __metadata("design:type", String)
], SecuritySession.prototype, "username", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecuritySession.prototype, "agent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], SecuritySession.prototype, "meta", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false }),
    __metadata("design:type", String)
], SecuritySession.prototype, "key", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.TEXT
    }),
    __metadata("design:type", String)
], SecuritySession.prototype, "token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false
    }),
    __metadata("design:type", Boolean)
], SecuritySession.prototype, "active", void 0);
exports.SecuritySession = SecuritySession = __decorate([
    (0, sequelize_typescript_1.Table)({
        schema: 'security'
    })
], SecuritySession);
//# sourceMappingURL=security.session.js.map