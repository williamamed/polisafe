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
exports.SecurityUser = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const security_scope_1 = require("./security.scope");
const security_role_1 = require("./security.role");
const security_user_role_1 = require("./security.user.role");
const security_user_scope_1 = require("./security.user.scope");
const bcrypt = require("bcryptjs");
let SecurityUser = class SecurityUser extends sequelize_typescript_1.Model {
    static hashPassword(user) {
        if (user.changed('password')) {
            var salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(user.password, salt);
        }
    }
};
exports.SecurityUser = SecurityUser;
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true, autoIncrement: true }),
    __metadata("design:type", Number)
], SecurityUser.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityUser.prototype, "username", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityUser.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], SecurityUser.prototype, "state", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SecurityUser.prototype, "fullname", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], SecurityUser.prototype, "profile", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => security_role_1.SecurityRole, () => security_user_role_1.SecurityUserRole),
    __metadata("design:type", Array)
], SecurityUser.prototype, "roles", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => security_scope_1.SecurityScope, () => security_user_scope_1.SecurityUserScope),
    __metadata("design:type", Array)
], SecurityUser.prototype, "scopes", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => security_user_scope_1.SecurityUserScope),
    __metadata("design:type", Array)
], SecurityUser.prototype, "usersScopes", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SecurityUser]),
    __metadata("design:returntype", void 0)
], SecurityUser, "hashPassword", null);
exports.SecurityUser = SecurityUser = __decorate([
    (0, sequelize_typescript_1.Table)({
        schema: 'security'
    })
], SecurityUser);
//# sourceMappingURL=security.user.js.map