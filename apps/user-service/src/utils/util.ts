import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
// 加密
export async function hashPassword(plainPassword: string) {
    return bcrypt.hash(plainPassword, 10)
}

export async function comparePassword(plainPassword: string, hash: string) {
    return await bcrypt.compare(plainPassword, hash)
}
