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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const security_scope_1 = require("../models/security.scope");
const security_user_1 = require("../models/security.user");
const sequelize_1 = require("@nestjs/sequelize");
const security_role_1 = require("../models/security.role");
const sequelize_2 = require("sequelize");
const security_user_scope_1 = require("../models/security.user.scope");
let UserService = class UserService {
    getSecurity() {
        return this.scopeModel.findAll();
    }
    getUsers() {
        return this.userModel.findAll();
    }
    getUsersByScope(id) {
        return this.userModel.findAll({
            attributes: {
                exclude: ['password']
            },
            include: [{
                    required: true,
                    model: this.scopeModel,
                    where: {
                        id: id
                    }
                }, this.roleModel]
        });
    }
    async getUsersByScopePage(id, offset, search, limit = 50) {
        let whereOpt = {};
        if (search) {
            whereOpt = {
                [sequelize_2.Op.or]: {
                    username: {
                        [sequelize_2.Op.iLike]: `%${search}%`
                    },
                    fullname: {
                        [sequelize_2.Op.iLike]: `%${search}%`
                    }
                }
            };
        }
        return {
            rows: await this.userModel.findAll({
                attributes: {
                    exclude: ['password']
                },
                include: [{
                        required: true,
                        model: this.scopeModel,
                        attributes: [],
                        where: {
                            id: id
                        }
                    }, this.roleModel],
                where: whereOpt,
                offset: offset,
                limit: limit,
                order: [['id', 'ASC']]
            }),
            count: await this.userModel.count({
                include: [{
                        required: true,
                        model: this.scopeModel,
                        where: {
                            id: id
                        }
                    }],
                where: whereOpt
            })
        };
    }
    findOne(username) {
        return this.userModel.findOne({
            where: {
                username: username
            },
            include: [{
                    required: false,
                    model: this.scopeModel,
                    include: [{
                            model: this.userScopeModel
                        }]
                }, this.roleModel],
            order: [
                [{ model: this.scopeModel, as: 'scopes' }, { model: this.userScopeModel, as: 'scopesUsers' }, 'createdAt', 'ASC']
            ]
        });
    }
    findById(id) {
        return this.userModel.findByPk(id, {
            include: [{
                    required: false,
                    model: this.scopeModel,
                    include: [{
                            model: this.userScopeModel
                        }]
                }, this.roleModel]
        });
    }
    findByUsernameAndTenant(username, tenant) {
        return this.userModel.findOne({
            where: {
                username: username
            },
            include: [{
                    required: true,
                    model: this.scopeModel,
                    where: {
                        id: tenant
                    },
                    include: [{
                            model: this.userScopeModel
                        }]
                }, this.roleModel]
        });
    }
    findByEmailAndTenant(email, tenant) {
        return this.userModel.findOne({
            where: {
                'profile.email': email
            },
            include: [{
                    required: true,
                    model: this.scopeModel,
                    where: {
                        id: tenant
                    },
                    include: [{
                            model: this.userScopeModel
                        }]
                }, this.roleModel]
        });
    }
    findOneByChannel(channel) {
        return this.userModel.findOne({
            where: {
                'profile.channel': channel
            },
            include: [{
                    required: false,
                    model: this.scopeModel,
                    include: [{
                            model: this.userScopeModel
                        }]
                }, this.roleModel],
            order: [
                [{ model: this.scopeModel, as: 'scopes' }, { model: this.userScopeModel, as: 'scopesUsers' }, 'createdAt', 'ASC']
            ]
        });
    }
    getUserData(username) {
        return this.userModel.findOne({
            where: {
                username: username
            },
            attributes: {
                exclude: ['password']
            },
            include: [{
                    required: false,
                    model: this.scopeModel,
                    include: [{
                            model: this.userScopeModel,
                            attributes: []
                        }]
                }, this.roleModel],
            order: [
                [{ model: this.scopeModel, as: 'scopes' }, { model: this.userScopeModel, as: 'scopesUsers' }, 'createdAt', 'ASC']
            ]
        });
    }
    async create(data) {
        let userFind = await this.userModel.findOne({
            where: {
                username: data.username
            }
        });
        if (userFind)
            throw new common_1.ConflictException("User exist");
        let user = await this.userModel.create(data);
        user.$add('scopes', data.idScope);
        return user;
    }
    async update(data, tenant) {
        let userFind = await this.userModel.findOne({
            where: {
                id: data.id
            },
            ...tenant ? {
                include: [{
                        required: true,
                        model: security_scope_1.SecurityScope,
                        where: {
                            id: tenant
                        }
                    }]
            } : {}
        });
        if (!userFind)
            throw new common_1.ConflictException("User not found");
        let updated = userFind.get({ plain: true });
        updated = {
            ...updated,
            ...data,
            profile: {
                ...updated.profile,
                ...data.profile
            }
        };
        return await this.userModel.update(updated, {
            where: {
                id: data.id
            },
            individualHooks: true
        });
    }
    async destroy(data, tenant) {
        let userFind = await this.userModel.findOne({
            where: {
                id: data.id
            },
            ...tenant ? {
                include: [{
                        required: true,
                        model: security_scope_1.SecurityScope,
                        where: {
                            id: tenant
                        }
                    }]
            } : {}
        });
        if (!userFind)
            throw new common_1.ConflictException("User not found");
        return await this.userModel.destroy({
            where: {
                id: data.id
            }
        });
    }
    async addRoles(idUser, roles, context) {
        let user = await this.userModel.findByPk(idUser);
        if (!user)
            throw new common_1.NotFoundException("User not found");
        let current = await user.$get("roles");
        if (context) {
            let newRoles = roles.filter((role) => current.findIndex((value) => value.id == role) == -1);
            let rolesObj = await this.roleModel.findAll({
                where: {
                    id: newRoles
                }
            });
            rolesObj = rolesObj.map((role) => {
                role.SecurityUserRole = { tenant: context };
                return role;
            });
            rolesObj = rolesObj.concat(current.filter((value) => roles.includes(value.id)));
            return await user.$set('roles', rolesObj);
        }
        return await user.$set("roles", roles);
    }
    async addRole(idUser, role) {
        let user = await this.userModel.findByPk(idUser);
        return await user.$add("roles", role);
    }
    async addRoleList(idUser, roles) {
        let user = await this.userModel.findByPk(idUser);
        return await user.$add("roles", roles);
    }
    async removeRoles(idUser, roles) {
        let user = await this.userModel.findByPk(idUser);
        return await user.$remove("roles", roles);
    }
    async listRoles(idUser) {
        let user = await this.userModel.findByPk(idUser, {
            include: security_role_1.SecurityRole
        });
        return await user.roles;
    }
    findUsers(username) {
        return this.userModel.findAll({
            where: {
                username: {
                    [sequelize_2.Op.iLike]: `%${username}%`
                }
            },
            attributes: {
                exclude: ['password', 'profile']
            }
        });
    }
};
exports.UserService = UserService;
__decorate([
    (0, sequelize_1.InjectModel)(security_user_1.SecurityUser),
    __metadata("design:type", Object)
], UserService.prototype, "userModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_scope_1.SecurityUserScope),
    __metadata("design:type", Object)
], UserService.prototype, "userScopeModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_scope_1.SecurityScope),
    __metadata("design:type", Object)
], UserService.prototype, "scopeModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_role_1.SecurityRole),
    __metadata("design:type", Object)
], UserService.prototype, "roleModel", void 0);
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map