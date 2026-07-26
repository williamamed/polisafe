export declare const GetScopeOfUser: (...dataOrPipes: (string | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | {
    id: string;
    type: 'query' | 'body';
})[]) => ParameterDecorator;
export declare const ScopeOfUser: (attr: string) => <TFunction extends Function, Y>(target: object | TFunction, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
