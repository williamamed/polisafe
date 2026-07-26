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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const upload_service_1 = require("./../../services/upload/upload.service");
const multer_2 = require("multer");
const fs_1 = require("fs");
const url_service_1 = require("../../services/url.service");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No se proporcionó ningún archivo');
        }
        const result = await this.uploadService.saveFileInfo(file);
        return {
            message: 'Archivo subido exitosamente',
            file: {
                originalName: file.originalname,
                fileName: file.filename,
                size: file.size,
                mimetype: file.mimetype,
                uploadedAt: new Date().toISOString(),
                url: `${this.urlService.getBaseUrl()}${this.configService.get('APP_PREFIX')}/polizei/upload/file/${file.filename}`
            },
            ...result,
        };
    }
    async uploadFileWithCustomName(customName, file) {
        if (!file) {
            throw new common_1.BadRequestException('No se proporcionó ningún archivo');
        }
        return {
            message: 'Archivo subido exitosamente',
            file: {
                originalName: file.originalname,
                fileName: file.filename,
                size: file.size,
                mimetype: file.mimetype,
            },
        };
    }
    async deleteFile(filename) {
        return this.uploadService.deleteFile(filename);
    }
    async getFile(filename, res) {
        const filePath = await this.uploadService.getFilePath(filename);
        if (!(0, fs_1.existsSync)(filePath)) {
            throw new common_1.NotFoundException(`Archivo ${filename} no encontrado`);
        }
        const fileInfo = await this.uploadService.getFileInfo(filename);
        const fileStream = (0, fs_1.createReadStream)(filePath);
        res.set({
            'Content-Type': fileInfo.mimetype || 'application/octet-stream',
            'Content-Disposition': `inline; filename="${encodeURIComponent(fileInfo.originalName)}"`,
            'Content-Length': fileInfo.size,
        });
        return new common_1.StreamableFile(fileStream);
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", url_service_1.UrlService)
], UploadController.prototype, "urlService", void 0);
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", config_1.ConfigService)
], UploadController.prototype, "configService", void 0);
__decorate([
    (0, common_1.Post)('file'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: process.env.FILES_HUB || './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
            const extnameL = allowedTypes.test((0, path_1.extname)(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);
            if (extnameL && mimetype) {
                return callback(null, true);
            }
            else {
                callback(new common_1.BadRequestException('Tipo de archivo no permitido'), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof multer_2.Multer !== "undefined" && multer_2.Multer.File) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('file/:customName'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const customName = req.params.customName || file.originalname;
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${customName}${ext}`;
                callback(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('customName')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof multer_2.Multer !== "undefined" && multer_2.Multer.File) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFileWithCustomName", null);
__decorate([
    (0, common_1.Delete)('file/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteFile", null);
__decorate([
    (0, common_1.Get)('file/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getFile", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('polizei/upload'),
    (0, swagger_1.ApiTags)("Upload"),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map