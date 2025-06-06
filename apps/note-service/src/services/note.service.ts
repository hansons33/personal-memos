import pool from "@micro-memos/database"
import { ResultSetHeader } from "mysql2"
export class NoteService {
    async createNote(userId: number, dto: { title: string; content: string }) {
        const sql = `INSERT INTO memos(user_id, title, content) VALUES(?,?,?)`
        const [result] = await pool.query<ResultSetHeader>(sql, [
            userId,
            dto.title,
            dto.content,
        ])
        if (result.insertId) {
            return {
                id: result.insertId,
            }
        } else {
            return {
                code: "-1",
                msg: "创建失败",
            }
        }
    }
}
