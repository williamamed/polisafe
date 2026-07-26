"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamModelService = void 0;
const common_1 = require("@nestjs/common");
const model_decorator_1 = require("../decorators/model.decorator");
let IamModelService = class IamModelService {
    getUserOrRegister(user, tid) {
        throw new Error('Method not implemented.');
    }
    getTenantSettings(tenantId) {
        throw new Error('Method not implemented.');
    }
    getPermissionsByRoles(roles) {
        throw new Error('Method not implemented.');
    }
    validateUser(email, password) {
        throw new Error('Method not implemented.');
    }
    findByEmail(email) {
        throw new Error('Method not implemented.');
    }
    findById(id) {
        throw new Error('Method not implemented.');
    }
    getUser(sub) {
        throw new Error('Method not implemented.');
    }
    validateClient(client_id, secret) {
        throw new Error('Method not implemented.');
    }
    getClientByIdAndUri(idClient, uri) {
        throw new Error('Method not implemented.');
    }
    getActiveCodeByCodeClient(code, clientId, redirectUri) {
        throw new Error('Method not implemented.');
    }
    getLastCodeByUserClient(clientId, userId, redirectUri) {
        throw new Error('Method not implemented.');
    }
    createCode(data) {
        throw new Error('Method not implemented.');
    }
    getTenantsByUserId(userId) {
        throw new Error('Method not implemented.');
    }
    getPermissionsByTenant(tenant) {
        throw new Error('Method not implemented.');
    }
};
exports.IamModelService = IamModelService;
exports.IamModelService = IamModelService = __decorate([
    (0, common_1.Injectable)(),
    (0, model_decorator_1.IamModel)()
], IamModelService);
//# sourceMappingURL=iam-model.service.js.map