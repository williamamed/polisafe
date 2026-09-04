"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const request_context_1 = require("./request-context");
let RequestContextInterceptor = class RequestContextInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const forwarded = request.headers['x-forwarded-for'];
        const ip = forwarded
            ? forwarded.split(',')[0].trim()
            : request.ip || request.connection?.remoteAddress || '0.0.0.0';
        return new rxjs_1.Observable((observer) => {
            request_context_1.RequestContext.run({ ip }, () => {
                next.handle().subscribe({
                    next: (value) => observer.next(value),
                    error: (err) => observer.error(err),
                    complete: () => observer.complete(),
                });
            });
        });
    }
};
exports.RequestContextInterceptor = RequestContextInterceptor;
exports.RequestContextInterceptor = RequestContextInterceptor = __decorate([
    (0, common_1.Injectable)()
], RequestContextInterceptor);
//# sourceMappingURL=request-interceptor.js.map