import { StreamableFile } from '@nestjs/common';
import { UploadService } from './../../services/upload/upload.service';
import { Multer } from 'multer';
import { Response } from 'express';
import { UrlService } from '../../services/url.service';
import { ConfigService } from '@nestjs/config';
export declare class UploadController {
    private readonly uploadService;
    urlService: UrlService;
    configService: ConfigService;
    constructor(uploadService: UploadService);
    uploadFile(file: Multer.File): Promise<{
        fileId: string;
        message: string;
        file: {
            originalName: any;
            fileName: any;
            size: any;
            mimetype: any;
            uploadedAt: string;
            url: string;
        };
    }>;
    uploadFileWithCustomName(customName: string, file: Multer.File): Promise<{
        message: string;
        file: {
            originalName: any;
            fileName: any;
            size: any;
            mimetype: any;
        };
    }>;
    deleteFile(filename: string): Promise<{
        message: string;
    }>;
    getFile(filename: string, res: Response): Promise<StreamableFile>;
}
