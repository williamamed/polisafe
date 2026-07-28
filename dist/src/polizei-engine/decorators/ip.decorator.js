"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ip = void 0;
const common_1 = require("@nestjs/common");
exports.Ip = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const forwarded = request.headers['x-forwarded-for'];
    const ip = forwarded
        ? forwarded.split(',')[0]
        : request.ip ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            'unknown';
    return ip;
});
//# sourceMappingURL=ip.decorator.js.map