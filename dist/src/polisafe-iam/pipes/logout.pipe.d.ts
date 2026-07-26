import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { LogoutDto } from '../dto/logout.dto';
export declare class LogoutPipe implements PipeTransform {
    transform(value: LogoutDto, metadata: ArgumentMetadata): LogoutDto;
    validate(tokenRequest: LogoutDto): void;
}
