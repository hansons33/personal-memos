import express from "express"
import cors from "cors"
import { registerControllers } from "@micro-memos/validation"
import { UserController } from "./controllers/userController"
const app = express()
app.use(cors())
app.use(express.json())

registerControllers(app, [UserController])

app.get("/health", (req, res) => {
    res.json({
        status: "user-service is running",
    })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`User Service listening on port ${PORT}`)
})
