/// <reference types="node" />
import * as crypto from 'crypto';
import { KeyModel } from '../models/key.model';
export declare class KeyService {
    keyModel: typeof KeyModel;
    private readonly cache;
    private readonly JWKS_CACHE_TTL;
    private get activeKeyCacheTtl();
    getKeys(tenant?: string): Promise<KeyModel[]>;
    getLastActiveKeys(tenant?: string): Promise<KeyModel[]>;
    getActiveKey(tenant?: string): Promise<KeyModel>;
    getKey(kid: string): Promise<KeyModel>;
    create(tenant?: string): Promise<KeyModel>;
    createAsyncKey(): crypto.KeyPairSyncResult<string, string>;
    getJwks(tenant?: string): Promise<any>;
    private invalidateJwks;
    private getEncodedModulus;
    private getEncodedExponent;
    private extractRSAParameters;
    private extractX5c;
    private getActiveKeyCacheKey;
    private invalidateActiveKey;
    private cacheGet;
    private cacheSet;
}
