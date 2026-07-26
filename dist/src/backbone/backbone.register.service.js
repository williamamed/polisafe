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
exports.BackboneRegisterService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let BackboneRegisterService = class BackboneRegisterService {
    async onModuleInit() {
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${process.env.BACKBONE_SUBSCRIBE}`, {
                name: process.env.BACKBONE_NAME,
                address: process.env.BACKBONE_ENDPOINT,
                topic: ['lock-user', 'register-user', 'all']
            }, {
                headers: {
                    "tr-service-key": process.env.TR_SERVICE_KEY
                }
            }));
            console.log('Microservice', process.env.BACKBONE_NAME, 'subscribed');
        }
        catch (error) {
            console.log(error.message, 'Microservice', process.env.BACKBONE_NAME, 'fail subscription');
        }
    }
    async publish(record) {
        const headers = {
            'Content-Type': 'application/json',
            'tr-service-key': process.env.TR_SERVICE_KEY,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
        };
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.post(process.env.BACKBONE_PUBLISH, record, { headers }));
            return data;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
};
exports.BackboneRegisterService = BackboneRegisterService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", axios_1.HttpService)
], BackboneRegisterService.prototype, "httpService", void 0);
exports.BackboneRegisterService = BackboneRegisterService = __decorate([
    (0, common_1.Injectable)()
], BackboneRegisterService);
//# sourceMappingURL=backbone.register.service.js.map