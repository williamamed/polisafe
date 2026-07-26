import { Multer } from 'multer';
export declare class UploadService {
    private readonly uploadDir;
    private fileDatabase;
    constructor();
    private ensureUploadDirectory;
    saveToDisk(): void;
    getFilePath(filename: string): Promise<string>;
    saveFileInfo(file: Multer.File): Promise<{
        fileId: string;
        message: string;
    }>;
    getFileInfo(filename: string): Promise<any>;
    deleteFile(filename: string): Promise<{
        message: string;
    }>;
    getAllFiles(): Promise<{
        total: number;
        files: any[];
    }>;
    processFile(filePath: string): Promise<{
        processed: boolean;
    }>;
}
