import { NextFunction, Request, Response } from "express"
import { verifyJwt } from "../../../../apps/user-service/src/utils/jwt"
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const user = verifyJwt(token)
    if (!user) {
        return res.status(401).json({ message: "Invalid token" })
    }
    ;(req as any).user = user
    next()
}
