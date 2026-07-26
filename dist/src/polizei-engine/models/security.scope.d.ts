import { Model } from "sequelize-typescript";
import { SecurityUser } from "./security.user";
import { SecurityUserScope } from "./security.user.scope";
import { SecurityRole } from "./security.role";
export declare class SecurityScope extends Model {
    id: number;
    name: string;
    description: string;
    settings: any;
    idScope: number;
    scopes: SecurityScope[];
    roles: SecurityRole[];
    scopesUsers: SecurityUserScope[];
    users: SecurityUser[];
}
