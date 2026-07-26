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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const security_role_1 = require("../models/security.role");
const sequelize_1 = require("@nestjs/sequelize");
const security_permission_1 = require("../models/security.permission");
const sequelize_2 = require("sequelize");
const security_user_1 = require("../models/security.user");
const security_scope_1 = require("../models/security.scope");
let RoleService = class RoleService {
    async onModuleInit() {
    }
    getRole(name) {
        return this.roleModel.findOne({
            where: {
                name: name
            },
            include: this.permissionModel
        });
    }
    getBaseRegisterRole(code) {
        return this.roleModel.findOne({
            where: {
                description: code
            }
        });
    }
    getRolePermissions(id) {
        return this.permissionModel.findAll({
            include: [{
                    required: true,
                    model: this.roleModel,
                    where: {
                        id: id
                    }
                }]
        });
    }
    getRoles() {
        return this.roleModel.findAll();
    }
    getRolesByScope(id) {
        return this.roleModel.findAll({
            where: {
                idScope: id
            }
        });
    }
    getRolesByScopeArray(id) {
        return this.roleModel.findAll({
            where: {
                idScope: {
                    [sequelize_2.Op.in]: id
                }
            },
            include: [{
                    model: security_scope_1.SecurityScope,
                    attributes: ['id', 'name']
                }]
        });
    }
    getRolesByArray(id) {
        return this.roleModel.findAll({
            where: {
                id: {
                    [sequelize_2.Op.in]: id
                }
            }
        });
    }
    async create(data) {
        return await this.roleModel.create(data);
    }
    async update(data) {
        return await this.roleModel.update(data, {
            where: {
                id: data.id
            }
        });
    }
    async destroy(data) {
        return await this.roleModel.destroy({
            where: {
                id: data.id
            }
        });
    }
    async addPermissions(idRole, permissions) {
        let role = await this.roleModel.findByPk(idRole);
        return await role.$set("permissions", permissions);
    }
    async addUser(data) {
        let userFind = await this.userModel.findOne({
            where: {
                username: data.username
            }
        });
        if (!userFind)
            throw new common_1.NotFoundException("User Not Found");
        let roles = [];
        if (data.id) {
            roles.push(data.id);
        }
        if (data.description || data.name) {
            let where = {};
            if (data.description) {
                where.description = data.description;
            }
            if (data.name) {
                where.name = data.name;
            }
            let role = await this.roleModel.findAll({
                where: where
            });
            roles = role.map((value) => value.id);
        }
        if (roles.length == 0) {
            throw new common_1.NotFoundException("Roles Not Found");
        }
        return userFind.$add('roles', roles);
    }
};
exports.RoleService = RoleService;
RoleService.USER = "USER";
RoleService.ROLE = "ROLE";
RoleService.ALL = "ALL";
__decorate([
    (0, sequelize_1.InjectModel)(security_role_1.SecurityRole),
    __metadata("design:type", Object)
], RoleService.prototype, "roleModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_1.SecurityUser),
    __metadata("design:type", Object)
], RoleService.prototype, "userModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_permission_1.SecurityPermission),
    __metadata("design:type", Object)
], RoleService.prototype, "permissionModel", void 0);
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)()
], RoleService);
//# sourceMappingURL=role.service.js.map