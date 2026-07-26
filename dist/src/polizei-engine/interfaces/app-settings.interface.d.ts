export interface IAppSettings {
    name?: string;
    label?: string;
    value?: any;
    group?: string;
    type: string;
    options: any[];
    [key: string]: string | number | string[] | any;
}
