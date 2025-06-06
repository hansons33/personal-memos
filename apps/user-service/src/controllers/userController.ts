import { Get, Post } from "@micro-memos/validation"
import { Controller } from "@micro-memos/validation"
import { Body, User } from "@micro-memos/validation"
import { GetUserDto, LoginDto } from "../dto/user"
import { Auth } from "@micro-memos/validation"
import { UserService } from "../services/user.service"
import { JwtPayload } from "jsonwebtoken"

// 注册用户
@Controller("/user")
export class UserController {
    private userService = new UserService()
    @Post("/register")
    async register(@Body() req: GetUserDto) {
        console.log("wtf")
        return await this.userService.register(req)
    }

    @Post("/login")
    async login(@Body() req: LoginDto) {
        return await this.userService.login(req)
    }
    @Get("/profile")
    @Auth()
    async getProfile(@User() user: JwtPayload) {
        const userInfo = await this.userService.findById(user.id)
        return {
            id: userInfo.id,
            username: userInfo.username,
            email: userInfo.email,
            createAt: userInfo.createAt,
        }
    }
}
