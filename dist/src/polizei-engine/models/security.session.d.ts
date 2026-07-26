import { Model } from "sequelize-typescript";
export declare class SecuritySession extends Model<SecuritySession> {
    id: number;
    username: string;
    agent: string;
    meta: object;
    key: string;
    token: string;
    active: boolean;
}
