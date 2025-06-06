import "reflect-metadata"

export const AUTH_META_KEY = "route:auth"

export function Auth(required: boolean = true): PropertyDecorator {
    return function (target, propertyKey) {
        Reflect.defineMetadata(AUTH_META_KEY, required, target, propertyKey)
    }
}
