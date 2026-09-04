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
exports.IpService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const axios_2 = require("axios");
const request_context_1 = require("../../request-context");
let IpService = class IpService {
    isLocalIp(ip) {
        const cleanIp = ip.replace(/^::ffff:/, '');
        const privateRanges = [
            /^127\./,
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
            /^192\.168\./,
            /^169\.254\./,
            /^0\./,
        ];
        if (ip === '::1' || ip === '::ffff:127.0.0.1') {
            return true;
        }
        return privateRanges.some(pattern => pattern.test(cleanIp));
    }
    normalizeIp(ip) {
        let cleanIp = ip.replace(/^::ffff:/, '');
        if (cleanIp === '::1') {
            cleanIp = '127.0.0.1';
        }
        return cleanIp;
    }
    getPublicTestIp() {
        return '8.8.8.8';
    }
    extractIp() {
        let ip = request_context_1.RequestContext.getIp();
        ip = this.normalizeIp(ip);
        return ip;
    }
    async getLocation(ip) {
        try {
            const ipToLookup = ip || this.extractIp();
            const normalizedIp = this.normalizeIp(ipToLookup);
            if (this.isLocalIp(normalizedIp)) {
                console.log(`IP local detectada: ${normalizedIp}, usando IP pública de prueba`);
                const testIp = this.getPublicTestIp();
                return this.fetchLocation(testIp);
            }
            return this.fetchLocation(normalizedIp);
        }
        catch (error) {
            if (error instanceof axios_2.AxiosError) {
                throw new common_1.HttpException(`Error al consultar el servicio de geolocalización: ${error.message}`, common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            throw error;
        }
    }
    async fetchLocation(ip) {
        if (this.isLocalIp(ip)) {
            ip = this.getPublicTestIp();
        }
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`));
        if (response.data.status === 'fail') {
            throw new common_1.HttpException(`Error al obtener geolocalización: ${response.data.message || 'IP no encontrada'}`, common_1.HttpStatus.NOT_FOUND);
        }
        return response.data;
    }
    async getIpInfo() {
        try {
            const ip = this.extractIp();
            const normalizedIp = this.normalizeIp(ip);
            const isLocal = this.isLocalIp(normalizedIp);
            let location = null;
            let error;
            try {
                if (isLocal) {
                    location = await this.fetchLocation(this.getPublicTestIp());
                }
                else {
                    location = await this.fetchLocation(normalizedIp);
                }
            }
            catch (err) {
                error = err.message || 'Error al obtener geolocalización';
            }
            return {
                ip: normalizedIp,
                isLocal,
                location: location || undefined,
                error,
            };
        }
        catch (error) {
            const ip = this.extractIp();
            return {
                ip: this.normalizeIp(ip),
                isLocal: this.isLocalIp(ip),
                error: error.message || 'Error al obtener geolocalización',
            };
        }
    }
    getIp() {
        return this.normalizeIp(this.extractIp());
    }
    isCurrentIpLocal() {
        return this.isLocalIp(this.getIp());
    }
    async getLocationSimplified() {
        try {
            const location = await this.getLocation();
            if (!location)
                return null;
            return {
                lat: location.lat,
                lon: location.lon,
                city: location.city,
                country: location.country,
            };
        }
        catch (error) {
            return null;
        }
    }
};
exports.IpService = IpService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", axios_1.HttpService)
], IpService.prototype, "httpService", void 0);
exports.IpService = IpService = __decorate([
    (0, common_1.Injectable)()
], IpService);
//# sourceMappingURL=ip.service.js.map