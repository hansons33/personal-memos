import "reflect-metadata"
import { ZodTypeAny } from "zod"

type ParamSource = "body" | "query" | "params" | "user"

export interface ParamMetaData {
    index: number
    source: ParamSource
    dtoClass?: new () => ZodTypeAny
}

const PARAMS_KEY = Symbol("route:params")

export function createParamDecorator(source: ParamSource): ParameterDecorator {
    return function (target, methodName, paramIndex) {
        const existingParams: ParamMetaData[] =
            Reflect.getOwnMetadata(PARAMS_KEY, target, methodName!) || []
        const paramTypes = Reflect.getMetadata(
            "design:paramtypes",
            target,
            methodName!
        )
        existingParams.push({
            index: paramIndex,
            source,
            dtoClass: paramTypes[paramIndex],
        })
        Reflect.defineMetadata(PARAMS_KEY, existingParams, target, methodName!)
    }
}
export const User = (): ParameterDecorator => {
    return function (target, methodName, paramIndex) {
        const existingParams: ParamMetaData[] =
            Reflect.getMetadata(PARAMS_KEY, target, methodName!) || []
        existingParams.push({
            index: paramIndex,
            source: "user",
        })
        Reflect.defineMetadata(PARAMS_KEY, existingParams, target, methodName!)
    }
}
export { PARAMS_KEY }
