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
exports.NotificationService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let NotificationService = class NotificationService {
    async email(data) {
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(process.env.MAILER_SERVICE_URL, {
                address: data.address,
                title: data.subject,
                message: data.message
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': process.env.POLIZEI_SERVICE_KEY
                }
            }));
        }
        catch (httpError) {
            common_1.Logger.error(`Error enviando email: ${httpError.message}`);
            throw new common_1.ServiceUnavailableException(`Error enviando email: ${httpError.message}`);
        }
    }
    async webhook(url, data, headers) {
        try {
            await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            }));
        }
        catch (httpError) {
            common_1.Logger.error(`Error enviando al webhook ${httpError.message}: ${httpError.message}`);
            throw new common_1.ServiceUnavailableException(`Error enviando email ${httpError.message}: ${httpError.message}`);
        }
    }
};
exports.NotificationService = NotificationService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", axios_1.HttpService)
], NotificationService.prototype, "httpService", void 0);
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)()
], NotificationService);
//# sourceMappingURL=notification.service.js.map