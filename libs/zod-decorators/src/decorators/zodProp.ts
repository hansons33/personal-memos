import "reflect-metadata"
import { z, ZodTypeAny } from "zod"
import { getClassRules } from "./validateDto"

const ZOD_PROP_KEY = Symbol("zod:prop")

export function zodProp(schema: ZodTypeAny): PropertyDecorator {
    return (target, propertKey) => {
        const existingProps: Record<string | symbol, ZodTypeAny> =
            Reflect.getMetadata(ZOD_PROP_KEY, target.constructor) || {}
        existingProps[propertKey] = schema
        Reflect.defineMetadata(ZOD_PROP_KEY, existingProps, target.constructor)
    }
}

export function getZodSchemaFromClass(clazz: new () => ZodTypeAny) {
    const props: Record<string | symbol, ZodTypeAny> =
        Reflect.getMetadata(ZOD_PROP_KEY, clazz) || []
    const schema = z.object(props)
    const rules = getClassRules(clazz)
    return rules.reduce((acc, rule) => rule(acc), schema)
}
