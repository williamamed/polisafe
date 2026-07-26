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
exports.AuthorizeIoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AuthorizeIoDto {
}
exports.AuthorizeIoDto = AuthorizeIoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL PATH del endpoint a autorizar',
        example: '/v1/users',
        required: true,
        type: String
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuthorizeIoDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Método HTTP para la solicitud',
        example: 'POST',
        default: 'GET',
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        required: false,
        type: String
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AuthorizeIoDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identificador único del usuario que realiza la autorización',
        example: 12345,
        required: true,
        type: Number,
        minimum: 1,
        maximum: 999999999
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], AuthorizeIoDto.prototype, "sub", void 0);
//# sourceMappingURL=authorize-io.dto.js.map