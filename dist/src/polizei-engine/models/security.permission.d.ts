import { Model } from "sequelize-typescript";
import { SecurityRole } from "./security.role";
export declare class SecurityPermission extends Model {
    id: number;
    name: string;
    description: string;
    settings: any;
    idScope: number;
    type: number;
    scope: SecurityRole[];
    roles: SecurityRole[];
}
