import { z } from "zod"
export abstract class ZodDto {
    abstract schema: z.ZodTypeAny
}
