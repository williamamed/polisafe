"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutPipe = void 0;
const common_1 = require("@nestjs/common");
const error_token_type_1 = require("../error/error-token.type");
let LogoutPipe = class LogoutPipe {
    transform(value, metadata) {
        this.validate(value);
        return value;
    }
    validate(tokenRequest) {
        if (!tokenRequest.post_logout_redirect_uri) {
            throw new common_1.BadRequestException({
                error: error_token_type_1.ErrorTokenType.invalid_request,
                error_description: "Missing required parameter: post_logout_redirect_uri"
            });
        }
        if (!tokenRequest.id_token_hint) {
            throw new common_1.BadRequestException({
                error: error_token_type_1.ErrorTokenType.invalid_request,
                error_description: "Missing required parameter: id_token_hint"
            });
        }
        if (!tokenRequest.client_id) {
            throw new common_1.BadRequestException({
                error: error_token_type_1.ErrorTokenType.invalid_request,
                error_description: "Missing required parameter: client_id"
            });
        }
    }
};
exports.LogoutPipe = LogoutPipe;
exports.LogoutPipe = LogoutPipe = __decorate([
    (0, common_1.Injectable)()
], LogoutPipe);
//# sourceMappingURL=logout.pipe.js.map