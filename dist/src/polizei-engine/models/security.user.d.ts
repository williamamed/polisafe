import { Model } from "sequelize-typescript";
import { SecurityScope } from "./security.scope";
import { SecurityRole } from "./security.role";
import { SecurityUserScope } from "./security.user.scope";
export declare class SecurityUser extends Model {
    id: number;
    username: string;
    password: string;
    state: number;
    fullname: string;
    profile: any;
    roles: SecurityRole[];
    scopes: SecurityScope[];
    usersScopes: SecurityUserScope[];
    static hashPassword(user: SecurityUser): void;
}
