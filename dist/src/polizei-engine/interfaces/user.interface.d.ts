export interface IUser {
    id?: number;
    username: string;
    password?: string;
    state: number;
    fullname: string;
    profile: {
        email?: string;
        phone?: string;
        picture?: string;
        idImage?: number;
        address?: string;
        vCode?: string;
        [key: string]: string | number | string[] | any;
    };
    [key: string]: string | number | string[] | any;
}
