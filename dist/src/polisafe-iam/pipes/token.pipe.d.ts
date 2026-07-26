import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { TokenDto } from '../dto/token-request.dto';
export declare class ValidationTokenPipe implements PipeTransform {
    transform(value: TokenDto, metadata: ArgumentMetadata): TokenDto;
    validateGrantType(tokenRequest: TokenDto): void;
}
