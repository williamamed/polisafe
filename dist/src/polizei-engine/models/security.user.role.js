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
exports.SecurityUserRole = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const security_user_1 = require("./security.user");
const security_role_1 = require("./security.role");
let SecurityUserRole = class SecurityUserRole extends sequelize_typescript_1.Model {
};
exports.SecurityUserRole = SecurityUserRole;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => security_user_1.SecurityUser),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SecurityUserRole.prototype, "id_user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => security_role_1.SecurityRole),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SecurityUserRole.prototype, "id_role", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SecurityUserRole.prototype, "tenant", void 0);
exports.SecurityUserRole = SecurityUserRole = __decorate([
    (0, sequelize_typescript_1.Table)({
        schema: 'security'
    })
], SecurityUserRole);
//# sourceMappingURL=security.user.role.js.map