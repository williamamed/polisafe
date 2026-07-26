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
exports.SecurityScope = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const security_user_1 = require("./security.user");
const security_user_scope_1 = require("./security.user.scope");
const security_role_1 = require("./security.role");
let SecurityScope = class SecurityScope extends sequelize_typescript_1.Model {
};
exports.SecurityScope = SecurityScope;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], SecurityScope.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityScope.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityScope.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], SecurityScope.prototype, "settings", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => SecurityScope),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], SecurityScope.prototype, "idScope", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SecurityScope),
    __metadata("design:type", Array)
], SecurityScope.prototype, "scopes", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => security_role_1.SecurityRole),
    __metadata("design:type", Array)
], SecurityScope.prototype, "roles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => security_user_scope_1.SecurityUserScope),
    __metadata("design:type", Array)
], SecurityScope.prototype, "scopesUsers", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => security_user_1.SecurityUser, () => security_user_scope_1.SecurityUserScope),
    __metadata("design:type", Array)
], SecurityScope.prototype, "users", void 0);
exports.SecurityScope = SecurityScope = __decorate([
    (0, sequelize_typescript_1.Table)({
        schema: 'security'
    })
], SecurityScope);
//# sourceMappingURL=security.scope.js.map