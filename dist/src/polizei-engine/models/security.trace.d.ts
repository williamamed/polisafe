import { Model } from "sequelize-typescript";
import { SecurityScope } from "./security.scope";
export declare class SecurityTrace extends Model {
    id: number;
    state: number;
    username: string;
    description: string;
    idScope: number;
    scope: SecurityScope;
}
