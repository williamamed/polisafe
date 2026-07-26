declare class ProfileDto {
    age?: number;
    address?: string;
    phone?: string;
}
export declare class UserUpdateDto {
    id: number;
    fullname: string;
    profile: ProfileDto;
}
export {};
