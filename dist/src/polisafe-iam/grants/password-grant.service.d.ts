import { TokenDto } from '../dto/token-request.dto';
export declare class PasswordGrantService {
    private readonly authService;
    authenticate(token: TokenDto): Promise<void>;
}
