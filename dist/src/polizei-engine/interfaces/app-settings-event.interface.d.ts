import { IAppSettings } from "./app-settings.interface";
export interface ISettingsEvent {
    tenant: number;
    app: string;
    settings: IAppSettings[];
}
