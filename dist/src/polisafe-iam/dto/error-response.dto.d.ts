import { ErrorAuthType } from "../error/error-auth.type";
export declare class ErrorResponseDto {
    error: ErrorAuthType;
    error_description: string;
    error_uri: string;
    state: string;
}
