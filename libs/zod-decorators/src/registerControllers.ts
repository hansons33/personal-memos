import { Express, Request, Response } from "express"
import { PARAMS_KEY, ParamMetaData } from "./decorators/params"
import { ROUTES_KEY, RouteDefinition } from "./decorators/routes"
import { getZodSchemaFromClass } from "./decorators/zodProp"
import { AUTH_META_KEY } from "./decorators/auth"
import { authMiddleware } from "./middlewares/auth.middleware"

export function registerControllers(app: Express, controllers: any[]) {
    controllers.forEach((controllerClass) => {
        console.log("123")
        const instance = new controllerClass()
        const prototype = Object.getPrototypeOf(instance)
        const prefix: string =
            Reflect.getMetadata("controller:prefix", controllerClass) || ""
        const routes: RouteDefinition[] =
            Reflect.getMetadata(ROUTES_KEY, controllerClass) || []

        routes.forEach((route) => {
            const handler = prototype[route.handlerName]
            const paramMeta: ParamMetaData[] =
                Reflect.getOwnMetadata(
                    PARAMS_KEY,
                    prototype,
                    route.handlerName
                ) || []
            const authRequired = Reflect.getMetadata(
                AUTH_META_KEY,
                prototype,
                route.handlerName
            )
            const middlewares = []
            console.log(authRequired)
            if (authRequired) {
                middlewares.push(authMiddleware)
            }
            ;(app as any)[route.method](
                prefix + route.path,
                ...middlewares,
                async (req: Request, res: Response) => {
                    try {
                        const args: any[] = []

                        for (const meta of paramMeta) {
                            let value: any

                            // 获取原始参数
                            switch (meta.source) {
                                case "body":
                                    value = req.body || {}
                                    break
                                case "query":
                                    value = req.query || {}
                                    break
                                case "params":
                                    value = req.params || {}
                                    break
                                case "user":
                                    value = (req as any).user
                                    break
                            }

                            // 有 DTO 类型，进行 Zod 校验
                            if (meta.dtoClass) {
                                const schema = getZodSchemaFromClass(
                                    meta.dtoClass
                                )
                                console.log(value, "这里拿到了信息吗")
                                const result = schema.safeParse(value)
                                console.log(result, "这里呢")
                                if (!result.success) {
                                    console.log(result.error.errors, "有错屋吗")
                                    const formattedErrors =
                                        result.error.errors.map((err) => {
                                            const fieldPath = err.path.length
                                                ? err.path.join(".")
                                                : "(body)"
                                            return `${fieldPath}: ${err.message}`
                                        })
                                    return res.status(400).json({
                                        message: "Validation failed",
                                        error: formattedErrors,
                                    })
                                }

                                args[meta.index] = result.data
                            } else {
                                args[meta.index] = value
                            }
                        }
                        const result = await handler.apply(instance, args)
                        res.json(result)
                    } catch (err) {
                        res.status(400).json({
                            message: err.message,
                        })
                    }
                }
            )
        })
    })
}
