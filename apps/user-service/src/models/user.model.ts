import pool from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
export interface User {
    username: string
    password: string
}
export interface UserRow extends RowDataPacket {
    id: string
    username: string
    password: string
}
// 根据用户名查找用户
export async function findUserByUsername(username: string) {
    const [rows] = await pool.query<UserRow[]>(
        "SELECT * from user where username = ?",
        [username]
    )
    return rows[0] || null
}
// 创建新用户
export async function createUser(params: User) {
    const { username, password } = params
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT into user (username, password) VALUES (?,?)`,
        [username, password]
    )
    return result.insertId
}
// 校验用户密码
export async function validateUser(params: User) {
    const { username, password } = params
    const user = await findUserByUsername(username)
    return user.password === password
}
