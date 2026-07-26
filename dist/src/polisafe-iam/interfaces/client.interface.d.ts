export interface Client {
    id: string;
    clientId: string;
    clientSecretHash: string;
    redirectUris: string[];
    grants: string[];
    tenant: string;
    type: string;
    meta?: any;
}
