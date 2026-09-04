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
exports.TraceService = void 0;
const common_1 = require("@nestjs/common");
const security_trace_1 = require("../models/security.trace");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const ip_service_1 = require("./ip.service");
let TraceService = class TraceService {
    async create(data) {
        return await this.traceModel.create(data);
    }
    async register(username, idScope, description, state = 1, meta = {}) {
        const { ip, location, error } = await this.ipService.getIpInfo();
        meta.ip = ip;
        meta.location = location || error;
        return await this.traceModel.create({
            username: username,
            state: state,
            description: description,
            idScope: idScope,
            meta: meta
        });
    }
    async reviewHit(id, rango) {
        return await this.traceModel.findAll({
            attributes: [
                [sequelize_2.Sequelize.fn("COUNT", sequelize_2.Sequelize.col("id")), "total"]
            ],
            where: {
                idScope: {
                    [sequelize_2.Op.in]: id
                },
                createdAt: {
                    [sequelize_2.Op.between]: rango
                }
            }
        });
    }
    async reviewHitState(id, rango) {
        return await this.traceModel.findAll({
            attributes: [
                'state',
                [sequelize_2.Sequelize.fn("COUNT", sequelize_2.Sequelize.col("id")), "total"]
            ],
            where: {
                idScope: {
                    [sequelize_2.Op.in]: id
                },
                createdAt: {
                    [sequelize_2.Op.between]: rango
                }
            },
            group: ['state']
        });
    }
    async reviewHitLineTime(id, rango) {
        return await this.traceModel.findAll({
            attributes: [
                [sequelize_2.Sequelize.fn('date_trunc', 'day', sequelize_2.Sequelize.col('createdAt')), 'name'],
                [sequelize_2.Sequelize.fn("COUNT", sequelize_2.Sequelize.col("id")), "total"]
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
    }
};
exports.TraceService = TraceService;
__decorate([
    (0, sequelize_1.InjectModel)(security_trace_1.SecurityTrace),
    __metadata("design:type", Object)
], TraceService.prototype, "traceModel", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", ip_service_1.IpService)
], TraceService.prototype, "ipService", void 0);
exports.TraceService = TraceService = __decorate([
    (0, common_1.Injectable)()
], TraceService);
//# sourceMappingURL=trace.service.js.map