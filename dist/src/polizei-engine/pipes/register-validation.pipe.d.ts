import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
export declare class RegisterValidationPipe implements PipeTransform {
    transform(value: RegisterDto, metadata: ArgumentMetadata): RegisterDto;
    validate(registerDto: RegisterDto): void;
}
