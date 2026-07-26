import { Model } from "sequelize-typescript";
import { SecurityScope } from "./security.scope";
export declare class SecurityInvitation extends Model<SecurityInvitation> {
    id: string;
    email: string;
    description: string;
    meta: any;
    idScope: number;
    scope: SecurityScope;
    state: number;
}
