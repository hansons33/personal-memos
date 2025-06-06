import { ResultSetHeader } from "mysql2"
import pool from "@micro-memos/database"
import { GetUserDto, LoginDto } from "../dto/user"
import { comparePassword, hashPassword } from "../utils/util"
import { signJwt } from "../utils/jwt"
import { v4 as uuidv4 } from "uuid"

export class UserService {
    async register(data: GetUserDto) {
        try {
            const [rows] = await pool.execute<ResultSetHeader>(
                `SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1`,
                [data.email, data.username]
            )
            const hashedPassword = await hashPassword(data.password)
            const id = uuidv4()
            const [result] = await pool.execute<ResultSetHeader>(
                `INSERT INTO users (id, username, email, password) VALUES(?,?,?,?)`,
                [id, data.username, data.email, hashedPassword]
            )
            const insertId = result.insertId
            return {
                id: insertId,
                username: data.username,
                email: data.email,
            }
        } catch (e: any) {
            if (e.code === "ER_DUP_ENTRY") {
                throw new Error("用户名已存在")
            }
            throw e
        }
    }
    async login(req: LoginDto) {
        const { username = "", email = "", password } = req
        console.log("到这里了吗")
        const [rows] = await pool.execute<ResultSetHeader>(
            `SELECT * FROM users where username = ? or email = ?`,
            [username, email]
        )
        const user = rows[0]
        if (!user) {
            throw new Error("User not found")
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            throw new Error(`Invalid password`)
        }
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
        }
        const token = signJwt(payload)
        return {
            user: payload,
            token,
        }
    }
    async findById(id: number) {
        const [rows] = await pool.query(
            `SELECT id,username,email,created_at FROM users WHERE id = ?`,
            [id]
        )
        return rows[0]
    }
}
