import { AuthCodeDto } from '../dto/auth-code.dto';
import { AuthCodeService } from '../services/auth-code.service';
export declare class AuthorizationCodeGrantService {
    authCodeService: AuthCodeService;
    createCode(data: AuthCodeDto): Promise<import("../models/auth-code.model").AuthorizationCodeModel>;
}
