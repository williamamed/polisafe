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
exports.AuthorizationCodeGrantService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const moment = require("moment");
const auth_code_service_1 = require("../services/auth-code.service");
let AuthorizationCodeGrantService = class AuthorizationCodeGrantService {
    async createCode(data) {
        data.code = data.code ? data.code : crypto.randomBytes(32).toString('hex');
        if (!data.expiresAt) {
            data.expiresAt = moment().add(10, 'minutes').toDate();
            if (process.env.PLS_CODE_EXPIRE) {
                data.expiresAt = moment().add(parseInt(process.env.PLS_CODE_EXPIRE), 'minutes').toDate();
            }
        }
        let authCode = await this.authCodeService.create(data);
        return authCode;
    }
};
exports.AuthorizationCodeGrantService = AuthorizationCodeGrantService;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", auth_code_service_1.AuthCodeService)
], AuthorizationCodeGrantService.prototype, "authCodeService", void 0);
exports.AuthorizationCodeGrantService = AuthorizationCodeGrantService = __decorate([
    (0, common_1.Injectable)()
], AuthorizationCodeGrantService);
//# sourceMappingURL=authorization-code-grant.service.js.map