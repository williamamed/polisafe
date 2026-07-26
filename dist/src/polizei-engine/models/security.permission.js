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
exports.SecurityPermission = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const security_role_1 = require("./security.role");
const security_role_permission_1 = require("./security.role.permission");
const security_scope_1 = require("./security.scope");
let SecurityPermission = class SecurityPermission extends sequelize_typescript_1.Model {
};
exports.SecurityPermission = SecurityPermission;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], SecurityPermission.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityPermission.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityPermission.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], SecurityPermission.prototype, "settings", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => security_scope_1.SecurityScope),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], SecurityPermission.prototype, "idScope", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], SecurityPermission.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => security_scope_1.SecurityScope),
    __metadata("design:type", Array)
], SecurityPermission.prototype, "scope", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => security_role_1.SecurityRole, () => security_role_permission_1.SecurityRolePermission),
    __metadata("design:type", Array)
], SecurityPermission.prototype, "roles", void 0);
exports.SecurityPermission = SecurityPermission = __decorate([
    (0, sequelize_typescript_1.Table)({
        schema: 'security'
    })
], SecurityPermission);
//# sourceMappingURL=security.permission.js.map