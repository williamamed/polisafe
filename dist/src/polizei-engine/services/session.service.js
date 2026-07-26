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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const security_session_1 = require("../models/security.session");
const sequelize_1 = require("@nestjs/sequelize");
let SessionService = class SessionService {
    async listAll(username) {
        return await this.sessionModel.findAll({
            where: {
                username: username
            }
        });
    }
    async listActive(username) {
        return await this.sessionModel.findAll({
            where: {
                username: username,
                active: true
            }
        });
    }
    async create(sessionDto) {
        return await this.sessionModel.create(sessionDto);
    }
    async update(sessionDto) {
        return await this.sessionModel.update(sessionDto, {
            where: {
                id: sessionDto.id
            }
        });
    }
    async destroy(sessionDto) {
        return await this.sessionModel.destroy({
            where: {
                id: sessionDto.id
            }
        });
    }
};
exports.SessionService = SessionService;
__decorate([
    (0, sequelize_1.InjectModel)(security_session_1.SecuritySession),
    __metadata("design:type", Object)
], SessionService.prototype, "sessionModel", void 0);
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)()
], SessionService);
//# sourceMappingURL=session.service.js.map