import { Model } from "sequelize-typescript";
import { SecurityUser } from "./security.user";
import { SecurityPermission } from "./security.permission";
import { SecurityScope } from "./security.scope";
export declare class SecurityRole extends Model {
    id: number;
    name: string;
    description: string;
    idScope: number;
    scope: SecurityScope;
    users: SecurityUser[];
    permissions: SecurityPermission[];
}
