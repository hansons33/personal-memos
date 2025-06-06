import { Request, Response, NextFunction } from "express"
import { CommonErrorMessages } from "./types/codes"

export function responseMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const originalJson = res.json.bind(res)
    res.json = (body: { code?: number; message?: string; data?: any }) => {
        if (typeof body === "object") {
            const { code, data } = body
            if (body.code !== undefined) {
                const message = body.message ?? CommonErrorMessages[body.code]
                if (body.code == 0) {
                    return originalJson({
                        code,
                        message,
                        data,
                    })
                }
            }
        }
        return originalJson({
            code: 0,
            message: "success",
            data: body,
        })
    }
    next()
}
