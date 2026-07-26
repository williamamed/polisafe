import { AuthCodeDto } from '../dto/auth-code.dto';
export declare class ImplicitGrantService {
    generateResponseToken(code: AuthCodeDto): Promise<void>;
}
