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
exports.SecurityRole = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const security_user_1 = require("./security.user");
const security_user_role_1 = require("./security.user.role");
const security_permission_1 = require("./security.permission");
const security_role_permission_1 = require("./security.role.permission");
const security_scope_1 = require("./security.scope");
let SecurityRole = class SecurityRole extends sequelize_typescript_1.Model {
};
exports.SecurityRole = SecurityRole;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], SecurityRole.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityRole.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityRole.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => security_scope_1.SecurityScope),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], SecurityRole.prototype, "idScope", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => security_scope_1.SecurityScope),
    __metadata("design:type", security_scope_1.SecurityScope)
], SecurityRole.prototype, "scope", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => security_user_1.SecurityUser, () => security_user_role_1.SecurityUserRole),
    __metadata("design:type", Array)
], SecurityRole.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => security_permission_1.SecurityPermission, () => security_role_permission_1.SecurityRolePermission),
    __metadata("design:type", Array)
], SecurityRole.prototype, "permissions", void 0);
exports.SecurityRole = SecurityRole = __decorate([
    (0, sequelize_typescript_1.Table)({
        schema: 'security'
    })
], SecurityRole);
//# sourceMappingURL=security.role.js.map