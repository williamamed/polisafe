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
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const security_permission_1 = require("../models/security.permission");
const sequelize_1 = require("@nestjs/sequelize");
const security_role_1 = require("../models/security.role");
const security_user_1 = require("../models/security.user");
const sequelize_2 = require("sequelize");
let PermissionService = class PermissionService {
    getPermissionsTree() {
        return this.permissionModel.findAll({
            include: this.permissionModel,
            where: {
                id_permission: null
            }
        });
    }
    getPermissionsFlat() {
        return this.permissionModel.findAll();
    }
    getPermissionsFlatByScope(id) {
        return this.permissionModel.findAll({
            where: {
                idScope: id
            }
        });
    }
    getPermissionsFlatByScopeArray(id) {
        return this.permissionModel.findAll({
            where: {
                idScope: {
                    [sequelize_2.Op.in]: id
                }
            }
        });
    }
    getPermissionsUserFlat(username) {
        return this.permissionModel.findAll({
            include: {
                model: this.roleModel,
                required: true,
                attributes: [],
                include: [{
                        required: true,
                        model: this.userModel,
                        attributes: [],
                        where: {
                            username: username
                        }
                    }]
            }
        });
    }
    getPermissionsRolesFlat(roles) {
        return this.permissionModel.findAll({
            include: {
                model: this.roleModel,
                required: true,
                attributes: [],
                where: {
                    id: {
                        [sequelize_2.Op.in]: roles
                    }
                }
            }
        });
    }
    isAuthorizedByRoles(rolesId, url) {
        return this.permissionModel.findOne({
            where: {
                name: url
            },
            include: {
                model: this.roleModel,
                required: true,
                where: {
                    id: {
                        [sequelize_2.Op.in]: rolesId
                    }
                }
            }
        });
    }
    isAuthorizedByUser(username, url, tenant) {
        return this.permissionModel.findOne({
            where: {
                name: url
            },
            include: {
                model: this.roleModel,
                required: true,
                attributes: [],
                include: [{
                        required: true,
                        model: this.userModel,
                        attributes: [],
                        where: {
                            username: username,
                            state: 1
                        },
                        ...tenant ? {
                            through: {
                                attributes: ['tenant'],
                                where: {
                                    tenant: {
                                        [sequelize_2.Op.or]: [null, tenant]
                                    }
                                }
                            }
                        } : {}
                    }]
            }
        });
    }
    isAuthorizedBySub(id, url, method, tenant) {
        return this.permissionModel.findOne({
            where: {
                name: url,
                ...method ? {
                    'settings.type': method
                } : {}
            },
            include: {
                model: this.roleModel,
                required: true,
                attributes: [],
                include: [{
                        required: true,
                        model: this.userModel,
                        attributes: [],
                        where: {
                            id: id,
                            state: 1
                        },
                        ...tenant ? {
                            through: {
                                attributes: ['tenant'],
                                where: {
                                    tenant: {
                                        [sequelize_2.Op.or]: [null, tenant]
                                    }
                                }
                            }
                        } : {}
                    }]
            }
        });
    }
    async create(data) {
        return await this.permissionModel.create(data);
    }
    async createBulk(data) {
        return await this.permissionModel.bulkCreate(data.permissions.map((item) => {
            item.idScope = data.idScope;
            return item;
        }));
    }
    async update(data) {
        return await this.permissionModel.update(data, {
            where: {
                id: data.id
            }
        });
    }
    async destroy(data) {
        return await this.permissionModel.destroy({
            where: {
                id: data.id
            }
        });
    }
    async destroyGroup(data) {
        return await this.permissionModel.destroy({
            where: {
                profile: {
                    folder: {
                        [sequelize_2.Op.iLike]: `${data.name}%`
                    }
                }
            }
        });
    }
    async destroyGroupArray(data) {
        return await this.permissionModel.destroy({
            where: {
                id: {
                    [sequelize_2.Op.in]: data.map((item) => item.id)
                }
            }
        });
    }
};
exports.PermissionService = PermissionService;
__decorate([
    (0, sequelize_1.InjectModel)(security_permission_1.SecurityPermission),
    __metadata("design:type", Object)
], PermissionService.prototype, "permissionModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_role_1.SecurityRole),
    __metadata("design:type", Object)
], PermissionService.prototype, "roleModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_1.SecurityUser),
    __metadata("design:type", Object)
], PermissionService.prototype, "userModel", void 0);
exports.PermissionService = PermissionService = __decorate([
    (0, common_1.Injectable)()
], PermissionService);
//# sourceMappingURL=permission.service.js.map