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
exports.PolizeiSdkService = void 0;
const common_1 = require("@nestjs/common");
const config_polizei_1 = require("../config.polizei");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const jwt_1 = require("@nestjs/jwt");
let PolizeiSdkService = class PolizeiSdkService {
    async onModuleInit() {
        setTimeout(() => {
            this.authenticate();
        }, 2000);
    }
    async validateClient() {
        if (this.options._token) {
            const decoded = this.jwtService.decode(this.options._token);
            if (!decoded || !decoded.exp) {
                return { valid: false, reason: 'Invalid token' };
            }
            const now = Math.floor(Date.now() / 1000);
            const expiresIn = decoded.exp - now;
            if (expiresIn < 120) {
                common_1.Logger.log('Cient Credentials Token almost expired....trying renew');
                await this.authenticate();
            }
        }
        else {
            await this.authenticate();
        }
    }
    async authenticate() {
        try {
            const credentials = Buffer.from(`${this.options.client_id}:${this.options.client_secret}`).toString('base64');
            if (!this.options.scope || !this.options.client_id || !this.options.client_secret)
                return;
            common_1.Logger.log(`client_credentials to: ${this.options.serviceUrl}/polisafe/oauth/token`);
            let result = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.options.serviceUrl}/polisafe/oauth/token`, {
                grant_type: 'client_credentials',
                scope: this.options.scope
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                }
            }));
            this.options._expireIn = result.data.expires_in;
            this.options._token = result.data.access_token;
            common_1.Logger.log(`client_credentials: complete`);
        }
        catch (error) {
            common_1.Logger.error(error, "Polizei-SDK");
        }
    }
};
exports.PolizeiSdkService = PolizeiSdkService;
__decorate([
    (0, common_1.Inject)('POLIZEI_CONFIG_OPTIONS'),
    __metadata("design:type", config_polizei_1.ConfigPolizei)
], PolizeiSdkService.prototype, "options", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", axios_1.HttpService)
], PolizeiSdkService.prototype, "httpService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", jwt_1.JwtService)
], PolizeiSdkService.prototype, "jwtService", void 0);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PolizeiSdkService.prototype, "validateClient", null);
exports.PolizeiSdkService = PolizeiSdkService = __decorate([
    (0, common_1.Injectable)()
], PolizeiSdkService);
//# sourceMappingURL=polizei-sdk.service.js.map