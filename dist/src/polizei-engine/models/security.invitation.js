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
exports.SecurityInvitation = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const security_scope_1 = require("./security.scope");
let SecurityInvitation = class SecurityInvitation extends sequelize_typescript_1.Model {
};
exports.SecurityInvitation = SecurityInvitation;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], SecurityInvitation.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityInvitation.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityInvitation.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], SecurityInvitation.prototype, "meta", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => security_scope_1.SecurityScope),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], SecurityInvitation.prototype, "idScope", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => security_scope_1.SecurityScope),
    __metadata("design:type", security_scope_1.SecurityScope)
], SecurityInvitation.prototype, "scope", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SecurityInvitation.prototype, "state", void 0);
exports.SecurityInvitation = SecurityInvitation = __decorate([
    (0, sequelize_typescript_1.Table)({
        schema: 'security'
    })
], SecurityInvitation);
//# sourceMappingURL=security.invitation.js.map