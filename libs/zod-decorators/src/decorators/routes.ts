import "reflect-metadata"

const ROUTES_KEY = Symbol("controllers:routes")
type Method = "get" | "post"
export interface RouteDefinition {
    method: Method
    path: string
    handlerName: string | symbol
}

export function Controller(prefix: string) {
    return function (constructor: Function) {
        console.log(constructor, prefix)
        Reflect.defineMetadata("controller:prefix", prefix, constructor)
    }
}

function createMethodDecorator(method: Method) {
    return function (path: string): MethodDecorator {
        return function (target, propertyKey) {
            const constructor = target.constructor
            const routes: RouteDefinition[] =
                Reflect.getMetadata(ROUTES_KEY, constructor) || []
            routes.push({
                path,
                method,
                handlerName: propertyKey,
            })
            Reflect.defineMetadata(ROUTES_KEY, routes, constructor)
        }
    }
}

export const Get = createMethodDecorator("get")
export const Post = createMethodDecorator("post")
export { ROUTES_KEY }      
