"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SameOriginCookieGuard = void 0;
const common_1 = require("@nestjs/common");
let SameOriginCookieGuard = class SameOriginCookieGuard {
    constructor() {
        this.cookieName = 'origin-validator';
        this.cookieSecret = process.env.PLS_ORIGIN_COOKIE_SECRET;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (request.method === 'GET' && !request.query['api-call']) {
            this.setOriginCookie(response);
            return true;
        }
        return this.validateOriginCookie(request);
    }
    setOriginCookie(res) {
        const cookieValue = this.generateCookieValue();
        res.cookie(this.cookieName, cookieValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
    }
    generateCookieValue() {
        const crypto = require('crypto');
        const token = crypto.randomBytes(32).toString('hex');
        const signature = crypto
            .createHmac('sha256', this.cookieSecret)
            .update(token)
            .digest('hex');
        return `${token}:${signature}`;
    }
    validateOriginCookie(req) {
        const cookie = req.cookies?.[this.cookieName];
        if (!cookie) {
            throw new common_1.ForbiddenException('Origin validation cookie missing');
        }
        const [token, signature] = cookie.split(':');
        if (!token || !signature) {
            throw new common_1.ForbiddenException('Invalid origin cookie format');
        }
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', this.cookieSecret)
            .update(token)
            .digest('hex');
        if (signature !== expectedSignature) {
            throw new common_1.ForbiddenException('Invalid origin cookie signature');
        }
        return true;
    }
};
exports.SameOriginCookieGuard = SameOriginCookieGuard;
exports.SameOriginCookieGuard = SameOriginCookieGuard = __decorate([
    (0, common_1.Injectable)()
], SameOriginCookieGuard);
//# sourceMappingURL=same-origin-cookie.guard.js.map