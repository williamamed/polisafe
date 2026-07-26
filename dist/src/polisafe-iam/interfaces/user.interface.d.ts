export interface User {
    id?: string;
    username: string;
    fullname?: string;
    email: string;
    roles?: string[];
    tenants?: string[];
    [key: string]: string | number | string[] | any;
}
