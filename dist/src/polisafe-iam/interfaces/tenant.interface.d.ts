export interface Tenant {
    id: string;
    name: string;
    description: string;
    settings: Record<string, any>;
    parent: string;
}
