import { ValidateDto } from "@micro-memos/validation"
import { zodProp } from "@micro-memos/validation"
import { z } from "zod"

export class GetUserDto {
    @zodProp(z.string().min(3))
    username: string

    @zodProp(z.string().email())
    email: string

    @zodProp(z.string().min(6))
    password: string
}
@ValidateDto((schema) => {
    schema.superRefine((data, ctx) => {
        if (!data.username || !data.email) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "用户名和邮箱必须至少填写一个",
                path: ["email"],
            })
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "用户名和邮箱必须至少填写一个",
                path: ["email"],
            })
        }
    })
    return schema
})
export class LoginDto {
    @zodProp(z.string().email().optional())
    email?: string

    @zodProp(z.string().min(3).optional())
    username?: string

    @zodProp(z.string())
    password: string
}
