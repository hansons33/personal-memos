import * as userModel from "../models/user.model"
import { hashPassword, comparePassword } from "../utils/util"
import { signJwt } from "../utils/jwt"

export async function register(username: string, password: string) {
    const existing = await userModel.findUserByUsername(username)
    if (existing) throw new Error("用户名已存在")
    const hashed = await hashPassword(password)
    const userId = await userModel.createUser({ username, password: hashed })
    return { userId }
}
export async function login(username: string, password: string) {
    const user = await userModel.findUserByUsername(username)
    if (!user || !(await comparePassword(user.password, password))) {
        throw new Error("用户名或密码错误")
    }
    const token = signJwt({ id: user.id, username })
    return token
}
