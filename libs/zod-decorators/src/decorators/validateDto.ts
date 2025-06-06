import { ZodTypeAny, ZodObject } from "zod"

const DTO_RULES_KEY = Symbol("dto-rules")

export type ClassValidatorFn = (schema: ZodObject<any>) => ZodObject<any>

export function ValidateDto(rule: ClassValidatorFn): ClassDecorator {
    return (target) => {
        const existingRules: ClassValidatorFn[] =
            Reflect.getMetadata(DTO_RULES_KEY, target) || []
        existingRules.push(rule)
        Reflect.defineMetadata(DTO_RULES_KEY, existingRules, target)
    }
}

export function getClassRules(target: any): ClassValidatorFn[] {
    return Reflect.getMetadata(DTO_RULES_KEY, target) || []
}
