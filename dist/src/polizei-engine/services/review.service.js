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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const security_user_1 = require("../models/security.user");
const sequelize_1 = require("@nestjs/sequelize");
const security_scope_1 = require("../models/security.scope");
const dayjs = require("dayjs");
const sequelize_2 = require("sequelize");
const scope_service_1 = require("./scope.service");
const security_user_scope_1 = require("../models/security.user.scope");
const trace_service_1 = require("./trace.service");
let ReviewService = class ReviewService {
    async getReview(id) {
        let scopes = await this.scopeService.getAllUserScopes(id);
        const ids = scopes.map((item) => item.id);
        return {
            pie: await this.reviewPie(ids, [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()]),
            days: await this.reviewDays(ids, [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()]),
            totalSemana: await this.reviewUsuarios(ids, [dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()]),
            totalMes: await this.reviewUsuarios(ids, [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()]),
            usuarios: await this.reviewUsuariosTotal(ids),
            hitTotal: await this.traceService.reviewHit(ids, [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()]),
            hitStates: await this.traceService.reviewHitState(ids, [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()]),
            hitLine: await this.traceService.reviewHitLineTime(ids, [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()])
        };
    }
    async reviewUsuariosTotal(id) {
        let users = await this.userModel.findAll({
            include: [{
                    required: true,
                    model: this.scopeModel,
                    attributes: [],
                    where: {
                        id: {
                            [sequelize_2.Op.in]: id
                        }
                    }
                }]
        });
        return users.length;
    }
    async reviewUsuarios(id, rango) {
        let users = await this.userModel.findAll({
            include: [{
                    required: true,
                    model: this.scopeModel,
                    attributes: [],
                    where: {
                        id: {
                            [sequelize_2.Op.in]: id
                        }
                    }
                }],
            where: {
                createdAt: {
                    [sequelize_2.Op.between]: rango
                }
            }
        });
        return users.length;
    }
    async reviewPie(id, rango) {
        return await this.scopeModel.findAll({
            attributes: [
                [sequelize_2.Sequelize.col('name'), 'nombre'],
                [sequelize_2.Sequelize.fn("COUNT", sequelize_2.Sequelize.col("scopesUsers.idUser")), "total"]
            ],
            include: [{
                    model: this.userScopeModel,
                    attributes: [],
                    where: {
                        createdAt: {
                            [sequelize_2.Op.between]: rango
                        }
                    }
                }],
            where: {
                id: {
                    [sequelize_2.Op.in]: id
                }
            },
            group: ['SecurityScope.id']
        });
    }
    async reviewDays(id, rango) {
        return await this.userScopeModel.findAll({
            attributes: [
                [sequelize_2.Sequelize.fn('date_trunc', 'day', sequelize_2.Sequelize.col('createdAt')), 'name'],
                [sequelize_2.Sequelize.fn("COUNT", sequelize_2.Sequelize.col("idUser")), "total"]
            ],
            group: [sequelize_2.Sequelize.fn('date_trunc', 'day', sequelize_2.Sequelize.col('createdAt'))],
            order: [[sequelize_2.Sequelize.fn('date_trunc', 'day', sequelize_2.Sequelize.col('createdAt')), 'ASC']],
            where: {
                idScope: {
                    [sequelize_2.Op.in]: id
                },
                createdAt: {
                    [sequelize_2.Op.between]: rango
                }
            }
        });
        return await this.scopeModel.findAll({
            attributes: [
                [sequelize_2.Sequelize.fn('date_trunc', 'day', sequelize_2.Sequelize.col('SecurityScope.createdAt')), 'name'],
                [sequelize_2.Sequelize.fn("COUNT", sequelize_2.Sequelize.col("scopesUsers.idUser")), "total"]
            ],
            group: [sequelize_2.Sequelize.fn('date_trunc', 'day', sequelize_2.Sequelize.col('SecurityScope.createdAt')), 'SecurityScope.id'],
            include: [{
                    model: this.userScopeModel,
                    attributes: [],
                    where: {
                        createdAt: {
                            [sequelize_2.Op.between]: rango
                        }
                    }
                }],
            where: {
                id: {
                    [sequelize_2.Op.in]: id
                }
            }
        });
    }
};
exports.ReviewService = ReviewService;
__decorate([
    (0, sequelize_1.InjectModel)(security_user_1.SecurityUser),
    __metadata("design:type", Object)
], ReviewService.prototype, "userModel", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_scope_1.SecurityScope),
    __metadata("design:type", Object)
], ReviewService.prototype, "scopeModel", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", scope_service_1.ScopeService)
], ReviewService.prototype, "scopeService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", trace_service_1.TraceService)
], ReviewService.prototype, "traceService", void 0);
__decorate([
    (0, sequelize_1.InjectModel)(security_user_scope_1.SecurityUserScope),
    __metadata("design:type", Object)
], ReviewService.prototype, "userScopeModel", void 0);
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)()
], ReviewService);
//# sourceMappingURL=review.service.js.map