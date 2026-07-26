import { Model } from "sequelize-typescript";
export declare class SecurityUserRole extends Model {
    id_user: number;
    id_role: number;
    tenant: number;
}
