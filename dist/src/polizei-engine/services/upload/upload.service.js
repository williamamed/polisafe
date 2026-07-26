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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs/promises");
const path = require("path");
const fs_1 = require("fs");
let UploadService = class UploadService {
    constructor() {
        this.uploadDir = process.env.FILES_HUB || './uploads';
        this.fileDatabase = new Map();
        this.ensureUploadDirectory();
    }
    async ensureUploadDirectory() {
        try {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
        catch (error) {
            console.error('Error creating upload directory:', error);
        }
        try {
            const rawData = await fs.readFile(path.join(this.uploadDir, 'images.json'), 'utf-8');
            const parsedData = JSON.parse(rawData);
            this.fileDatabase = new Map(Object.entries(parsedData));
        }
        catch (error) {
            console.log("no map images...");
        }
    }
    saveToDisk() {
        const mapToObject = (map) => {
            return Object.fromEntries(map);
        };
        const jsonData = JSON.stringify(mapToObject(this.fileDatabase), null, 2);
        fs.writeFile(path.join(this.uploadDir, 'images.json'), jsonData);
    }
    async getFilePath(filename) {
        const fileInfo = this.fileDatabase.get(filename);
        if (!fileInfo) {
            throw new common_1.NotFoundException(`Archivo ${filename} no encontrado`);
        }
        return path.join(this.uploadDir, filename);
    }
    async saveFileInfo(file) {
        const fileInfo = {
            id: Date.now().toString(),
            originalName: file.originalname,
            fileName: file.filename,
            size: file.size,
            path: file.path,
            mimetype: file.mimetype,
            uploadedAt: new Date().toISOString(),
        };
        this.fileDatabase.set(file.filename, fileInfo);
        this.saveToDisk();
        return {
            fileId: fileInfo.id,
            message: 'Archivo procesado correctamente',
        };
    }
    async getFileInfo(filename) {
        const fileInfo = this.fileDatabase.get(filename);
        if (!fileInfo) {
            throw new common_1.NotFoundException(`Archivo ${filename} no encontrado`);
        }
        const filePath = path.join(this.uploadDir, filename);
        try {
            await fs.access(filePath);
        }
        catch (error) {
            throw new common_1.NotFoundException(`El archivo físico ${filename} no existe`);
        }
        return fileInfo;
    }
    async deleteFile(filename) {
        const filePath = path.join(this.uploadDir, filename);
        if (!(0, fs_1.existsSync)(filePath)) {
            throw new common_1.NotFoundException(`Archivo ${filename} no encontrado`);
        }
        await fs.unlink(filePath);
        this.fileDatabase.delete(filename);
        this.saveToDisk();
        return {
            message: `Archivo ${filename} eliminado exitosamente`,
        };
    }
    async getAllFiles() {
        const files = Array.from(this.fileDatabase.values());
        return {
            total: files.length,
            files,
        };
    }
    async processFile(filePath) {
        console.log(`Procesando archivo: ${filePath}`);
        return { processed: true };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map