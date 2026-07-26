/// <reference types="cookie-parser" />
import { Request } from 'express';
export declare class UrlService {
    private readonly request;
    constructor(request: Request);
    getFullUrl(): string;
    getBaseUrl(): string;
    getPath(): string;
}
